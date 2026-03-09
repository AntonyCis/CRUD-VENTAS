const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Endpoint: POST /api/login
router.post('/login', login);

module.exports = router;