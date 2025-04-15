import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { RecipeService, OpenAIService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "./AddRecipe.css";

const AddRecipe = ({ isEditing }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { isAuthenticated, getToken } = useAuth();

  const [recipeData, setRecipeData] = useState({
    recipeName: "",
    description: "",
    cookingTime: "",
    calories: "",
    ingredients: [""],
    instructions: [""],
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(isEditing);

  // Check if we have ingredients from location state (from Home page)
  useEffect(() => {
    // If there are ingredients in the location state and we're not editing
    if (location.state?.ingredients && !isEditing) {
      generateRecipeFromIngredients(location.state.ingredients);
    }
  }, [location.state, isEditing]);

  // Fetch recipe data if editing
  useEffect(() => {
    if (isEditing && id && isAuthenticated) {
      fetchRecipeData();
    }
  }, [isEditing, id, isAuthenticated, getToken]);

  // Generate recipe using OpenAI
  const generateRecipeFromIngredients = async (ingredients) => {
    setGenerating(true);
    try {
      const response = await OpenAIService.generateRecipe(
        ingredients,
        getToken
      );
      const recipe = response.data;

      // Set recipe data from AI response
      setRecipeData({
        recipeName: recipe.recipeName,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        calories: recipe.calories,
        ingredients: recipe.ingredients, // Should be an array already
        instructions: recipe.instructions, // Should be an array already
        image: null, // We'll handle the image separately
      });

      // If there's an image URL, set the preview
      if (recipe.image) {
        // 创建data URI用于预览
        const imageDataUrl = `data:image/jpeg;base64,${recipe.image}`;
        setImagePreview(imageDataUrl);
      }

      setGenerating(false);
    } catch (err) {
      console.error("Error generating recipe:", err);
      alert(
        "Failed to generate recipe. Please try again or create one manually."
      );
      setGenerating(false);
    }
  };

  // Fetch recipe data if editing
  const fetchRecipeData = async () => {
    try {
      setIsLoadingRecipe(true);
      const response = await RecipeService.getRecipeById(id);
      const recipe = response.data;

      // Format instructions as array for form
      const instructionsArray = recipe.instructions
        .split("\n")
        .map((step) => step.trim())
        .filter((step) => step);

      // Set recipe data in form
      setRecipeData({
        recipeName: recipe.recipeName,
        description: recipe.description,
        cookingTime: recipe.cookingTime,
        calories: recipe.calories,
        ingredients: recipe.ingredients,
        instructions: instructionsArray,
        image: null, // Original image will be kept if no new one is uploaded
      });

      // If there's an image, set the preview
      if (recipe.image) {
        setImagePreview(recipe.image);
      }

      setIsLoadingRecipe(false);
    } catch (err) {
      console.error("Error fetching recipe data:", err);
      alert("Failed to load recipe data for editing.");
      navigate(`/recipe/${id}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({
      ...recipeData,
      [name]: value,
    });
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipeData.ingredients];
    newIngredients[index] = value;
    setRecipeData({
      ...recipeData,
      ingredients: newIngredients,
    });
  };

  const addIngredientField = () => {
    setRecipeData({
      ...recipeData,
      ingredients: [...recipeData.ingredients, ""],
    });
  };

  const removeIngredientField = (index) => {
    if (recipeData.ingredients.length > 1) {
      const newIngredients = [...recipeData.ingredients];
      newIngredients.splice(index, 1);
      setRecipeData({
        ...recipeData,
        ingredients: newIngredients,
      });
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...recipeData.instructions];
    newInstructions[index] = value;
    setRecipeData({
      ...recipeData,
      instructions: newInstructions,
    });
  };

  const addInstructionField = () => {
    setRecipeData({
      ...recipeData,
      instructions: [...recipeData.instructions, ""],
    });
  };

  const removeInstructionField = (index) => {
    if (recipeData.instructions.length > 1) {
      const newInstructions = [...recipeData.instructions];
      newInstructions.splice(index, 1);
      setRecipeData({
        ...recipeData,
        instructions: newInstructions,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeData({
        ...recipeData,
        image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!recipeData.recipeName.trim()) {
      newErrors.recipeName = "Recipe name is required";
    }

    if (!recipeData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!recipeData.cookingTime) {
      newErrors.cookingTime = "Cooking time is required";
    } else if (isNaN(recipeData.cookingTime) || recipeData.cookingTime <= 0) {
      newErrors.cookingTime = "Cooking time must be a positive number";
    }

    if (
      recipeData.calories &&
      (isNaN(recipeData.calories) || recipeData.calories <= 0)
    ) {
      newErrors.calories = "Calories must be a positive number";
    }

    const emptyIngredients = recipeData.ingredients.some((ing) => !ing.trim());
    if (emptyIngredients) {
      newErrors.ingredients = "All ingredient fields must be filled";
    }

    const emptyInstructions = recipeData.instructions.some(
      (inst) => !inst.trim()
    );
    if (emptyInstructions) {
      newErrors.instructions = "All instruction steps must be filled";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);

    try {
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("recipeName", recipeData.recipeName);
      formData.append("description", recipeData.description);
      formData.append("cookingTime", recipeData.cookingTime);
      formData.append("calories", recipeData.calories || 0);
      formData.append("ingredients", JSON.stringify(recipeData.ingredients));
      formData.append("instructions", recipeData.instructions.join("\n"));

      if (recipeData.image) {
        // This is the file uploaded by the user
        formData.append("image", recipeData.image);
      } else if (imagePreview && imagePreview.startsWith("data:")) {
        // Deal with base64 image data. This is the AI-generated image that hasn't been uploaded yet.
        const response = await fetch(imagePreview);
        const blob = await response.blob();
        const file = new File([blob], "ai-generated-image.jpg", {
          type: "image/jpeg",
        });
        formData.append("image", file);
      }

      let response;
      if (isEditing) {
        response = await RecipeService.updateRecipe(id, formData, getToken);
      } else {
        response = await RecipeService.createRecipe(formData, getToken);
      }

      setLoading(false);

      const successMessage = isEditing
        ? "Recipe updated successfully!"
        : "Recipe created successfully!";

      alert(successMessage);

      // Navigate to recipe detail page
      navigate(`/recipe/${isEditing ? id : response.data._id}`);
    } catch (err) {
      setLoading(false);
      console.error("Error saving recipe:", err);
      alert("Failed to save recipe. Please try again.");
    }
  };

  if (generating) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Generating AI recipe...</span>
        </div>
        <p className="mt-2">
          Our AI chef is crafting a perfect recipe for you...
        </p>
        <p className="text-muted">This may take a few moments</p>
      </div>
    );
  }

  if (isLoadingRecipe) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading recipe data...</span>
        </div>
        <p className="mt-2">Loading recipe data...</p>
      </div>
    );
  }

  return (
    <div className="add-recipe-container">
      <h1 className="page-title">
        {isEditing
          ? "Edit Recipe"
          : location.state?.ingredients
          ? "AI Generated Recipe"
          : "Create Your Recipe"}
      </h1>

      {location.state?.ingredients && !isEditing && (
        <div className="alert alert-success mb-4">
          <h5>AI Generated Recipe from Your Ingredients:</h5>
          <p className="mb-0">
            We've created a recipe using:{" "}
            <strong>{location.state.ingredients.join(", ")}</strong>. Feel free
            to review and edit before publishing!
          </p>
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="alert alert-danger">
          <h5>Please fix the following errors:</h5>
          <ul className="mb-0">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="recipe-form">
        <div className="mb-4">
          <label htmlFor="recipeName" className="form-label">
            Recipe Title
          </label>
          <input
            type="text"
            className={`form-control ${errors.recipeName ? "is-invalid" : ""}`}
            id="recipeName"
            name="recipeName"
            value={recipeData.recipeName}
            onChange={handleInputChange}
            placeholder="e.g. Homemade Spaghetti Bolognese"
          />
          {errors.recipeName && (
            <div className="invalid-feedback">{errors.recipeName}</div>
          )}
        </div>

        <div className="row mb-4">
          <div className="col-md-6">
            <label htmlFor="cookingTime" className="form-label">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              className={`form-control ${
                errors.cookingTime ? "is-invalid" : ""
              }`}
              id="cookingTime"
              name="cookingTime"
              value={recipeData.cookingTime}
              onChange={handleInputChange}
              placeholder="e.g. 45"
              min="1"
            />
            {errors.cookingTime && (
              <div className="invalid-feedback">{errors.cookingTime}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="calories" className="form-label">
              Calories (optional)
            </label>
            <input
              type="number"
              className={`form-control ${errors.calories ? "is-invalid" : ""}`}
              id="calories"
              name="calories"
              value={recipeData.calories}
              onChange={handleInputChange}
              placeholder="e.g. 450"
              min="1"
            />
            {errors.calories && (
              <div className="invalid-feedback">{errors.calories}</div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="recipeImage" className="form-label">
            Recipe Cover{" "}
            {isEditing &&
              !recipeData.image &&
              "(Leave empty to keep current image)"}
          </label>
          <div className="custom-file-upload">
            {imagePreview ? (
              <div className="image-preview-container">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="image-preview"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger remove-image"
                  onClick={() => {
                    setImagePreview(null);
                    setRecipeData({ ...recipeData, image: null });
                  }}
                  aria-label="Remove image"
                >
                  <span>&times;</span>
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <input
                  type="file"
                  id="recipeImage"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                <label htmlFor="recipeImage" className="file-label">
                  <div className="upload-icon">📷</div>
                  <div>Click or drag to upload image</div>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            id="description"
            name="description"
            value={recipeData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Describe your recipe - what makes it special?"
          ></textarea>
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Ingredients</label>
          {errors.ingredients && (
            <div className="text-danger mb-2">{errors.ingredients}</div>
          )}

          {recipeData.ingredients.map((ingredient, index) => (
            <div className="input-group mb-2" key={`ingredient-${index}`}>
              <input
                type="text"
                className="form-control"
                value={ingredient}
                onChange={(e) => handleIngredientChange(index, e.target.value)}
                placeholder="e.g. 2 cups flour"
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeIngredientField(index)}
                disabled={recipeData.ingredients.length === 1}
              >
                <span>&times;</span>
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={addIngredientField}
          >
            + Add Ingredient
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label">Cooking Steps</label>
          {errors.instructions && (
            <div className="text-danger mb-2">{errors.instructions}</div>
          )}

          {recipeData.instructions.map((step, index) => (
            <div className="input-group mb-3" key={`step-${index}`}>
              <span className="input-group-text">{index + 1}</span>
              <textarea
                className="form-control"
                value={step}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                placeholder="Describe this cooking step"
                rows="2"
              ></textarea>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeInstructionField(index)}
                disabled={recipeData.instructions.length === 1}
              >
                <span>&times;</span>
              </button>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline-success btn-sm"
            onClick={addInstructionField}
          >
            + Add Step
          </button>
        </div>

        <div className="d-grid mt-5">
          <button
            type="submit"
            className="btn btn-success btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {isEditing ? "Updating Recipe..." : "Creating Recipe..."}
              </>
            ) : isEditing ? (
              "Update Recipe"
            ) : (
              "Publish Recipe"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
