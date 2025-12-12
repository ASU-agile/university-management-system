// backend/src/routes/auth.js
import express from "express";
import { supabase } from "../db/supabase.js"; // make sure this exports as ESM

const router = express.Router();

// --- HELPER: Map type_id to role string ---
const getRoleFromTypeId = (type_id) => {
  switch (type_id) {
    case 1: return 'staff';
    case 2: return 'student';
    case 3: return 'admin';
    default: return 'student';
  }
};

// --- REGISTER ROUTE ---
router.post('/register', async (req, res) => {
  const { email, password, role, major_id } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  if (role.toLowerCase() === 'student' && !major_id) {
    return res.status(400).json({ error: 'Major is required for students' });
  }

  try {
    // 1️⃣ Sign up in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) return res.status(400).json({ error: authError.message });

    // 2️⃣ Determine type_id
    let type_id;
    switch (role.toLowerCase()) {
      case 'admin': type_id = 3; break;
      case 'staff': type_id = 1; break;
      case 'student': type_id = 2; break;
      default: type_id = 2;
    }

    // 3️⃣ Insert into users table and get inserted row
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([{ user_name: email.split('@')[0], user_email: email, type_id }])
      .select()
      .single();

    if (insertError) return res.status(500).json({ error: 'Failed to insert user in users table' });

    // 4️⃣ If student, assign major in student_major table
    if (role.toLowerCase() === 'student') {
      // Check major exists
      const { data: majorCheck, error: majorErr } = await supabase
        .from('majors')
        .select('id')
        .eq('id', major_id)
        .single();

      if (majorErr || !majorCheck) return res.status(400).json({ error: 'Major does not exist' });

      // Insert into student_major using correct user_id
      const { error: studentMajorErr } = await supabase
        .from('student_major')
        .insert([{ user_id: insertedUser.id, major_id }]);

      if (studentMajorErr) return res.status(500).json({ error: 'Failed to assign major' });
    }

    res.json({
      message: 'User registered successfully!',
      user: {
        email,
        role,
        major_id: role.toLowerCase() === 'student' ? major_id : null
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  try {
    // 1️⃣ Sign in via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return res.status(400).json({ error: authError.message });

    // 2️⃣ Fetch user from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_email', email)
      .single();

    if (userError || !userData) return res.status(404).json({ error: 'User not found in users table' });

    const role = getRoleFromTypeId(userData.type_id);

    let major = null;
    // 3️⃣ If student, fetch major info
    if (role === 'student') {
      const { data: majorData, error: majorErr } = await supabase
        .from('student_major')
        .select('majors(id, major_name)')
        .eq('user_id', userData.id)
        .single();

      if (!majorErr && majorData) major = majorData.majors;
    }

    res.json({
      message: 'User logged in successfully!',
      session: authData.session,
      user: {
        id: userData.id,
        email: userData.user_email,
        role,
        major // null if not student
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
