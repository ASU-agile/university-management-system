const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // In v2, use signUp as an async function returning { data, error }
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (error) {
      console.error('Registration error:', error.message);
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'User registered successfully!', data });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
