import express from 'express';
import { supabase } from '../db/supabase.js';
import { assignTask, getTATasks, completeTask } from '../controllers/taTasksController.js';

const router = express.Router();

// Assign task
router.post('/assign', assignTask);

// Get tasks for TA
router.get('/ta/:taId', getTATasks);

// Complete task
router.patch('/:taskId/complete', completeTask);

// GET all TAs
router.get('/tas', async (req, res) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, user_name')
    .eq('type_id', 4);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
// GET courses for a professor
router.get('/courses', async (req, res) => {
  let { professorId } = req.query;
  console.log("Query param professorId:", professorId);

  if (!professorId) return res.status(400).json({ error: 'professorId required' });

  professorId = parseInt(professorId, 10);
  if (isNaN(professorId)) return res.status(400).json({ error: 'professorId must be a number' });

  try {
    const { data, error } = await supabase
      .from('subjects')                     // <-- use correct table
      .select('id, subject_name')           // <-- correct column
      .eq('professor_id', professorId);

    console.log("Supabase response data:", data);
    console.log("Supabase response error:", error);

    if (error) return res.status(500).json({ error: error.message });

    res.json(data);
  } catch (err) {
    console.error("Caught exception:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




export default router;
