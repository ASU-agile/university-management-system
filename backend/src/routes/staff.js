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

export default router;
