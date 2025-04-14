const Recipe = require("../models/Recipe");
const User = require("../models/User");
const path = require("path");
const { cloudinary, extractPublicId } = require("../config/cloudinary");
const fs = require("fs");

// Get all recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Check if user is authenticated to determine if the recipe is saved
    let isSaved = false;
    if (req.user) {
      const user = await User.findOne({ auth0Id: req.user.id });
      if (user) {
        isSaved = user.savedRecipes.includes(recipe._id);
      }
    }

    // Send recipe info with saved status
    res.json({
      ...recipe.toObject(),
      isSaved,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    res.status(500).send("Server Error");
  }
};

// Create a recipe
exports.createRecipe = async (req, res) => {
  try {
    const {
      recipeName,
      description,
      cookingTime,
      calories,
      ingredients,
      instructions,
    } = req.body;

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Use Cloudinary URL
    const imageUrl = req.file ? req.file.path : req.body.imageUrl || null;

    // Create new recipe object
    const newRecipe = new Recipe({
      recipeName,
      description,
      cookingTime,
      calories,
      ingredients: JSON.parse(ingredients),
      instructions,
      userId: user._id,
      image: imageUrl,
    });

    const recipe = await newRecipe.save();
    res.json(recipe);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Check user owns the recipe
    if (recipe.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const {
      recipeName,
      description,
      cookingTime,
      calories,
      ingredients,
      instructions,
    } = req.body;

    // Build recipe object
    const recipeFields = {};
    if (recipeName) recipeFields.recipeName = recipeName;
    if (description) recipeFields.description = description;
    if (cookingTime) recipeFields.cookingTime = cookingTime;
    if (calories) recipeFields.calories = calories;
    if (ingredients) recipeFields.ingredients = JSON.parse(ingredients);
    if (instructions) recipeFields.instructions = instructions;

    // Deal with image upload
    if (req.file) {
      try {
        console.log("Cloudinary URL:", req.file.path);

        // When using CloudinaryStorage, req.file.path is already the Cloudinary URL
        recipeFields.image = req.file.path;

        // If the recipe already has an image and it's different from the new one, delete the old image
        if (recipe.image && recipe.image !== req.file.path) {
          console.log("Deleting old image:", recipe.image);
          await deleteCloudinaryImage(recipe.image);
        }
      } catch (err) {
        console.error("Error handling image upload:", err);
        return res
          .status(500)
          .json({ msg: "Error uploading image to cloud storage" });
      }
    } else if (req.body.imageUrl) {
      // If no file is uploaded but an image URL is provided (from AI-generated image)
      recipeFields.image = req.body.imageUrl;
    }

    // Update recipe
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: recipeFields },
      { new: true }
    );

    res.json(recipe);
  } catch (err) {
    console.error("Update recipe error:", err);
    res.status(500).send("Server Error");
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    if (!user) {
      return res.status(404).json({ msg: "User not found in database" });
    }

    // Check user owns the recipe
    if (recipe.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    // Delete the recipe image from Cloudinary
    if (recipe.image) {
      await deleteCloudinaryImage(recipe.image);
    }

    await Recipe.findByIdAndRemove(req.params.id);
    res.json({ msg: "Recipe removed" });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Recipe not found" });
    }

    res.status(500).send("Server Error");
  }
};

const deleteCloudinaryImage = async (imageUrl) => {
  try {
    const publicId = extractPublicId(imageUrl);
    if (publicId) {
      console.log("Deleting Cloudinary image with public ID:", publicId);
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary delete result:", result);
      return result;
    } else {
      console.log("Could not extract public ID from URL:", imageUrl);
    }
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
  }
};

// Get recipes by user ID
exports.getRecipesByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Search recipes
exports.searchRecipes = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ msg: "Search query is required" });
    }

    // Search in recipe name, description, or ingredients
    const recipes = await Recipe.find({
      $or: [
        { recipeName: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { ingredients: { $in: [new RegExp(query, "i")] } },
      ],
    }).sort({ createdAt: -1 });

    res.json(recipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
