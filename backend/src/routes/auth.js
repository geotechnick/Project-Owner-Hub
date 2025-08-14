const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../services/supabase');

const router = express.Router();

// Add a simple test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, organizationName, contactInfo } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email,
        password_hash: hashedPassword,
        organization_name: organizationName,
        contact_info: contactInfo
      }])
      .select();

    if (error) throw error;

    const token = jwt.sign(
      { userId: data[0].id, email: data[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: data[0].id, email: data[0].email } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, data.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: data.id, email: data.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: data.id, email: data.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;