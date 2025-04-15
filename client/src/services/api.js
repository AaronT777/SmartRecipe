// client/src/services/api.js
import axios from "axios";

// Create an axios instance with the base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the authentication token in the headers
// We'll only use this as a fallback; our service functions will explicitly set the token
API.interceptors.request.use((config) => {
  // Only add the token if it's not already set in the request
  if (!config.headers.Authorization) {
    const token = localStorage.getItem("auth0Token");
    if (token) {
      // console.log("Adding token to request headers from localStorage");
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("No token available for request");
    }
  }
  return config;
});

// API services for recipes
export const RecipeService = {
  getAllRecipes: () => API.get("/recipes"),
  getRecipeById: (id) => API.get(`/recipes/${id}`),
  searchRecipes: (query) => API.get(`/recipes/search?query=${query}`),
  createRecipe: async (formData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.post("/recipes", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.post("/recipes", formData);
  },
  updateRecipe: async (id, formData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.put(`/recipes/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.put(`/recipes/${id}`, formData);
  },
  deleteRecipe: async (id, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.delete(`/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.delete(`/recipes/${id}`);
  },
  getRecipesByUser: (userId) => API.get(`/recipes/user/${userId}`),
};

// Update user service to match new Auth0 flow
export const UserService = {
  // Replace login and register with single method to register/update user in our backend
  registerOrUpdateUser: async (userData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.post("/users/profile", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.post("/users/profile", userData);
  },
  getProfile: async (getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.get("/users/profile");
  },
  updateProfile: async (userData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.put("/users/profile", userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.put("/users/profile", userData);
  },
  saveRecipe: async (recipeId, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.post("/users/save-recipe", { recipeId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.post("/users/save-recipe", { recipeId });
  },
  unsaveRecipe: async (recipeId, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.delete(`/users/unsave-recipe/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.delete(`/users/unsave-recipe/${recipeId}`);
  },
  getSavedRecipes: async (getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.get("/users/saved-recipes", {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.get("/users/saved-recipes");
  },
  getUserById: (userId) => API.get(`/users/${userId}`),
  getSavedRecipesByUser: (userId) => API.get(`/users/${userId}/saved-recipes`),
};

// API services for reviews
export const ReviewService = {
  getReviewsByRecipe: (recipeId) => API.get(`/reviews/recipe/${recipeId}`),
  createReview: async (reviewData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.post("/reviews", reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.post("/reviews", reviewData);
  },
  updateReview: async (id, reviewData, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.put(`/reviews/${id}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.put(`/reviews/${id}`, reviewData);
  },
  deleteReview: async (id, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.delete(`/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.delete(`/reviews/${id}`);
  },
};

// API services for restaurants
export const RestaurantService = {
  getNearbyRestaurants: (params) => API.get('/restaurants/nearby', { params }),
};

// API services for OpenAI
export const OpenAIService = {
  generateRecipe: async (ingredients, getTokenFn) => {
    if (getTokenFn) {
      const token = await getTokenFn();
      return API.post("/openai/generate-recipe", { ingredients }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    return API.post("/openai/generate-recipe", { ingredients });
  },
};

export default API;