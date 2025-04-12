// server/routes/reviewRoutes.js
const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require('../middleware/auth'); // Use new auth middleware

// Public routes - no authentication required
router.get("/recipe/:recipeId", reviewController.getReviewsByRecipe);
router.get("/user/:userId", reviewController.getReviewsByUser);
router.get("/:id", reviewController.getReviewById);

// Protected routes - require authentication
router.post("/", auth, reviewController.createReview);
router.put("/:id", auth, reviewController.updateReview);
router.delete("/:id", auth, reviewController.deleteReview);

module.exports = router;