const express = require('express');
const router = express.Router();
const { chatWithJarvis } = require('../controllers/chatController');

// POST request to /api/chat will trigger our controller
router.post('/chat', chatWithJarvis);

module.exports = router;