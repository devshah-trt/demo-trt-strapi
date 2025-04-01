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
  const navigate = useNavigate();
  const location = useLocation();
  

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

  const features =   [
    {
      "id": "first_link",
      "title": "Driver Performance Analytics",
      "description": "Advanced analytics tool that helps DSPs track and improve driver metrics with detailed suggestions for enhancing safety scores, delivery rates, and overall performance.",
      "link": "https://trt-demo-performance-improver.demotrt.com"
    },
    {
      "id": "second_link",
      "title": "Intelligent Driver Screening",
      "description": "AI-powered interview system that conducts structured driver screening conversations, evaluates responses against customizable criteria, and streamlines your hiring process.",
      "link": "https://trt-demo-driver-screening.demotrt.com"
    },
    {
      "id": "third_link",
      "title": "Professional Content Generator",
      "description": "Smart content creation tool that produces tailored communications for SMS, emails, social media posts, and formal documents with proper formatting and professional tone.",
      "link": "https://trt-demo-content-generator.demotrt.com"
    },
    {
      "id": "fourth_link",
      "title": "Advanced Grammar Assistant",
      "description": "Comprehensive writing tool that identifies grammar errors, checks for plagiarism, improves readability, and provides style suggestions to enhance your communication quality.",
      "link": "https://trt-demo-grammer-checker.demotrt.com"
    },
    {
      "id": "fifth_link",
      "title": "Document Intelligence System",
      "description": "Powerful document RAG system that processes various file formats, allows natural language queries, and provides AI-generated answers with source references from your documents.",
      "link": "https://trt-demo-document-assistant.demotrt.com"
    },
    {
      "id": "sixth_link",
      "title": "Answer Verification System",
      "description": "Sophisticated verification tool that evaluates the accuracy of responses, provides confidence scores, and helps ensure information quality across all communication channels.",
      "link": "https://trt-demo-answer-verifier.demotrt.com"
    },
    {
      "id": "seventh_link",
      "title": "Medical Assistant Platform",
      "description": "Specialized healthcare tool that provides medical information, assists with symptom analysis, and offers guidance while maintaining strict compliance with healthcare standards.",
      "link": "https://trt-demo-medical-assistant.demotrt.com"
    },
    {
      "id": "eighth_link",
      "title": "Video Transcription & Analysis",
      "description": "Comprehensive video processing system that transcribes content, extracts key insights, and enables searchable video libraries with accurate timestamps and content summaries.",
      "link": "https://trt-demo-video-transcriber.demotrt.com"
    },
    {
      "id": "ninth_link",
      "title": "Interior Design Visualization",
      "description": "Creative design tool that generates customized interior designs based on room type, style preferences, and specific requirements with detailed cost estimates for implementation.",
      "link": "https://trt-demo-interior-designer.demotrt.com"
    },
    {
      "id": "tenth_link",
      "title": "Course Correct",
      "description": "Find your perfect course with our Friendly AI Browsing through thousands of courses is inefficient. You need someone to do the work for you...  You need CourseCorrect",
      "link": "https://coursecorrect.fyi"
    },
    {
      "id":"eleventh_link",
      "title":"Course Correct",
      "description":"Find your perfect course with our Friendly AI Browsing through thousands of courses is inefficient. You need someone to do the work for you...  You need CourseCorrect",
      "link":"https://trt-demo-auction-listing.demotrt.com"
    },
    {
      "id":"twelfth_link",
      "title":"Course Correct",
      "description":"Find your perfect course with our Friendly AI Browsing through thousands of courses is inefficient. You need someone to do the work for you...  You need CourseCorrect",
      "link":"https://trt-demo-event-booking.demotrt.com"
    }
  ]

  
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
    </div>
  );
};

export default Card_layout;