//backend/src/routes/assignments.js
import express from "express";
import upload from "../middleware/upload.js";
import { supabase } from "../db/supabase.js";

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


export default router;