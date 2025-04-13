// server/routes/recipeRoutes.js
const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const auth = require('../middleware/auth'); // Use new auth middleware
const { upload } = require('../config/cloudinary');

// Public routes - no authentication required
router.get("/", recipeController.getAllRecipes);
router.get("/search", recipeController.searchRecipes);
router.get("/user/:userId", recipeController.getRecipesByUser);
router.get("/:id", recipeController.getRecipeById);

// Protected routes - require authentication
router.post("/", auth, upload.single("image"), recipeController.createRecipe);
router.put("/:id", auth, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", auth, recipeController.deleteRecipe);

module.exports = router;