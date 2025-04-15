// Updated RecipeCard.jsx with proper heading hierarchy

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import './RecipeCard.css';

const RecipeCard = ({ recipe, showSaveButton = true, onUnsave = null }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, getToken, login } = useAuth();
  const { _id, recipeName, description, cookingTime, calories, userId } = recipe;
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Check if the recipe is saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (isAuthenticated && user) {
        try {
          const savedRecipesResponse = await UserService.getSavedRecipes(getToken);
          const savedRecipes = savedRecipesResponse.data;
          const recipeIsSaved = savedRecipes.some(savedRecipe => savedRecipe._id === _id);
          setIsSaved(recipeIsSaved);
        } catch (err) {
          console.error("Error checking if recipe is saved:", err);
        }
      }
    };
    
    checkIfSaved();
  }, [_id, isAuthenticated, user, getToken]);
  
  // Image fallback handler
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
  };

  // Check if current user is the creator of this recipe
  const isCreator = user && user._id === userId;

  // Handle save recipe
  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!isAuthenticated) {
      login();
      return;
    }
    
    try {
      setIsSaving(true);
      await UserService.saveRecipe(_id, getToken);
      setIsSaved(true);
      setIsSaving(false);
    } catch (err) {
      console.error('Error saving recipe:', err);
      setIsSaving(false);
      alert('Failed to save recipe. Please try again.');
    }
  };

  // Handle unsave recipe
  const handleUnsaveRecipe = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onUnsave) {
      onUnsave(_id);
    }
  };

  return (
    <div className="recipe-card-wrapper">
      <div className="card recipe-card h-100">
        <img 
          src={recipe.image || '/images/placeholder.png'} 
          className="card-img-top" 
          alt={`${recipeName} dish`}
          onError={handleImageError}
        />
        <div className="card-body d-flex flex-column">
          {/* Change h5 to h3 for proper heading hierarchy */}
          <h3 className="card-title">{recipeName}</h3>
          <p className="card-text flex-grow-1">{description?.substring(0, 100)}{description?.length > 100 ? '...' : ''}</p>
          <div className="recipe-meta">
            <span>{cookingTime ? `${cookingTime} min` : 'Time N/A'}</span>
            <span>{calories ? `${calories} calories` : 'Calories N/A'}</span>
          </div>
          <div className="card-actions">
            <Link to={`/recipe/${_id}`} className="btn btn-outline-success view-btn" aria-label={`View ${recipeName} recipe details`}>
              View
            </Link>
            
            {showSaveButton && !isCreator && isAuthenticated && (
              <button 
                className={`btn ${isSaved ? 'btn-success' : 'btn-outline-success'} save-btn`}
                onClick={handleSaveRecipe}
                disabled={isSaving || isSaved}
                aria-label={isSaved ? `${recipeName} recipe saved` : `Save ${recipeName} recipe`}
              >
                {isSaving ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : isSaved ? (
                  <span><i className="bi bi-bookmark-check" aria-hidden="true"></i> Saved</span>
                ) : (
                  <span><i className="bi bi-bookmark" aria-hidden="true"></i> Save</span>
                )}
              </button>
            )}
            
            {isCreator && (
              <Link to={`/recipe/edit/${_id}`} className="btn btn-light edit-btn" aria-label={`Edit ${recipeName} recipe`}>
                Edit
              </Link>
            )}
            
            {onUnsave && (
              <button 
                className="btn btn-outline-danger unsave-btn"
                onClick={handleUnsaveRecipe}
                aria-label={`Unsave ${recipeName} recipe`}
              >
                Unsave
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    recipeName: PropTypes.string.isRequired,
    description: PropTypes.string,
    cookingTime: PropTypes.number,
    calories: PropTypes.number,
    userId: PropTypes.string,
    image: PropTypes.string
  }).isRequired,
  showSaveButton: PropTypes.bool,
  onUnsave: PropTypes.func
};

export default RecipeCard;