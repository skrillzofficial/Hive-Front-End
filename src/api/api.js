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

// PRODUCT API
export const productAPI = {
  // GET /products/all
  getAll: () => apiCall("/products/all"),

  // GET /products/:identifier
  getById: (id) => apiCall(`/products/${id}`),

  // POST /products/create (with FormData)
  create: (formData) =>
    apiCall("/products/create", {
      method: "POST",
      body: formData,
    }),

  // PATCH /products/:id (with FormData)
  update: (id, formData) =>
    apiCall(`/products/${id}`, {
      method: "PATCH", 
      body: formData,
    }),

  // DELETE /products/:id
  delete: (id) =>
    apiCall(`/products/${id}`, {
      method: "DELETE",
    }),

  // DELETE /products/:id/permanent
  permanentDelete: (id) =>
    apiCall(`/products/${id}/permanent`, {
      method: "DELETE",
    }),

  // GET /products/featured
  getFeatured: (limit = 8) => 
    apiCall(`/products/featured?limit=${limit}`),

  // GET /products/new-arrivals
  getNewArrivals: (limit = 8) => 
    apiCall(`/products/new-arrivals?limit=${limit}`),

  // GET /products/sale
  getSaleProducts: () => 
    apiCall("/products/sale"),

  // GET /products/category/:category
  getByCategory: (category) => 
    apiCall(`/products/category/${category}`),

  // GET /products/subcategory/:subcategory
  getBySubcategory: (subcategory) => 
    apiCall(`/products/subcategory/${subcategory}`),

  // GET /products/search?q=query
  search: (query) => 
    apiCall(`/products/search?q=${encodeURIComponent(query)}`),

  // PATCH /products/:id/stock
  updateStock: (id, stockData) =>
    apiCall(`/products/${id}/stock`, {
      method: "PATCH",
      body: JSON.stringify(stockData),
    }),

  // GET /products/:id/availability?quantity=1
  checkAvailability: (id, quantity = 1) =>
    apiCall(`/products/${id}/availability?quantity=${quantity}`),
};

// USER API 
export const userAPI = {
  register: (userData) =>
    apiCall("/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiCall("/user/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  verifyEmail: (otpData) =>
    apiCall("/user/verify-email", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  resendOTP: (phoneData) =>
    apiCall("/user/resend-otp", {
      method: "POST",
      body: JSON.stringify(phoneData),
    }),

  forgotPassword: (emailData) =>
    apiCall("/user/forgot-password", {
      method: "POST",
      body: JSON.stringify(emailData),
    }),

  verifyResetOTP: (otpData) =>
    apiCall("/user/verify-reset-otp", {
      method: "POST",
      body: JSON.stringify(otpData),
    }),

  resetPassword: (passwordData) =>
    apiCall("/user/reset-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    }),

  getMe: () => apiCall("/user/me"),

  updateProfile: (userData) =>
    apiCall("/user/profile", {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  updatePassword: (passwordData) =>
    apiCall("/user/password", {
      method: "PATCH",
      body: JSON.stringify(passwordData),
    }),

  getAllUsers: () => apiCall("/"),

  createAdmin: (adminData) =>
    apiCall("/user/admin", {
      method: "POST",
      body: JSON.stringify(adminData),
    }),

  getUser: (id) => apiCall(`/user/${id}`),

  updateUser: (id, userData) =>
    apiCall(`/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(userData),
    }),

  deleteUser: (id) =>
    apiCall(`/user/${id}`, {
      method: "DELETE",
    }),
};

// TRANSACTION API
export const transactionAPI = {
  // GET /transactions/verify/:reference
  verify: (reference) => 
    apiCall(`/transactions/verify/${reference}`),

  // POST /transactions/webhook
  webhook: (webhookData) =>
    apiCall("/transactions/webhook", {
      method: "POST",
      body: JSON.stringify(webhookData),
    }),

  // GET /transactions (Admin only)
  getAll: () => 
    apiCall("/transactions"),

  // GET /transactions/customer/:email (Admin only)
  getByCustomer: (email) => 
    apiCall(`/transactions/customer/${encodeURIComponent(email)}`),

  // GET /transactions/revenue (Admin only)
  getRevenue: () => 
    apiCall("/transactions/revenue"),
};

// ORDER API
export const orderAPI = {
  //  POST /orders/initialize-checkout 
  initializeCheckout: (orderData) =>
    apiCall("/orders/initialize-checkout", {
      method: "POST",
      body: JSON.stringify(orderData),
    }),

  // POST /auth/create-account-post-purchase
  createAccountAfterPurchase: (accountData) =>
    apiCall("/auth/create-account-post-purchase", {
      method: "POST",
      body: JSON.stringify(accountData),
    }),

  // GET /orders/track/:orderNumber?email=xxx
  trackByNumber: (orderNumber, email = null) => {
    const queryParam = email ? `?email=${encodeURIComponent(email)}` : '';
    return apiCall(`/orders/track/${orderNumber}${queryParam}`);
  },

  // GET /orders/my-orders (Protected - authenticated users)
  getMyOrders: () => 
    apiCall("/orders/my-orders"),

  // GET /orders (Admin only)
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return apiCall(`/orders${queryString ? `?${queryString}` : ''}`);
  },

  // PATCH /orders/:id/status (Admin only)
  updateStatus: (id, statusData) =>
    apiCall(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(statusData),
    }),

  // GET /orders/customer/:email (Admin only)
  searchByEmail: (email) => 
    apiCall(`/orders/customer/${encodeURIComponent(email)}`),
};

export default {
  productAPI,
  userAPI,
  transactionAPI,
  orderAPI,
};