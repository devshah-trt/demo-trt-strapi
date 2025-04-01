/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login_form.css';
import { useNavigate} from 'react-router-dom';
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL;
const Login_form = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    Email: '',
    Password: '',
    Customer_name: '',
    Purpose: ''
  });

  const [formErrors, setFormErrors] = useState({
    Email: '',
    Password: '',
    Customer_name: '',
    Purpose: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Clear token when landing on login page
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentActivityId');
  }, []);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'Email':
        if (!value) {
          error = 'Email is required';
        } else if (!value.endsWith('@thirdrocktechkno.com')) {
          error = 'Email must be from @thirdrocktechkno.com domain';
        }
        break;
      
      case 'Password':
        if (!value) {
          error = 'Password is required';
        }
        break;
      
      case 'Customer_name':
        if (!value) {
          error = 'Customer name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Customer name must contain only letters and spaces';
        }
        break;
      
      case 'Purpose':
        if (!value) {
          error = 'Purpose is required';
        }
        break;
      
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Validate field on change
    const error = validateField(name, value);
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));

    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Authenticate user with Strapi
      const loginResponse = await axios.post(
        `${STRAPI_URL}/api/user-detail/login`, 
        {
          identifier: formData.Email.toLowerCase(),
          password: formData.Password
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // If authentication is successful
      if (loginResponse.data && loginResponse.data.jwt) {
        // Store JWT token
        localStorage.setItem('token', loginResponse.data.jwt);
        
        // Store user activity in Strapi
        try {
          // Get current date and time in ISO format
          const currentDateTime = new Date().toISOString();
          
          const requestData = {
            data: {
              Customer_name: formData.Customer_name,
              Purpose: formData.Purpose,
              Date_Time: currentDateTime
            }
          };

          const activityResponse = await axios.post(
            `${STRAPI_URL}/api/user-activities`,
            requestData,
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginResponse.data.jwt}`
              }
            }
          );
          if (activityResponse.data && activityResponse.data.data) {
            console.log('Full activity response:', activityResponse.data);
            const activityId = activityResponse.data.data.id;
            localStorage.setItem('currentActivityId', activityId);
            console.log('Activity created with ID:', activityId);
          } else {
            console.log('Activity response structure:', activityResponse.data);
          }

        } catch (activityError) {
          console.error('Error details:', {
            message: activityError.message,
            response: activityError.response?.data,
            status: activityError.response?.status
          });
          // Continue with login process even if activity storage fails
        }
        
        // Set success message
        setSuccess('Login successful!');
        
        // Optional: Redirect to dashboard or home page
        navigate('/card');
      }
    } catch (error) {
      // Handle login errors
      console.error('Login error:', error.response?.data);
      
      // Set error message
      setError(
        error.response?.data?.error?.message || 
        'Invalid email or password. Please try again.'
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              id="Email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
            {formErrors.Email && <p className="field-error">{formErrors.Email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input
              type="password"
              id="Password"
              name="Password"
              value={formData.Password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            {formErrors.Password && <p className="field-error">{formErrors.Password}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="Customer_name">Customer Name</label>
            <input
              type="text"
              id="Customer_name"
              name="Customer_name"
              value={formData.Customer_name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />
            {formErrors.Customer_name && <p className="field-error">{formErrors.Customer_name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="Purpose">Purpose of Visit</label>
            <input
              type="text"
              id="Purpose"
              name="Purpose"
              value={formData.Purpose}
              onChange={handleChange}
              placeholder="Enter purpose of visit"
              required
            />
            {formErrors.Purpose && <p className="field-error">{formErrors.Purpose}</p>}
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login_form;