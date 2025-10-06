const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const logger = require('../utils/logger');

const SALT_ROUNDS = 12;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Register endpoint
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Validation error',
      message: 'Email and password are required' 
    });
  }

  if (password.length < 8) {
    return res.status(400).json({ 
      error: 'Validation error',
      message: 'Password must be at least 8 characters long' 
    });
  }

  try {
    // Check if user exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ 
        error: 'Conflict',
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password, name, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW()) 
       RETURNING id, email, name, created_at`,
      [email.toLowerCase(), hashedPassword, name || null]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    res.status(201).json({
      message: 'Registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    logger.error('Registration error', { error: error.message, email });
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Registration failed. Please try again later.' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Validation error',
      message: 'Email and password are required' 
    });
  }

  try {
    // Get user
    const result = await db.query(
      'SELECT id, email, password, name FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid credentials' 
      });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid credentials' 
      });
    }

    // Update last login
    await db.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    logger.error('Login error', { error: error.message, email });
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Login failed. Please try again later.' 
    });
  }
});

module.exports = router;
