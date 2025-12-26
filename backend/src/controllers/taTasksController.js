import { supabase } from '../db/supabase.js';

// Assign task (professor)
export const assignTask = async (req, res) => {
  console.log("Assign task payload received:", req.body); // log the payload
  const { ta_id, course_id, task_title, task_description, due_date } = req.body;

  if (!ta_id || !course_id || !task_title || !task_description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabase
  .from("ta_tasks")
  .insert([{
    ta_id: req.body.ta_id,
    course_id: req.body.course_id,
    
    professor_id: req.body.professor_id, // <- remove .id
    task_description: req.body.task_description,
    task_title: req.body.task_title,
    due_date: req.body.due_date,
    status: "pending"
  }])
  .select();


    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    console.log("Task assigned successfully:", data);
    res.json({ message: "Task assigned successfully", task: data[0] });
  } catch (err) {
    console.error("Caught exception while assigning task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get tasks for a TA
export const getTATasks = async (req, res) => {
  const { taId } = req.params;

  const { data, error } = await supabase
    .from("ta_tasks")
    .select(`
      id,
      task_title,
      task_description,
      due_date,
      status,
      subjects:course_id (
        subject_name
      )
    `)
    .eq("ta_id", Number(taId));


  if (error) {
    console.error("Error fetching TA tasks:", error);
    return res.status(500).json(error);
  }

  res.json(
    data.map(task => ({
      ...task,
      course_name: task.subjects?.subject_name || "Unknown"
    }))
  );
  console.log("Fetching tasks for TA:", taId);
console.log("Supabase data:", data);
console.log("Supabase error:", error);

};



// Mark task as completed (TA)
export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  const { data, error } = await supabase
    .from('ta_tasks')
    .update({ status: 'completed' })
    .eq('id', taskId)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};
