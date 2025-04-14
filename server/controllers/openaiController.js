const openaiService = require('../services/openaiService');
const { cloudinary } = require('../config/cloudinary');

exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ msg: 'Ingredients are required as an array' });
    }

    // Generate recipe from OpenAI
    const recipeData = await openaiService.generateRecipe(ingredients);

    // Return the recipe data with image URL
    res.json(recipeData);
  } catch (err) {
    console.error('AI recipe generation error:', err.message);
    res.status(500).json({ message: 'Server Error: Failed to generate recipe' });
  }
};