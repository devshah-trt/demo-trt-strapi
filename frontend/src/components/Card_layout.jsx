/* eslint-disable no-unused-vars */
import { useNavigate,useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import "./Card_layout.css";
import axios from 'axios';
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      htmlElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle absolute top-4 right-20 p-2 rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"
    >
      {isDarkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-blue-500" />}
    </button>
  );
};

const Card_layout = () => {
  const [visitedLinks, setVisitedLinks] = useState(
    {
      first_link:false,
      second_link:false,
      third_link:false,
      fourth_link:false,
      fifth_link:false,
      sixth_link:false,
      seventh_link:false,
      eighth_link:false,
      ninth_link:false,
      tenth_link:false,
      eleventh_link:false,
      twelfth_link:false,
    }
  );
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Fetch card data from API
  useEffect(() => {
    // Flag to track if component is mounted
    let isMounted = true;
    
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${STRAPI_URL}/api/card-infos?filters[isActive][$eq]=true`);
        
        // Only update state if component is still mounted
        if (isMounted) {
          // console.log('Card data fetched successfully:', res.data.data);
          
          // Process the API response data
          const processedFeatures = res.data.data.map(item => {
            // Extract data from attributes if present (Strapi v4 format)
            const featureData = item.attributes || item;
            return {
              id: featureData.card_id,
              title: featureData.title,
              description: featureData.description,
              link: featureData.link
            };
          });
          
          // console.log('Processed features:', processedFeatures);
          setFeatures(processedFeatures);
          setLoading(false);
        }
      } catch (err) {
        // Only update state if component is still mounted
        if (isMounted) {
          console.error('Error fetching card data:', err);
          setError(err.message);
          setLoading(false);
        }
      }
    };
    
    fetchCardData();
    
    // Cleanup function for when component unmounts
    return () => {
      isMounted = false;
    };
  }, [visitedLinks]);

  // Check for authentication on component mount and handle cleanup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Clear any remaining data and redirect
      localStorage.removeItem('token'); // Ensure token is removed
      navigate('/', { replace: true }); // Use replace to prevent back navigation
    }

    // Cleanup function for when component unmounts
    return () => {
      // If we're navigating away from Card_layout without using logout button
      if (location.pathname === '/') {
        localStorage.removeItem('token');
      }
    };
  }, [navigate,location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true }); // Use replace to prevent back navigation
  };

  const handleNavigation = (link) => {
    if (!link) return;

    if (link.startsWith("http") || link.startsWith("www")) {
      // Redirect to external link in a new tab
      const url = link.startsWith("www") ? `https://${link}` : link;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      // Navigate internally
      navigate(link);
    }
  };
  
  const handleCount=async(id)=>
    { 
      const jwt=localStorage.getItem('token');
      const user_activity_id=localStorage.getItem('currentActivityId');
      
      try {
        // Update local state first
        setVisitedLinks(prev => ({
          ...prev,
          [id]: true
        }));
        
        // Create request data with only the clicked link set to true
        const requestData = {
          data: {
            [id]: true
          }
        };
        
        console.log(`Updating link ${id} to true for activity ID:`, user_activity_id);
        
        // Send the update to the API
        const response = await axios.put(`${STRAPI_URL}/api/user-activities/${user_activity_id}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            }
          }
        );
  
        console.log('Activity updated successfully:');
  
      } catch (activityError) {
        console.error('Error details:', {
          message: activityError.message,
          response: activityError.response?.data,
          status: activityError.response?.status
        });
        // Continue with login process even if activity storage fails
      }
    }
  

  return (
    <div className="features-container relative">
      {/* Dark Mode Toggle */}
      <ThemeToggle />

      {/* Updated Logout Button */}
      <button 
        onClick={handleLogout}
        className="logout-button"
      >
        Logout
      </button>

      <div className="features-header">
        <h1>Our Features</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>

      {loading ? (
        <div className="loading-container">
          <p>Loading features...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>Error loading features: {error}</p>
        </div>
      ) : (
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card cursor-pointer" 
              onClick={() => {
                handleNavigation(feature.link);
                handleCount(feature.id);
              }}
            >
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Card_layout;