import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import HiveLogo from '../assets/images/Hive logo.png';
import { useUser } from '../context/UserContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError } = useUser();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  // Add Eruda console for mobile debugging (remove after debugging)
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/eruda';
    document.body.appendChild(script);
    script.onload = () => {
      window.eruda.init();
    };
    
    return () => {
      // Cleanup
      if (window.eruda) {
        window.eruda.destroy();
      }
    };
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', name, value);
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    console.log('Validating form...');
    const newErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    console.log('=== FORM SUBMIT TRIGGERED ===');
    console.log('Event:', e);
    
    if (e && e.preventDefault) {
      e.preventDefault();
      console.log('preventDefault called');
    }

    console.log('Form data:', formData);

    if (!validateForm()) {
      console.log('Validation failed, stopping submission');
      return;
    }

    console.log('Validation passed, attempting login...');

    try {
      console.log('Calling login function with:', {
        email: formData.email,
        password: '***hidden***'
      });

      const data = await login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login response:', data);

      // Check if OTP verification is required
      if (data.requiresPhoneVerification) {
        console.log('OTP verification required, navigating to /verify-otp');
        navigate('/verify-otp', { 
          state: { 
            userId: data.userId,
            email: formData.email 
          } 
        });
        return;
      }

      // Store token if provided
      if (data.token) {
        try {
          localStorage.setItem('token', data.token);
          localStorage.setItem('authToken', data.token);
          console.log('Token stored successfully');
        } catch (storageError) {
          console.error('localStorage error:', storageError);
        }
      }

      // Store user data for navbar
      if (data.user) {
        try {
          localStorage.setItem('user', JSON.stringify(data.user));
          console.log('User data stored successfully');
        } catch (storageError) {
          console.error('localStorage error:', storageError);
        }
      }

      // Route based on user role
      const userRole = data.user?.role || data.role;
      console.log('User role:', userRole);
      
      if (userRole === 'admin') {
        console.log('Navigating to /admin');
        navigate('/admin');
      } else {
        console.log('Navigating to /');
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Login failed. Please try again.' 
      });
    }
  };

  // Handle button click (for mobile compatibility)
  const handleButtonClick = (e) => {
    console.log('Button clicked');
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <img
              src={HiveLogo}
              alt="Hive Logo"
              className="h-12 w-auto mx-auto mb-6"
            />
          </Link>
          <h2 className="text-3xl font-light tracking-wide text-black uppercase">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 tracking-wide">
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {/* General Error */}
          {(errors.general || authError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general || authError}
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2 tracking-wide"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2 tracking-wide"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 py-3 border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Toggle password visibility');
                    setShowPassword(!showPassword);
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={18} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-black transition-colors tracking-wide"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={authLoading}
            onClick={handleButtonClick}
            className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors font-medium tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
          >
            {authLoading ? 'Signing In...' : 'Sign In'}
          </button>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 tracking-wide">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-black hover:text-gray-700 transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;