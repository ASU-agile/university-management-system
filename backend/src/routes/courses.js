//backend/src/routes/courses.js

import express from "express";
import { supabase, supabasePriv } from "../db/supabase.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// POST /api/courses/upload-content - Staff uploads course materials
router.post("/upload-content", upload.single("file"), async (req, res) => {
  try {
    console.log("=== UPLOAD REQUEST ===");
    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);
    console.log("=== END ===");

    if (!req.file) {
      console.log("File is missing! Checking req.files...", req.files);
      return res.status(400).json({ error: "No file uploaded. File field may be missing or empty." });
    }

    const { subject_id, professor_id, content_type, assignment_deadline, assignment_title } = req.body;

    // Normalize and validate content_type from the request. If not provided
    // we keep the old behaviour of defaulting to 'project'. If an unknown
    // value is supplied, normalize to 'other'. This helps keep DB values
    // consistent until we convert the column to an ENUM.
    let inputCt = (content_type || "").toString().toLowerCase();
    if (inputCt === "exams") inputCt = "exam"; // normalize plural
    const allowedTypes = [
      "lecture",
      "project",
      "lab",
      "slides",
      "reading",
      "video",
      "exam",
      "assignment",
      "other",
    ];

    const normalizedContentType = (() => {
      if (!inputCt) return "project"; // keep prior default when missing
      return allowedTypes.includes(inputCt) ? inputCt : "other";
    })();

    if (!subject_id) {
      return res.status(400).json({ error: "subject_id is required" });
    }

    const fileName = `${subject_id}_${Date.now()}_${req.file.originalname}`;

    // Upload file to supabase storage using service role client
    const { error: uploadError } = await supabasePriv.storage
      .from("materials")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
      });

    if (uploadError) throw uploadError;

    // If this is an assignment upload, create the assignment first
    let newAssignmentId = null;
    if (normalizedContentType === "assignment" && assignment_deadline && assignment_title) {
      console.log("Creating assignment with:", {
        subject_id: parseInt(subject_id),
        professor_id: professor_id ? parseInt(professor_id) : null,
        title: assignment_title,
        deadline: assignment_deadline,
      });

      const { data: assignmentData, error: assignmentError } = await supabasePriv
        .from("assignments")
        .insert([
          {
            subject_id: parseInt(subject_id),
            professor_id: professor_id ? parseInt(professor_id) : null,
            title: assignment_title,
            deadline: assignment_deadline,
          },
        ])
        .select();

      if (assignmentError) {
        console.error("Assignment creation error:", assignmentError);
        throw assignmentError;
      }
      newAssignmentId = assignmentData[0].id;
      console.log("Created assignment:", newAssignmentId);
    }

    // Save record to materials table using service role client (bypass RLS)
    // Use the normalized content type determined earlier.
    const { data, error: dbError } = await supabasePriv
      .from("materials")
      .insert([
        {
          subject_id: parseInt(subject_id),
          professor_id: professor_id ? parseInt(professor_id) : null,
          file_name: req.file.originalname,
          file_path: fileName,
          content_type: normalizedContentType,
          assignment_id: newAssignmentId,
          uploaded_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) throw dbError;

    res.json({ success: true, file_path: fileName, data: data[0] });

  } catch (err) {
    console.error("Upload error:", err);
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

// DELETE /api/courses/:id/materials/:materialId - Delete course material
router.delete("/:id/materials/:materialId", async (req, res) => {
  try {
    const { id, materialId } = req.params;
    const { file_path } = req.body;

    if (!file_path) {
      return res.status(400).json({ error: "file_path is required" });
    }

    // Delete from storage using service role client
    const { error: deleteError } = await supabasePriv.storage
      .from("materials")
      .remove([file_path]);

    if (deleteError) throw deleteError;

    // Delete from database using service role client (bypass RLS)
    const { error: dbError } = await supabasePriv
      .from("materials")
      .delete()
      .eq("id", parseInt(materialId))
      .eq("subject_id", parseInt(id));

    if (dbError) throw dbError;

    res.json({ success: true, message: "Material deleted successfully" });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
