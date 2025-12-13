//backend/src/routes/courses.js

import express from "express";
import { supabase } from "../db/supabase.js";

const router = express.Router();

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

// ----------------------------------------------------------
// NEW — GET COURSE CATALOG (CORE + ELECTIVES + REGISTRATION STATUS)
// ----------------------------------------------------------
router.get("/catalog/:studentId", async (req, res) => {
  const studentId = req.params.studentId;

  try {
    // 1. Get student's major
    const { data: majorData, error: majorErr } = await supabase
      .from("student_major")
      .select("major_id")
      .eq("user_id", studentId)
      .single();

    if (majorErr || !majorData)
      return res.status(400).json({ error: "Student major not found" });

    const majorId = majorData.major_id;

    // 2. Fetch core subjects
    const { data: core, error: coreErr } = await supabase
      .from("subjects")
      .select("*")
      .eq("major_id", majorId)
      .eq("is_elective", false);

    // 3. Fetch electives
    const { data: electives, error: electivesErr } = await supabase
      .from("subjects")
      .select("*")
      .eq("major_id", majorId)
      .eq("is_elective", true);

    // 4. Fetch student registered subjects
    const { data: registered, error: regErr } = await supabase
      .from("student_subject")
      .select("subject_id")
      .eq("student_id", studentId);

    const registeredSet = new Set(registered?.map(r => r.subject_id));

    // Add "registered: true/false" to each subject
    const coreWithStatus = core?.map(c => ({ ...c, registered: registeredSet.has(c.id) })) || [];
    const electivesWithStatus = electives?.map(e => ({ ...e, registered: registeredSet.has(e.id) })) || [];

    res.json({
      success: true,
      core: coreWithStatus,
      electives: electivesWithStatus
    });

  } catch (err) {
    console.error("Catalog error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------------------------------------------------
// NEW — REGISTER SUBJECT WITH RULES (MAX CREDIT HOURS + MAX 2 ELECTIVES)
// ----------------------------------------------------------
router.post("/register/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  const { subject_id } = req.body;

  try {
    // 1. Fetch subject info
    const { data: subject, error: subErr } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", subject_id)
      .single();

    if (subErr || !subject)
      return res.status(404).json({ error: "Subject not found" });

    // 2. Fetch student major
    const { data: majorData } = await supabase
      .from("student_major")
      .select("major_id")
      .eq("user_id", studentId)
      .single();

    if (majorData.major_id !== subject.major_id)
      return res.status(400).json({ error: "Subject does not belong to your major" });

    // 3. Prevent duplicate registration
    const { data: dup } = await supabase
      .from("student_subject")
      .select("*")
      .eq("student_id", studentId)
      .eq("subject_id", subject_id);

    if (dup.length > 0)
      return res.status(400).json({ error: "Already registered" });

    // 4. Check elective limit
    if (subject.is_elective === true) {
      const { data: electiveCount } = await supabase
        .from("student_subject")
        .select(`subject_id, subjects (is_elective)`)
        .eq("student_id", studentId)
        .eq("subjects.is_elective", true);

      if (electiveCount.length >= 2)
        return res.status(400).json({ error: "Max electives reached (2)" });
    }

    // 5. Check credit hours limit
    const { data: allSubjects } = await supabase
      .from("student_subject")
      .select(`
        subject_id,
        subjects (credit_hours)
      `)
      .eq("student_id", studentId);

    const currentCredits = allSubjects.reduce(
      (sum, row) => sum + (row.subjects?.credit_hours || 0),
      0
    );

    if (currentCredits + subject.credit_hours > 18)
      return res.status(400).json({
        error: `Credit limit exceeded. Current ${currentCredits}, adding ${subject.credit_hours}`
      });

    // 6. Insert registration
    const { error: insertErr } = await supabase
      .from("student_subject")
      .insert([{ student_id: studentId, subject_id }]);

    if (insertErr) return res.status(400).json({ error: insertErr.message });

    res.json({ success: true, message: "Registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
