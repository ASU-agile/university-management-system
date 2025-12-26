import express from "express";
import { supabase } from "../db/supabase.js";

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
