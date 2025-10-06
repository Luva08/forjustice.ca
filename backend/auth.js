const express = require('express');
const router = express.Router();
const users = [];

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.json({ message: 'User already exists' });
  }
  users.push({ email, password });
  res.json({ message: 'Registered successfully' });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful' });
});

module.exports = router;
