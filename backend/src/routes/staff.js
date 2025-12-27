import express from "express";
import { supabase, supabasePriv } from "../db/supabase.js";
import upload from "../middleware/upload.js";

const router = express.Router();

/**
 * GET /api/staff
 * Returns all professors and teaching assistants
 */
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, user_name, user_email, type_id")
      .in("type_id", [1, 4]) // Professor & TA
      .order("user_name", { ascending: true });

    if (error) throw error;

    const staff = data.map(user => ({
      id: user.id,
      name: user.user_name,
      email: user.user_email,
      role: user.type_id === 1 ? "Professor" : "Teaching Assistant"
    }));

    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch staff directory" });
  }
});

/**
 * GET /api/staff/:id
 * Returns full profile for a specific staff member
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { data, error } = await supabase
      .from("users")
      .select("id, user_name, user_email, type_id, bio, profile_picture_url, certificates")
      .eq("id", id)
      .single();

    if (error) throw error;

    let majorName = null;
    if (data.type_id === 2) { // 2 = Student
      const { data: majorData } = await supabase
        .from('student_major')
        .select('majors(major_name)')
        .eq('user_id', id)
        .single();

      if (majorData?.majors) {
        majorName = majorData.majors.major_name;
      }
    }

    res.json({
      id: data.id,
      name: data.user_name,
      email: data.user_email,
      role: data.type_id === 1 ? "Professor" : data.type_id === 2 ? "Student" : data.type_id === 3 ? "Admin" : "Teaching Assistant",
      major: majorName, // Add major field
      bio: data.bio || "",
      profile_picture_url: data.profile_picture_url || "",
      certificates: data.certificates || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch staff profile" });
  }
});

/**
 * PUT /api/staff/:id/profile
 * Update bio and certificates
 * Body: { bio, certificates }
 */
router.put("/:id/profile", async (req, res) => {
  try {
    const id = req.params.id;
    const { bio, certificates, major_id } = req.body;

    const updates = {};
    if (bio !== undefined) updates.bio = bio;
    if (certificates !== undefined) updates.certificates = certificates;

    // 1. Update users table (bio, certificates, etc.)
    if (Object.keys(updates).length > 0) {
      const { error: userError } = await supabasePriv
        .from("users")
        .update(updates)
        .eq("id", id);
      if (userError) throw userError;
    }

    // 2. Update student_major if major_id provided
    if (major_id) {
      const { error: majorError } = await supabasePriv
        .from("student_major")
        .upsert({ user_id: id, major_id }, { onConflict: 'user_id' });
      if (majorError) throw majorError;
    }

    // 3. Fetch final updated data (join with major for convenience)
    const { data: userData, error: fetchError } = await supabasePriv
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    let majorName = null;
    if (userData.type_id === 2) {
      const { data: majorData } = await supabasePriv
        .from('student_major')
        .select('majors(major_name)')
        .eq('user_id', id)
        .single();
      if (majorData?.majors) majorName = majorData.majors.major_name;
    }

    res.json({
      ...userData,
      major: majorName
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile", error: err.message });
  }
});

/**
 * POST /api/staff/:id/upload-avatar
 * Upload profile picture
 */
router.post("/:id/upload-avatar", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `avatar_${id}_${Date.now()}.${fileExt}`;

    // Upload to 'avatars' bucket
    const { error: uploadError } = await supabasePriv.storage
      .from("avatars")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabasePriv.storage
      .from("avatars")
      .getPublicUrl(fileName);

    // Update user record
    const { error: dbError } = await supabasePriv
      .from("users")
      .update({ profile_picture_url: publicUrl })
      .eq("id", id);

    if (dbError) throw dbError;

    res.json({ success: true, url: publicUrl });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Failed to upload avatar", error: err.message });
  }
});

/**
 * POST /api/staff/:id/upload-certificate
 * Upload certificate file
 */
router.post("/:id/upload-certificate", upload.single("file"), async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `cert_${id}_${Date.now()}_${req.file.originalname}`;

    // Upload to 'certificates' bucket
    const { error: uploadError } = await supabasePriv.storage
      .from("certificates")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabasePriv.storage
      .from("certificates")
      .getPublicUrl(fileName);

    res.json({ success: true, url: publicUrl, name: req.file.originalname });
  } catch (err) {
    console.error("Certificate upload error:", err);
    res.status(500).json({ message: "Failed to upload certificate", error: err.message });
  }
});

/**
 * GET /api/staff/:id/office-hours
 * Returns office hours for a specific staff member
 */
router.get("/:id/office-hours", async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const { data, error } = await supabase
      .from("office_hours")
      .select("id, day, start_time, end_time, location")
      .eq("staff_id", staffId)
      .order("day", { ascending: true })
      .order("start_time", { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch office hours" });
  }
});

/**
 * POST /api/staff/:id/office-hours
 * Replace office hours for a staff member with the provided array
 * Body: { hours: [{ day, start_time, end_time, location? }, ...] }
 */
router.post("/:id/office-hours", async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const hours = Array.isArray(req.body.hours) ? req.body.hours : [];

    // Delete existing hours for the staff member
    const { error: delError } = await supabase
      .from("office_hours")
      .delete()
      .eq("staff_id", staffId);

    if (delError) throw delError;

    if (hours.length === 0) {
      return res.json([]);
    }

    const rows = hours.map((h) => ({
      staff_id: staffId,
      day: h.day,
      start_time: h.start_time,
      end_time: h.end_time,
      location: h.location || ""
    }));

    const { data, error } = await supabase
      .from("office_hours")
      .insert(rows)
      .select();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save office hours" });
  }
});


/**
 * GET /api/staff/:id/subjects
 * Returns subjects assigned to a staff member
 */
router.get("/:id/subjects", async (req, res) => {
  try {
    const staffId = Number(req.params.id);

    const { data, error } = await supabase
      .from("staff_subjects")
      .select("subject_id, subjects (id, subject_name, subject_code, credit_hours, is_elective)")
      .eq("staff_id", staffId)
      .order("subject_id", { ascending: true });

    if (error) throw error;

    // map to just the subjects array
    const subjects = (data || []).map((row) => row.subjects || { id: row.subject_id });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch staff subjects", error: err.message, details: err.hint || err.details });
  }
});

/**
 * POST /api/staff/:id/subjects
 * Replace subject assignments for a staff member
 * Body: { subject_ids: [1,2,3] }
 */
router.post("/:id/subjects", async (req, res) => {
  try {
    const staffId = Number(req.params.id);
    const subjectIds = Array.isArray(req.body.subject_ids) ? req.body.subject_ids.map(Number) : [];

    // Remove existing assignments
    const { error: delErr } = await supabase
      .from("staff_subjects")
      .delete()
      .eq("staff_id", staffId);

    if (delErr) throw delErr;

    if (subjectIds.length === 0) return res.json([]);

    const rows = subjectIds.map((sid) => ({ staff_id: staffId, subject_id: sid }));

    const { data, error } = await supabase
      .from("staff_subjects")
      .insert(rows)
      .select("subject_id, subjects (id, subject_name, subject_code, credit_hours, is_elective)");

    if (error) throw error;

    const subjects = (data || []).map((r) => r.subjects || { id: r.subject_id });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update staff subjects" });
  }
});

export default router;
