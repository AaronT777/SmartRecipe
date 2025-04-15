import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { RecipeService, UserService } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import RecipeCard from "../components/RecipeCard";
import "./Profile.css"; // 复用现有样式

const UserProfile = () => {
  const { userId } = useParams();
  const { user, getToken } = useAuth();
  
  const [profileUser, setProfileUser] = useState(null);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("created");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Get user information
      const userResponse = await UserService.getUserById(userId);
      setProfileUser(userResponse.data);

      // Get created recipes by specified user
      const createdResponse = await RecipeService.getRecipesByUser(userId);
      setCreatedRecipes(createdResponse.data);

      // Get saved recipes by specified user
      const savedResponse = await UserService.getSavedRecipesByUser(userId);
      setSavedRecipes(savedResponse.data);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setLoading(false);
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

  if (!profileUser) {
    return (
      <div className="alert alert-warning m-5">
        User not found or has been deleted.
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {profileUser?.picture ? (
              <img 
                src={profileUser.picture} 
                alt={profileUser.username} 
                className="rounded-circle" 
                width="80" 
                height="80"
              />
            ) : (
              profileUser?.username.charAt(0)
            )}
          </div>
          <div className="profile-details">
            <h1 className="profile-name">{profileUser?.username}</h1>
            {/* Don't show email for privacy */}
          </div>
        </div>
        {/* No Edit button */}
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
                <h2 className="section-title">Created Recipes</h2>
              </div>

              {createdRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>This user hasn't created any recipes yet.</p>
                </div>
              ) : (
                <div className="row">
                  {createdRecipes.map((recipe) => (
                    <div className="col-md-4 mb-4" key={recipe._id}>
                      <RecipeCard 
                        recipe={recipe} 
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
                <h2 className="section-title">Saved Recipes</h2>
              </div>

              {savedRecipes.length === 0 ? (
                <div className="empty-state">
                  <p>This user hasn't saved any recipes yet.</p>
                </div>
              ) : (
                <div className="row">
                  {savedRecipes.map((recipe) => (
                    <div className="col-md-4 mb-4" key={recipe._id}>
                      <RecipeCard
                        recipe={recipe}
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
    </div>
  );
};

export default UserProfile;