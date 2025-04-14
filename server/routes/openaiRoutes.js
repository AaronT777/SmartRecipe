const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');
const auth = require('../middleware/auth');

// Generate recipe route - requires authentication
router.post('/generate-recipe', auth, openaiController.generateRecipe);

module.exports = router;