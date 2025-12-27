import express from "express";
import upload from "../middleware/upload.js";
import { supabasePriv as supabase } from "../db/supabase.js";

const router = express.Router();

// get assignment details
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(400).json({ error });
  res.json(data);

});

// GET /:id/submission - Get specific student submission for an assignment
router.get("/:id/submission", async (req, res) => {
  const { id } = req.params;
  const student_id = parseInt(req.query.student_id);

  console.log(`Fetching submission for assignment ${id}, student ${student_id}`);

  try {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", id)
      .eq("student_id", student_id)
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching submission:", error);
      throw error;
    }

    console.log("Submission data found:", data);
    res.json(data); // returns null if no submission
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// submit assignment (MULTER VERSION)

router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }


    const assignment_id = parseInt(req.body.assignment_id);
    const student_id = parseInt(req.body.student_id);

    const fileName = `${student_id}_${assignment_id}_${Date.now()}_${req.file.originalname}`;

    // Upload file buffer to supabase

    const { error: uploadError } = await supabase.storage
      .from("submissions")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });


    if (uploadError) throw uploadError;

    // Save DB record

    const { error: dbError } = await supabase
      .from("assignment_submissions")
      .insert([
        {
          assignment_id,
          student_id,
          file_path: fileName,
          submitted_at: new Date().toISOString(),
        },
      ]);

    if (dbError) throw dbError;

    res.json({ success: true, file_path: fileName });

  } catch (err) {
    console.error("Submit error:", err);
    res.status(500).json({ error: err.message });
  }
});


// GET /:id/submissions - Get all submissions for an assignment (includes non-submitters)
router.get("/:id/submissions", async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get assignment details (need subject_id and deadline)
    const { data: assignment, error: assignError } = await supabase
      .from("assignments")
      .select("subject_id, deadline")
      .eq("id", id)
      .single();

    if (assignError) throw assignError;

    const { subject_id, deadline } = assignment;

    // 2. Get all students enrolled in this subject
    // We join student_subject -> users
    const { data: students, error: studentError } = await supabase
      .from("student_subject")
      .select(`
        student:users (
          id,
          user_name,
          user_email
        )
      `)
      .eq("subject_id", subject_id);

    if (studentError) throw studentError;

    // 3. Get all existing submissions for this assignment
    const { data: submissions, error: submissionError } = await supabase
      .from("assignment_submissions")
      .select("*")
      .eq("assignment_id", id);

    if (submissionError) throw submissionError;

    // 4. Merge lists
    // Create a map of student_id -> submission for quick lookup
    const submissionMap = {};
    submissions.forEach((sub) => {
      submissionMap[sub.student_id] = sub;
    });

    const combinedList = students.map((row) => {
      const student = row.student;
      if (!student) return null; // Should not happen if DB is consistent

      const sub = submissionMap[student.id];

      let status = "Not Submitted";
      let isLate = false;
      let finalSubmission = null;

      if (sub) {
        status = "Submitted";
        finalSubmission = sub;

        // Check if late
        if (deadline && new Date(sub.submitted_at) > new Date(deadline)) {
          isLate = true;
        }
      }

      return {
        ...finalSubmission, // details from submission if exists (id, file_path, grade, feedback, etc)
        student: student,   // student details
        status,
        isLate,
        // If no submission, we still want these fields potentially null or handled in UI
        submission_id: sub ? sub.id : null,
      };
    }).filter(Boolean); // remove nulls

    res.json(combinedList);

  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /submissions/:submissionId - Update grade and comment
router.put("/submissions/:submissionId", async (req, res) => {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;

  console.log(`Updating submission ${submissionId}:`, { grade, feedback });

  try {
    const { data, error } = await supabase
      .from("assignment_submissions")
      .update({ grade, feedback })
      .eq("id", submissionId)
      .select();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    console.error("Grade save error:", err);
    res.status(500).json({ error: err.message, details: err });
  }
});

export default router;