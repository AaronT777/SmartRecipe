// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Add new route for user registration/update
router.post('/profile', auth, userController.registerOrUpdateUser);

// Update all routes to use new auth middleware
router.get('/profile', auth, userController.getUserProfile);
router.put('/profile', auth, userController.updateUserProfile);
router.post('/save-recipe', auth, userController.saveRecipe);
router.delete('/unsave-recipe/:id', auth, userController.unsaveRecipe);
router.get('/saved-recipes', auth, userController.getSavedRecipes);
router.get('/:userId', userController.getUserById);
router.get('/:userId/saved-recipes', userController.getSavedRecipesByUser);

module.exports = router;