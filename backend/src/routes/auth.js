const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

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
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Email, password, and role are required' });
  }

  try {
    // 1️⃣ Sign up via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      console.error('Registration error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    // 2️⃣ Determine type_id based on role
    let type_id;
    switch (role.toLowerCase()) {
      case 'admin': type_id = 3; break;
      case 'staff': type_id = 1; break;
      case 'student': type_id = 2; break;
      default: type_id = 2;
    }

    // 3️⃣ Insert into users table
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          user_name: email.split('@')[0], // simple username
          user_email: email,
          type_id
        }
      ]);

    if (insertError) {
      console.error('Error inserting into users table:', insertError.message);
      return res.status(500).json({ error: 'Failed to insert user in users table' });
    }

    res.json({
      message: 'User registered successfully!',
      data
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // 1️⃣ Sign in via Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    // 2️⃣ Fetch user from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_email', email)
      .single();

    if (userError || !userData) {
      console.error('User not found in users table:', userError?.message);
      return res.status(404).json({ error: 'User not found in users table' });
    }

    // 3️⃣ Map type_id to role
    const role = getRoleFromTypeId(userData.type_id);

    res.json({
      message: 'User logged in successfully!',
      session: data.session,
      user: {
        id: userData.id,
        email: data.user.email,
        role
      }
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
