// backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');

// Endpoint: GET /api/dashboard
router.get('/', getDashboardStats);

module.exports = router;