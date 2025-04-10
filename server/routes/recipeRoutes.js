// server/routes/recipeRoutes.js

const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");
const { checkJwt, verifyUser, optionalAuth } = require('../middleware/auth0');
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/recipes/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG and PNG files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
});

// Public routes - no authentication required
router.get("/", recipeController.getAllRecipes);
router.get("/search", recipeController.searchRecipes);
router.get("/user/:userId", recipeController.getRecipesByUser);
router.get("/:id", optionalAuth, recipeController.getRecipeById);

// Protected routes - require authentication
router.post("/", checkJwt, verifyUser, upload.single("image"), recipeController.createRecipe);
router.put("/:id", checkJwt, verifyUser, upload.single("image"), recipeController.updateRecipe);
router.delete("/:id", checkJwt, verifyUser, recipeController.deleteRecipe);

module.exports = router;