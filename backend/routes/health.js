const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: 'forjustice-backend',
      version: process.env.API_VERSION || 'v1'
    };

    // Check database connection
    try {
      await db.query('SELECT 1');
      health.database = 'connected';
    } catch (dbError) {
      health.database = 'disconnected';
      health.status = 'degraded';
      logger.error('Health check: Database connection failed', { error: dbError.message });
    }

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
  } catch (error) {
    logger.error('Health check failed', { error: error.message });
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

router.get('/ready', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ ready: true });
  } catch (error) {
    logger.error('Readiness check failed', { error: error.message });
    res.status(503).json({ ready: false, error: error.message });
  }
});

router.get('/live', (req, res) => {
  res.status(200).json({ live: true });
});

module.exports = router;
