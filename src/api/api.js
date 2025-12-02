const isDevelopment =
  import.meta.env.MODE === "development" ||
  window.location.hostname === "localhost";

const API_URL =
  import.meta.env.VITE_API_URL ||
  (isDevelopment
    ? "http://localhost:5000/api/v1"
    : "https://hive-back-end.onrender.com/api/v1");

// Helper to get auth token
const getAuthToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const config = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Remove Content-Type if body is FormData
  if (options.body instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
};

//  PRODUCT API 
export const productAPI = {
  getAll: () => apiCall("/products/all"),

  getById: (id) => apiCall(`/products/${id}`),

  create: (productData) =>
    apiCall("/products/create", {
      method: "POST",
      body: JSON.stringify(productData),
    }),

  update: (id, productData) =>
    apiCall(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    }),

  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),

  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("images", file);

    return apiCall("/products/upload-images", {
      method: "POST",
      headers: {},
      body: formData,
    });
  },
};

// USER API 
export const userAPI = {
  register: (userData) =>
    apiCall("/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall("/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  verifyEmail: (otpData) =>
    apiCall("/verify-email", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  resendOTP: (phoneData) =>
    apiCall("/resend-otp", {
      method: "POST",
      body: JSON.stringify(phoneData),
    }),

  forgotPassword: (emailData) =>
    apiCall("/forgot-password", {
      method: "POST",
      body: JSON.stringify(emailData),
    }),

  verifyResetOTP: (otpData) =>
    apiCall("/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  resetPassword: (passwordData) =>
    apiCall("/reset-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    }),

  getMe: () => apiCall("/me"),

  updateProfile: (userData) =>
    apiCall("/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  updatePassword: (passwordData) =>
    apiCall("/password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    }),

  getAllUsers: () => apiCall("/"),

  createAdmin: (adminData) =>
    apiCall("/admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    }),

  getUser: (id) => apiCall(`/${id}`),

  updateUser: (id, userData) =>
    apiCall(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  deleteUser: (id) =>
    apiCall(`/${id}`, {
      method: "DELETE",
    }),
};
