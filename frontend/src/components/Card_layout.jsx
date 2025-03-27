import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Moon, Sun } from 'lucide-react';
import "./Card_layout.css";

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
  const navigate = useNavigate();

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
      if (window.location.pathname === '/') {
        localStorage.removeItem('token');
      }
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true }); // Use replace to prevent back navigation
  };

  const features = [
    {
      title: "Easy to Use",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      link: "https://lokitech-demo-driver-screening.demotrt.com/", // ✅ Use full URL
    },
    {
      title: "Customize as You Need",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        link: "https://lokitech-demo-driver-screening.demotrt.com/",
    },
    {
      title: "Designed For Speed",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        link: "https://lokitech-demo-driver-screening.demotrt.com/",
    },
    {
      title: "Designed to Scale",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        link: "https://lokitech-demo-driver-screening.demotrt.com/",
    },
    {
      title: "Detailed Documentation",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        link: "https://lokitech-demo-driver-screening.demotrt.com/",
    },
    {
      title: "Premium Support",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
        link: "https://lokitech-demo-driver-screening.demotrt.com/",
    },
  ];

  const handleNavigation = (link) => {
    if (!link) return;

    if (link.startsWith("http") || link.startsWith("www")) {
      // ✅ Redirect to external link in the same tab
      window.location.href = link.startsWith("www") ? `https://${link}` : link;
    } else {
      // ✅ Navigate internally
      navigate(link);
    }
  };

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

      <div className="features-grid">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="feature-card cursor-pointer" 
            onClick={() => handleNavigation(feature.link)}
          >
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card_layout;