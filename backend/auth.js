// Minimal starter Express authentication route scaffold
const express = require('express');
const router = express.Router();

// TODO: Implement registration, login, and session/token management
router.post('/register', (req, res) => {
  res.send('Register endpoint');
});

router.post('/login', (req, res) => {
  res.send('Login endpoint');
});

module.exports = router;