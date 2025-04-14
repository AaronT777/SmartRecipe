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

    // If there's image data, upload to Cloudinary
    let imageUrl = null;
    if (recipeData.image) {
      try {
        // Convert base64 to data URI
        const dataUri = `data:image/jpeg;base64,${recipeData.image}`;
        
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(dataUri, {
          folder: 'smartrecipe'
        });
        
        imageUrl = uploadResult.secure_url;
      } catch (err) {
        console.error('Error uploading image to Cloudinary:', err);
      }
    }

    // Return the recipe data with image URL
    res.json({
      ...recipeData,
      image: imageUrl
    });
  } catch (err) {
    console.error('AI recipe generation error:', err.message);
    res.status(500).json({ message: 'Server Error: Failed to generate recipe' });
  }
};