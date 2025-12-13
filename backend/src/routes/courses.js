//backend/src/routes/courses.js

import express from "express";
import { supabase } from "../db/supabase.js";

const router = express.Router();


router.get("/:id/materials", async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("materials")
      .select("*")
      .eq("subject_id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id/assignments", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("assignments")
      .select("*")
      .eq("subject_id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/courses/student/:id
router.get("/student/:id", async (req, res) => {
  const studentId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("student_subject")
      .select(`
    subject:subjects (
      id,
      subject_code,
      subject_name
    )
  `)
      .eq("student_id", studentId);


    if (error) return res.status(400).json({ error });

    const courses = data
      .map(row => row.subject)   // row.subject could be null if the FK is missing
      .filter(Boolean);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
