import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RestaurantService } from "../services/api";
import "./Home.css";

export default function Home({ isLoggedIn }) {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingRestaurants, setIsLoadingRestaurants] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [coords, setCoords] = useState(null);
  const [offset, setOffset] = useState(0);

  // Fetch restaurants using geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });
          fetchRestaurantsByCoordinates(latitude, longitude, 0);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to Vancouver if geolocation fails
          setCurrentLocation("Vancouver, BC");
          fetchRestaurants("Vancouver, BC", 0);
        }
      );
    } else {
      // Geolocation not supported, use Vancouver as fallback
      setCurrentLocation("Vancouver, BC");
      fetchRestaurants("Vancouver, BC", 0);
    }
  }, []);

  const fetchRestaurantsByCoordinates = async (latitude, longitude, currentOffset = offset) => {
    try {
      setIsLoadingRestaurants(true);
      const response = await RestaurantService.getNearbyRestaurants({ 
        latitude,
        longitude,
        limit: 4,
        offset: currentOffset
      });
      setRestaurants(response.data);
      setOffset(currentOffset + 4); // Increment offset for next refresh
      setIsLoadingRestaurants(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setIsLoadingRestaurants(false);
    }
  };

  const fetchRestaurants = async (location = "Vancouver, BC", currentOffset = offset) => {
    try {
      setIsLoadingRestaurants(true);
      const response = await RestaurantService.getNearbyRestaurants({ 
        location,
        limit: 4,
        offset: currentOffset
      });
      setRestaurants(response.data);
      setOffset(currentOffset + 4); // Increment offset for next refresh
      setIsLoadingRestaurants(false);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      setIsLoadingRestaurants(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = () => {
    if (coords) {
      fetchRestaurantsByCoordinates(coords.latitude, coords.longitude);
    } else if (currentLocation) {
      fetchRestaurants(currentLocation);
    } else {
      // Fallback if no location is set
      fetchRestaurants("Vancouver, BC");
    }
  };

  const handleAddIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter((item) => item !== ingredient));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient();
    }
  };

  const handleFindRecipes = () => {
    if (ingredients.length === 0) return;

    setIsLoading(true);

    // Navigate to search page with ingredients as query parameters
    navigate(`/search?ingredients=${ingredients.join(",")}`);
  };

  const handleRestaurantDetails = (restaurantUrl) => {
    // Open the restaurant's Yelp page in a new tab
    window.open(restaurantUrl, '_blank');
  };

  return (
    <div className="home-container">
      <section className="kitchen-section">
        <h1 className="text-center my-4">What's in your kitchen?</h1>
        <p className="text-center mb-4">
          Enter ingredients you have and let our AI suggest delicious recipes
        </p>

        <div className="search-container">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter ingredients (e.g., chicken, rice, tomatoes)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              className="btn btn-outline-success"
              type="button"
              onClick={handleAddIngredient}
            >
              +
            </button>
          </div>

          {ingredients.length > 0 && (
            <div className="ingredients-tags mb-3">
              {ingredients.map((ingredient, index) => (
                <span key={index} className="ingredient-tag">
                  {ingredient}
                  <button
                    className="remove-tag"
                    onClick={() => handleRemoveIngredient(ingredient)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <button
            className="btn btn-success w-100"
            onClick={handleFindRecipes}
            disabled={ingredients.length === 0 || isLoading}
          >
            {isLoading ? "Finding Recipes..." : "Find Recipes"}
          </button>
        </div>
      </section>

      {/* Restaurant suggestions section */}
      <section className="restaurants-section my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">
            If you don't want to cook today
          </h2>
          <div className="carousel-controls">
            <button 
              className="more-options-btn" 
              onClick={handleRefresh}
              disabled={isLoadingRestaurants}
            >
              {isLoadingRestaurants ? 
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 
                "More Options"
              }
            </button>
          </div>
        </div>

        {isLoadingRestaurants ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading restaurants...</span>
            </div>
            <p className="mt-2">Finding restaurants near you...</p>
          </div>
        ) : (
          <div className="row">
            {restaurants.map((restaurant) => (
              <div className="col-md-3 mb-4" key={restaurant.id}>
                <div className="card restaurant-card">
                  <img
                    src={restaurant.image}
                    className="card-img-top"
                    alt={restaurant.name}
                    onError={(e) => {
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                  <div className="card-body">
                    <p className="card-title">{restaurant.name}</p>
                    <div className="restaurant-meta">
                      <span>{restaurant.distance} min</span>
                      <span>{restaurant.price}</span>
                    </div>
                    <button 
                      className="btn btn-success w-100 mt-2"
                      onClick={() => handleRestaurantDetails(restaurant.url)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
