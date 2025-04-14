const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const openaiService = {
  generateRecipe: async (ingredients) => {
    try {
      const prompt = `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}.
      
      Please format your response in JSON with the following structure:
      {
        "recipeName": "Title of the Recipe",
        "description": "A detailed description of the dish (2-3 paragraphs)",
        "cookingTime": [time in minutes, as a number],
        "calories": [calories per serving, as a number],
        "ingredients": ["ingredient 1 with measurement", "ingredient 2 with measurement", ...],
        "instructions": ["step 1", "step 2", ...],
        "imagePrompt": "A detailed description for generating an image of this dish"
      }
      
      Be creative, but realistic. Only include the JSON without any additional text.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional chef who specializes in creating delicious recipes from available ingredients. Return your response as a JSON object without markdown formatting or code blocks."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      });

      // Deal with the response to remove any Markdown formatting
      let recipeContent = completion.choices[0].message.content;

      // Remove any code block markers
      recipeContent = recipeContent.replace(/```json\n|\n```|```/g, '');
      
      console.log("Raw content from OpenAI:", recipeContent);
      
      // Parse the JSON response
      const recipeData = JSON.parse(recipeContent);


      // Generate an image using OpenAI
      const imageResponse = await openai.images.generate({
        prompt: recipeData.imagePrompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      });

      // Adding image data to the recipeData object
      recipeData.image = imageResponse.data[0].b64_json;
      
      return recipeData;
    } catch (error) {
      console.error('Error generating recipe with OpenAI:', error);
      throw new Error('Failed to generate recipe using AI');
    }
  }
};

module.exports = openaiService;