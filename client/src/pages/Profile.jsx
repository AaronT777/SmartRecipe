import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { UserService, RecipeService } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import "./Profile.css";

const Profile = () => {
  const { user, authUser, getToken } = useAuth();
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    username: "",
    email: "",
  });
  const [updateErrors, setUpdateErrors] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      
      // Initialize edit form data with current user data
      setEditFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, getToken]);

  const fetchUserData = async () => {
    setLoading(true);

    try {
      // Get user's created recipes
      const userId = user._id;
      const createdResponse = await RecipeService.getRecipesByUser(userId);
      setCreatedRecipes(createdResponse.data);

      // Get user's saved recipes
      const savedResponse = await UserService.getSavedRecipes(getToken);
      setSavedRecipes(savedResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    try {
      await UserService.unsaveRecipe(recipeId, getToken);
      // Remove the unsaved recipe from the saved recipes list
      setSavedRecipes(savedRecipes.filter((recipe) => recipe._id !== recipeId));
    } catch (err) {
      console.error("Error unsaving recipe:", err);
      alert("Failed to unsave recipe. Please try again.");
    }
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (updateErrors[name]) {
      setUpdateErrors({
        ...updateErrors,
        [name]: null,
      });
    }
  };

  // Validate edit form
  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (editFormData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!editFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(editFormData.email)) {
      newErrors.email = "Email address is invalid";
    }

    setUpdateErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    setUpdating(true);

    try {
      await UserService.updateProfile(editFormData, getToken);
      
      setUpdating(false);
      setShowEditModal(false);
      alert("Profile updated successfully!");
      
      // Refresh the user data
      window.location.reload();
    } catch (err) {
      setUpdating(false);

      if (err.response && err.response.data.message) {
        // Handle specific errors from the backend
        if (err.response.data.message.includes("email")) {
          setUpdateErrors({ email: "This email is already registered" });
        } else if (err.response.data.message.includes("username")) {
          setUpdateErrors({ username: "This username is already taken" });
        } else {
          setUpdateErrors({ general: err.response.data.message });
        }
      } else {
        setUpdateErrors({ general: "Update failed. Please try again." });
      }

      console.error("Update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.username} 
                className="rounded-circle" 
                width="80" 
                height="80"
              />
            ) : (
              user?.username.charAt(0)
            )}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{user?.username}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>
        <button
          className="btn btn-outline-success edit-profile-btn"
          onClick={() => setShowEditModal(true)}
        >
          Edit Profile
        </button>
      </div>

      <div className="recipes-section">
        <div className="recipes-tabs">
          <button
            className={`tab-btn ${activeTab === "created" ? "active" : ""}`}
            onClick={() => setActiveTab("created")}
          >
            Created
          </button>
          <button
            className={`tab-btn ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            Saved
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "created" ? (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">My Created Recipes</h2>
                <Link to="/build" className="btn btn-success">
                  <i className="bi bi-plus-lg"></i> Create New Recipe
                </Link>
              </div>

              {createdRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't created any recipes yet.</p>
                  <Link to="/build" className="btn btn-success">
                    Create Your First Recipe
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {createdRecipes.map((recipe) => (
                    <div className="col-md-4 mb-4" key={recipe._id}>
                      <RecipeCard 
                        recipe={recipe} 
                        showSaveButton={false} 
                        getToken={getToken}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="section-title">My Saved Recipes</h2>
              </div>

              {savedRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>You haven't saved any recipes yet.</p>
                  <Link to="/search" className="btn btn-success">
                    Discover Recipes
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {savedRecipes.map((recipe) => (
                    <div className="col-md-4 mb-4" key={recipe._id}>
                      <RecipeCard
                        recipe={recipe}
                        showSaveButton={false}
                        onUnsave={handleUnsaveRecipe}
                        getToken={getToken}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="modal-backdrop"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal" tabIndex="-1" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Profile</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {updateErrors.general && (
                    <div className="alert alert-danger">
                      {updateErrors.general}
                    </div>
                  )}
                  <form onSubmit={handleEditSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          updateErrors.username ? "is-invalid" : ""
                        }`}
                        id="username"
                        name="username"
                        value={editFormData.username}
                        onChange={handleEditChange}
                      />
                      {updateErrors.username && (
                        <div className="invalid-feedback">
                          {updateErrors.username}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className={`form-control ${
                          updateErrors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        value={editFormData.email}
                        disabled={true}  // Email cannot be changed with Auth0
                      />
                      {updateErrors.email && (
                        <div className="invalid-feedback">
                          {updateErrors.email}
                        </div>
                      )}
                      <small className="form-text text-muted">
                        Email address cannot be changed through SmartRecipe. 
                        Please update it through your Auth0 account settings.
                      </small>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowEditModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={updating}
                      >
                        {updating ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
