import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Components
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Search from './pages/Search';
import RecipeDetail from './pages/RecipeDetail';
import AddRecipe from './pages/AddRecipe';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AuthRequiredRoute from './components/AuthRequiredRoute';

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// App-wide styles
import './App.css';

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  if (isLoading) {
    // Show loading indicator while checking authentication
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="app-container">
      <NavBar />
      
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isAuthenticated} user={user} />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          
          {/* Protected routes */}
          <Route 
            path="/build" 
            element={
              <AuthRequiredRoute>
                <AddRecipe isEditing={false} />
              </AuthRequiredRoute>
            } 
          />
          <Route 
            path="/recipe/edit/:id" 
            element={
              <AuthRequiredRoute>
                <AddRecipe isEditing={true} />
              </AuthRequiredRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <AuthRequiredRoute>
                <Profile />
              </AuthRequiredRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} SmartRecipe - Created by Tianze Yin & Xinghang Tong</p>
        </div>
      </footer>
    </div>
  );
}

export default App;