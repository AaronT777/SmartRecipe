import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get query parameters from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const ingredientsParam = queryParams.get('ingredients');
  
  useEffect(() => {
    // If there are ingredients in URL, set them as search query and trigger search
    if (ingredientsParam) {
      setSearchQuery(ingredientsParam.replace(',', ', '));
      // Will implement fetchRecipes later
      console.log('Should fetch recipes with:', ingredientsParam);
    } else {
      // Will implement fetchPopularRecipes later
      console.log('Should fetch popular recipes');
    }
  }, [ingredientsParam]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Will implement search functionality later
      console.log('Searching for:', searchQuery);
      
      // Update URL with search query
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('query', searchQuery);
      window.history.pushState({}, '', `${location.pathname}?${searchParams.toString()}`);
    }
  };
  
  return (
    <div className="search-page-container">
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search ingredients (e.g. chicken, rice, tomatoes)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
        {/* Results will be displayed here */}
      </div>
    </div>
  );
};

export default Search;