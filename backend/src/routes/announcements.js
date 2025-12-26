// backend/src/routes/announcements.js
import express from "express";
import { supabase, supabasePriv } from "../db/supabase.js";

const router = express.Router();

// POST /api/announcements - Create new announcement (staff only)
router.post("/", async (req, res) => {
    try {
        const { course_id, created_by, title, content } = req.body;

        console.log("Received announcement creation request:", {
            course_id,
            created_by,
            title,
            content,
            raw_body: req.body
        });

        if (!course_id || !created_by || !title || !content) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const { data, error } = await supabasePriv
            .from("announcements")
            .insert([
                {
                    course_id: parseInt(course_id),
                    created_by: parseInt(created_by),
                    title,
                    content,
                    created_at: new Date().toISOString(),
                },
            ])
            .select();

        if (error) throw error;

        res.json({ success: true, data: data[0] });
    } catch (err) {
        console.error("Create announcement error:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/announcements/:courseId - Get all announcements for a course
router.get("/:courseId", async (req, res) => {
    try {
        const { courseId } = req.params;

        const { data, error } = await supabase
            .from("announcements")
            .select(`
        *,
        author:users!announcements_created_by_fkey (
          id,
          user_email
        )
      `)
            .eq("course_id", courseId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("Fetch announcements error:", err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/announcements/:id - Delete announcement (author only)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { created_by } = req.body;

        if (!created_by) {
            return res.status(400).json({ error: "created_by required" });
        }

        // Delete only if the user is the author
        const { error } = await supabasePriv
            .from("announcements")
            .delete()
            .eq("id", parseInt(id))
            .eq("created_by", parseInt(created_by));

        if (error) throw error;

        res.json({ success: true, message: "Announcement deleted" });
    } catch (err) {
        console.error("Delete announcement error:", err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
