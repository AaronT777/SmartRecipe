import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { RecipeService, ReviewService, UserService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import "./RecipeDetail.css";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, getToken, login } = useAuth();

  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [savingRecipe, setSavingRecipe] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const recipeResponse = await RecipeService.getRecipeById(id);
        setRecipe(recipeResponse.data);

        const reviewsResponse = await ReviewService.getReviewsByRecipe(id);
        setReviews(reviewsResponse.data);

        // Check if the recipe is saved by the current user
        if (isAuthenticated && user) {
          try {
            const savedRecipesResponse = await UserService.getSavedRecipes(
              getToken
            );
            const savedRecipes = savedRecipesResponse.data;
            if (savedRecipes.some((recipe) => recipe._id === id)) {
              setIsSaved(true);
            }
          } catch (err) {
            console.error("Error checking saved status:", err);
          }
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        setError("Failed to load recipe details. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id, isAuthenticated, user, getToken]);

  const handleSaveRecipe = async () => {
    if (!isAuthenticated) {
      login();
      return;
    }

    try {
      setSavingRecipe(true);
      await UserService.saveRecipe(id, getToken);
      setIsSaved(true);
      setSavingRecipe(false);
      alert("Recipe saved successfully!");
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert("Failed to save recipe. Please try again.");
      setSavingRecipe(false);
    }
  };

  const handleDeleteRecipe = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this recipe? This action cannot be undone."
      )
    ) {
      try {
        setDeletingRecipe(true);
        await RecipeService.deleteRecipe(id, getToken);
        setDeletingRecipe(false);
        alert("Recipe deleted successfully!");
        navigate("/profile");
      } catch (err) {
        console.error("Error deleting recipe:", err);
        alert("Failed to delete recipe. Please try again.");
        setDeletingRecipe(false);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      login();
      return;
    }

    if (!reviewText.trim()) {
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await ReviewService.createReview(
        {
          recipeId: id,
          comment: reviewText,
        },
        getToken
      );

      // Add the new review to the top of the reviews list
      setReviews([response.data, ...reviews]);
      setReviewText("");
      setSubmittingReview(false);
    } catch (err) {
      console.error("Error posting review:", err);
      alert("Failed to post review. Please try again.");
      setSubmittingReview(false);
    }
  };

  // Handle review deletion
  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated) {
      login();
      return;
    }

    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        setDeletingReviewId(reviewId);
        await ReviewService.deleteReview(reviewId, getToken);

        // Remove the deleted review from the state
        setReviews(reviews.filter((review) => review._id !== reviewId));
        setDeletingReviewId(null);
      } catch (err) {
        console.error("Error deleting review:", err);
        alert("Failed to delete review. Please try again.");
        setDeletingReviewId(null);
      }
    }
  };

  // Check if current user is creator of recipe
  const isCreator = user && recipe?.userId === user._id;

  if (isLoading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading recipe details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        {error}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="alert alert-warning m-5" role="alert">
        Recipe not found.
      </div>
    );
  }

  return (
    <div className="recipe-detail-container">
      <h1 className="recipe-title">{recipe.recipeName}</h1>

      <div className="recipe-meta-info">
        <span className="time-info">
          <i className="bi bi-clock"></i> {recipe.cookingTime} mins
        </span>
        <span className="calorie-info">
          <i className="bi bi-lightning"></i> {recipe.calories} calories
        </span>
      </div>

      <div className="action-buttons">
        <button className="btn btn-print" onClick={() => window.print()}>
          <i className="bi bi-printer"></i> Print
        </button>

        {!isCreator && (
          <button
            className="btn btn-success ms-2"
            onClick={handleSaveRecipe}
            disabled={savingRecipe || isSaved}
          >
            {savingRecipe ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : isSaved ? (
              <>
                <i className="bi bi-bookmark-check"></i> Saved
              </>
            ) : (
              <>
                <i className="bi bi-bookmark"></i> Save
              </>
            )}
          </button>
        )}

        {isCreator && (
          <>
            <Link
              to={`/recipe/edit/${id}`}
              className="btn btn-primary btn-edit ms-2"
            >
              <i className="bi bi-pencil"></i> Edit
            </Link>
            <button
              className="btn btn-danger ms-2"
              onClick={handleDeleteRecipe}
              disabled={deletingRecipe}
            >
              {deletingRecipe ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Deleting...
                </>
              ) : (
                <>
                  <i className="bi bi-trash"></i>{" "}
                  <span className="btn-delete">Delete</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      <div className="recipe-image-container">
        <img
          src={recipe.image || "/images/placeholder.png"}
          alt={recipe.recipeName}
          className="recipe-detail-image"
          onError={(e) => {
            e.target.src = "/images/placeholder.png";
          }}
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="description-section">
            <h2>Description</h2>
            <p>{recipe.description}</p>
          </div>

          <div className="instructions-section">
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.split("\n").map((step, index) => (
                <li key={index} className="instructions-item">
                  {step.replace(/^\d+\.\s*/, "")}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="col-md-4">
          <div className="ingredients-section">
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="ingredient-item">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="reviews-section mt-5">
        <h2>Reviews</h2>

        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="review-form">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Share your experience with this recipe..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                required
                disabled={submittingReview}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-success"
              disabled={submittingReview || !reviewText.trim()}
            >
              {submittingReview ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Posting...
                </>
              ) : (
                "Post Review"
              )}
            </button>
          </form>
        ) : (
          <div className="alert alert-info">
            <button onClick={login} className="alert-link btn btn-link p-0">
              Log in
            </button>{" "}
            to share your review
          </div>
        )}

        <div className="reviews-list mt-4">
          {reviews.length === 0 ? (
            <p className="text-muted">
              No reviews yet. Be the first to review this recipe!
            </p>
          ) : (
            reviews.map((review) => {
              // Check if the current user is the author of the review
              const isReviewAuthor = user && review.userId?._id === user._id;

              // Determine the profile link based on the review author
              const profileLink = isReviewAuthor
                ? "/profile"
                : `/user/${review.userId?._id}`;

              return (
                <div className="review-item" key={review._id}>
                  <div className="review-header">
                    <div className="reviewer-info">
                      <Link to={profileLink} className="user-profile-link">
                        {review.userId?.picture ? (
                          <img
                            src={review.userId.picture}
                            alt={review.userId.username}
                            className="rounded-circle me-2"
                            width="32"
                            height="32"
                          />
                        ) : (
                          <div className="review-avatar">
                            {review.userId?.username
                              ? review.userId.username.charAt(0)
                              : "?"}
                          </div>
                        )}
                        <span className="reviewer-name">
                          {review.userId?.username || "Anonymous"}
                        </span>
                      </Link>
                    </div>
                    <div className="review-date">
                      {new Date(review.timestamp).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div className="d-flex mt-2">
                    <div className="review-content flex-grow-1">
                      {review.comment}
                    </div>

                    {/* 删除按钮使用固定尺寸类 */}
                    {isReviewAuthor && (
                      <button
                        className="btn btn-sm btn-danger review-delete-btn ms-3"
                        onClick={() => handleDeleteReview(review._id)}
                        disabled={deletingReviewId === review._id}
                      >
                        {deletingReviewId === review._id ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          <>
                            <i className="bi bi-trash"></i> Delete
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
