// routes/statuses.js

const express = require('express');
const router = express.Router();

// Import your Status model
const { models } = require('../config/db');
const { Status } = models;

/**
 * GET /api/statuses
 * Retrieve all statuses.
 */
router.get('/', async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching statuses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/statuses
 * Create a new status.
 */
router.post('/', async (req, res) => {
  try {
    const newStatus = await Status.create(req.body);
    res.status(201).json(newStatus);
  } catch (error) {
    console.error('Error creating status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add more routes as needed (e.g., GET by ID, PUT, DELETE)

module.exports = router;
