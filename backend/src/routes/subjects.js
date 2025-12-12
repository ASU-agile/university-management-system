import express from "express";
import { supabase } from "../db/supabase.js";

const router = express.Router();

// Create one or multiple subjects (for multiple majors at once)
router.post("/", async (req, res) => {
  try {
    let { subject_name, subject_code, credit_hours, major_ids, is_elective } = req.body;

    // Validate required fields
    if (!subject_name || !subject_code || !credit_hours || !Array.isArray(major_ids) || major_ids.length === 0) {
      return res.status(400).json({ message: "subject_name, subject_code, credit_hours, and major_ids (array) are required" });
    }

    // Build an array of subjects for all majors
    const subjectsToInsert = major_ids.map((major_id) => ({
      subject_name,
      subject_code,
      credit_hours,
      major_id,
      is_elective: is_elective || false,
    }));

    const { data, error } = await supabase
      .from("subjects")
      .insert(subjectsToInsert)
      .select();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET single subject by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .eq("id", id)
      .single(); // fetch only one row

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Subject not found" });

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// GET ALL SUBJECTS (supports grouping)
router.get("/", async (req, res) => {
  try {
    const { group, byMajor } = req.query;
    const { data, error } = await supabase
      .from("subjects")
      .select("*")
      .order("subject_name", { ascending: true });

    if (error) throw error;

    let result = data;

    // Group by core/elective
    if (group === "true") {
      const core = data.filter((sub) => !sub.is_elective);
      const elective = data.filter((sub) => sub.is_elective);
      result = { core, elective };
    }

    // Group by major
    if (byMajor === "true") {
      const groupedByMajor = {};
      data.forEach((sub) => {
        const majorId = sub.major_id || "unassigned";
        if (!groupedByMajor[majorId]) groupedByMajor[majorId] = [];
        groupedByMajor[majorId].push(sub);
      });
      result = groupedByMajor;
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE SUBJECT
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { subject_name, subject_code, credit_hours, major_id, is_elective } = req.body;

    // Validate required fields if they are being updated
    if (subject_name === "" || subject_code === "" || credit_hours === "") {
      return res.status(400).json({ message: "Name, code, and credit hours cannot be empty" });
    }

    // Build update object dynamically, only include fields that exist in req.body
    const updates = {};
    if (subject_name !== undefined) updates.subject_name = subject_name;
    if (subject_code !== undefined) updates.subject_code = subject_code;
    if (credit_hours !== undefined) updates.credit_hours = credit_hours;
    if (major_id !== undefined) updates.major_id = major_id;
    if (is_elective !== undefined) updates.is_elective = is_elective;

    const { data, error } = await supabase
      .from("subjects")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data.length) return res.status(404).json({ message: "Subject not found" });

    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// DELETE SUBJECT
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Check dependencies
    const tables = ["assignments", "exams", "materials", "student_subject"];
    for (const table of tables) {
      const { data, error } = await supabase.from(table).select("*").eq("subject_id", id);
      if (error) throw error;
      if (data.length > 0) {
        return res.status(409).json({ message: `Cannot delete subject. It is used in ${table}` });
      }
    }

    const { data, error } = await supabase.from("subjects").delete().eq("id", id).select();
    if (error) throw error;
    if (!data.length) return res.status(404).json({ message: "Subject not found" });

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
