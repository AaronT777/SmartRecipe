// client/src/hooks/useAuth.js
import { useEffect, useState, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserService } from '../services/api';

export const useAuth = () => {
  const { 
    isAuthenticated, 
    isLoading: isAuth0Loading, 
    user: auth0User,
    getAccessTokenSilently, 
    loginWithRedirect, 
    logout: auth0Logout
  } = useAuth0();
  
  const [dbUser, setDbUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [error, setError] = useState(null);
  
  // Function to get token for API calls
  const getToken = useCallback(async () => {
    if (isAuthenticated && auth0User) {
      try {
        const token = await getAccessTokenSilently();
        return token;
      } catch (err) {
        console.error('Error getting token:', err);
        setError('Failed to get authentication token');
        return null;
      }
    }
    return null;
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);
  
  // Store token in localStorage when authenticated
  useEffect(() => {
    const getAndStoreToken = async () => {
      if (isAuthenticated && auth0User) {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem('auth0Token', token);
          // console.log("Token stored in localStorage");
        } catch (err) {
          console.error('Error getting token:', err);
          setError('Failed to get authentication token');
        }
      }
    };
    
    getAndStoreToken();
  }, [isAuthenticated, auth0User, getAccessTokenSilently]);
  
  // Register/fetch user profile when authenticated
  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (isAuthenticated && auth0User) {
        try {
          setIsLoadingUser(true);
          
          // Try to get the existing profile
          try {
            // console.log("Attempting to fetch user profile");
            const response = await UserService.getProfile(getToken);
            setDbUser(response.data);
            // console.log("User profile fetched:", response.data);
          } catch (err) {
            console.log("Error fetching profile:", err.response?.status);
            
            if (err.response && err.response.status === 404) {
              // User doesn't exist in our database, register them
              console.log("User doesn't exist, creating new user");
              const userData = {
                username: auth0User.nickname || auth0User.name || auth0User.email?.split('@')[0] || `user_${Date.now()}`,
                email: auth0User.email || `user_${Date.now()}@example.com`
              };
              
              console.log("Registering with data:", userData);
              const createResponse = await UserService.registerOrUpdateUser(userData, getToken);
              setDbUser(createResponse.data);
              console.log("User created:", createResponse.data);
            } else {
              throw err;
            }
          }
        } catch (err) {
          console.error('Error fetching or creating user:', err);
          setError('Failed to load user profile');
        } finally {
          setIsLoadingUser(false);
        }
      } else if (!isAuth0Loading && !isAuthenticated) {
        setDbUser(null);
        setIsLoadingUser(false);
        localStorage.removeItem('auth0Token');
      }
    };
    
    fetchOrCreateUser();
  }, [isAuthenticated, auth0User, isAuth0Loading, getToken]);
  
  // Custom login function
  const login = () => {
    loginWithRedirect({
      appState: { returnTo: window.location.pathname }
    });
  };
  
  // Custom logout function
  const handleLogout = () => {
    localStorage.removeItem('auth0Token');
    auth0Logout({ 
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };
  
  return {
    isAuthenticated,
    isLoading: isAuth0Loading || isLoadingUser,
    user: dbUser,
    authUser: auth0User,
    error,
    login,
    logout: handleLogout,
    getToken
  };
};