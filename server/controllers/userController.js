// server/controllers/userController.js
const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Register/Login are now handled by Auth0, we only need to store user profile
exports.registerOrUpdateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const auth0Id = req.user.id; // from auth middleware

    // console.log("Auth0 ID from token:", auth0Id);
    
    // Check if user already exists
    let user = await User.findOne({ auth0Id });
    // console.log("Existing user found:", user);
    
    if (user) {
      // Update existing user
      user.username = username || user.username;
      user.email = email || user.email;
      await user.save();
      return res.json(user);
    }
    
    // Create new user
    user = new User({
      auth0Id,
      username,
      email
    });
    
    await user.save();
    // console.log("New user created:", user);
    res.json(user);
  } catch (err) {
    console.error("User registration error:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ auth0Id: req.user.id });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // Build profile object
    const profileFields = {};
    if (username) profileFields.username = username;
    if (email) profileFields.email = email;
    
    // Update user profile
    const user = await User.findOneAndUpdate(
      { auth0Id: req.user.id },
      { $set: profileFields },
      { new: true }
    );
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Save a recipe
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    
    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    
    if (!recipe) {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Check if recipe is already saved
    if (user.savedRecipes.includes(recipeId)) {
      return res.status(400).json({ msg: 'Recipe already saved' });
    }
    
    // Add recipe to saved recipes
    user.savedRecipes.push(recipeId);
    await user.save();
    
    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recipe not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

// Unsave a recipe
exports.unsaveRecipe = async (req, res) => {
  try {
    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Remove recipe from saved recipes
    user.savedRecipes = user.savedRecipes.filter(
      id => id.toString() !== req.params.id
    );
    
    await user.save();
    
    res.json(user.savedRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get saved recipes
exports.getSavedRecipes = async (req, res) => {
  try {
    // Find user by Auth0 ID
    const user = await User.findOne({ auth0Id: req.user.id });
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const savedRecipes = await Recipe.find({
      _id: { $in: user.savedRecipes }
    });
    
    res.json(savedRecipes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // return only the necessary fields
    res.json({
      _id: user._id,
      username: user.username,
      picture: user.picture 
    });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).send('Server Error');
  }
};

exports.getSavedRecipesByUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    const savedRecipes = await Recipe.find({
      _id: { $in: user.savedRecipes }
    });
    
    res.json(savedRecipes);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.status(500).send('Server Error');
  }
};