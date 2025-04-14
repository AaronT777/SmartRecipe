import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { RecipeService } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('relevance');
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  // Get query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ingredientsParam = queryParams.get('ingredients');
  const searchParam = queryParams.get('query');
  
  useEffect(() => {
    // If there are ingredients or search term in URL, set them as search query and trigger search
    if (ingredientsParam || searchParam) {
      const query = ingredientsParam || searchParam;
      setSearchQuery(query.replace(',', ', '));
      fetchRecipes(query);
      setSearchPerformed(true); // Mark that a search was performed
    } else {
      // Otherwise, fetch some recent/popular recipes
      fetchPopularRecipes();
      setSearchPerformed(false); // No search performed
    }
  }, [ingredientsParam, searchParam]);
  
  const fetchRecipes = async (query) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RecipeService.searchRecipes(query);
      setRecipes(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      setIsLoading(false);
      console.error('Search error:', err);
    }
  };
  
  const fetchPopularRecipes = async () => {
    setIsLoading(true);
    
    try {
      const response = await RecipeService.getAllRecipes();
      setRecipes(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch recipes. Please try again later.');
      setIsLoading(false);
      console.error('Error fetching popular recipes:', err);
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchPerformed(true); // Mark that a search was performed
      fetchRecipes(searchQuery);
      
      // Update URL with search query
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('query', searchQuery);
      window.history.pushState({}, '', `${location.pathname}?${searchParams.toString()}`);
    } else {
      // If search query is empty, fetch all recipes
      setSearchPerformed(false); // Reset search performed state
      fetchPopularRecipes();
      
      // Clear search query from URL
      window.history.pushState({}, '', location.pathname);
    }
  };

  // Add a function to clear the search input
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    
    // Sort the recipes array based on selected sorting option
    let sortedRecipes = [...recipes];
    
    if (newSortOrder === 'time-asc') {
      sortedRecipes.sort((a, b) => a.cookingTime - b.cookingTime);
    } else if (newSortOrder === 'time-desc') {
      sortedRecipes.sort((a, b) => b.cookingTime - a.cookingTime);
    } else if (newSortOrder === 'calories-asc') {
      sortedRecipes.sort((a, b) => a.calories - b.calories);
    } else if (newSortOrder === 'calories-desc') {
      sortedRecipes.sort((a, b) => b.calories - a.calories);
    }
    // For 'relevance', we keep the original order from the API
    
    setRecipes(sortedRecipes);
  };
  
  return (
    <div className="search-page-container">
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search ingredients or recipe names"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Add clear button that appears only when there is text */}
            {searchQuery && (
              <button 
                className="btn btn-outline-success clear-search-btn" 
                type="button"
                onClick={handleClearSearch}
              >
                <span>&times;</span>
              </button>
            )}
            <button 
              className="btn btn-success" 
              type="submit"
              disabled={isLoading}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      
      <div className="results-section">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="results-title">
            {/* Always show recipe count, add search term if a search was performed */}
            {`${recipes.length} Recipe Results${searchPerformed && searchQuery ? ` for "${searchQuery}"` : ''}`}
          </h2>
          
          <div className="sort-control">
            <label className="me-2">Sort by:</label>
            <select 
              className="form-select form-select-sm" 
              value={sortOrder}
              onChange={handleSortChange}
            >
              <option value="relevance">Relevance</option>
              <option value="time-asc">Cooking Time (Low to High)</option>
              <option value="time-desc">Cooking Time (High to Low)</option>
              <option value="calories-asc">Calories (Low to High)</option>
              <option value="calories-desc">Calories (High to Low)</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center my-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Searching for recipes...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center my-5">
            <p>No recipes found. Try different ingredients or keywords.</p>
          </div>
        ) : (
          <div className="row">
            {recipes.map(recipe => (
              <div className="col-md-4 mb-4" key={recipe._id}>
                <RecipeCard recipe={recipe} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;