import { createContext, useState, useEffect, useContext } from "react";
import { userAPI } from "../api/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Sync user state with localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authToken", localStorage.getItem("token") || "");
    }
  }, [user]);

  // Check authentication status
  const checkAuth = async () => {
    setLoading(true);
    try {
      const data = await userAPI.getMe();
      const userData = data.user || data;
      setUser(userData);
      setIsAuthenticated(true);

      // Update localStorage for navbar
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      // Clear localStorage on auth failure
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
    } finally {
      setLoading(false);
    }
  };

  // Register new user - NOW WITH AUTO-LOGIN
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.register(userData);

      // After successful registration, automatically authenticate the user
      if (data.success) {
        const userDataFromResponse = data.user || data;

        // Set user state and authentication status
        setUser(userDataFromResponse);
        setIsAuthenticated(true);

        // Store token and user data in localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("authToken", data.token);
        }
        localStorage.setItem("user", JSON.stringify(userDataFromResponse));
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.login(credentials);
      const userData = data.user || data;

      setUser(userData);
      setIsAuthenticated(true);

      // Store in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("authToken", data.token);
      }
      localStorage.setItem("user", JSON.stringify(userData));

      return data;
    } catch (err) {
      setError(err.message);
      console.error("Login error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Clear all auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  };

  // Verify email/phone OTP
  const verifyOTP = async (otpData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.verifyEmail(otpData);

      // If verification is successful and returns user data, log them in
      if (data.success || data.user) {
        const userDataFromResponse = data.user || data;

        // Set user state and authentication status
        setUser(userDataFromResponse);
        setIsAuthenticated(true);

        // Store token and user data in localStorage
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("authToken", data.token);
        }
        localStorage.setItem("user", JSON.stringify(userDataFromResponse));
      }

      return data;
    } catch (err) {
      setError(err.message);
      console.error("OTP verification error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  // Resend OTP
  const resendOTP = async (phoneData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.resendOTP(phoneData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Resend OTP error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.forgotPassword(emailData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Forgot password error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify reset OTP
  const verifyResetOTP = async (otpData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.verifyResetOTP(otpData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Verify reset OTP error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.resetPassword(passwordData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Reset password error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.updateProfile(userData);
      const updatedUser = data.user || data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Update profile error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.updatePassword(passwordData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Update password error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get all users
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getAllUsers();
      return data.users || data;
    } catch (err) {
      setError(err.message);
      console.error("Get all users error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Get specific user
  const getUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.getUser(id);
      return data.user || data;
    } catch (err) {
      setError(err.message);
      console.error("Get user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Update user
  const updateUser = async (id, userData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userAPI.updateUser(id, userData);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Update user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Admin: Delete user
  const deleteUser = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userAPI.deleteUser(id);
      return true;
    } catch (err) {
      setError(err.message);
      console.error("Delete user error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    verifyOTP,
    resendOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    updateProfile,
    updatePassword,
    checkAuth,
    // Admin functions
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};

export default UserContext;
