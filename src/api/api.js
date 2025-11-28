const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  return response.json();
};

// ========== PRODUCT API ==========
export const productAPI = {
  getAll: () => apiCall('/products'),
  
  getById: (id) => apiCall(`/products/${id}`),
  
  create: (productData) => apiCall('/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  }),
  
  update: (id, productData) => apiCall(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  }),
  
  delete: (id) => apiCall(`/products/${id}`, {
    method: 'DELETE',
  }),
  
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    return apiCall('/products/upload', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  },
};

// ========== USER API ==========
export const userAPI = {
  // Public routes
  register: (userData) => apiCall('/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  
  login: (credentials) => apiCall('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  
  verifyEmail: (otpData) => apiCall('/verify-email', {
    method: 'POST',
    body: JSON.stringify(otpData),
  }),
  
  resendOTP: (phoneData) => apiCall('/resend-otp', {
    method: 'POST',
    body: JSON.stringify(phoneData),
  }),

  // Password reset routes
  forgotPassword: (emailData) => apiCall('/forgot-password', {
    method: 'POST',
    body: JSON.stringify(emailData),
  }),
  
  verifyResetOTP: (otpData) => apiCall('/verify-reset-otp', {
    method: 'POST',
    body: JSON.stringify(otpData),
  }),
  
  resetPassword: (passwordData) => apiCall('/reset-password', {
    method: 'POST',
    body: JSON.stringify(passwordData),
  }),

  // Private routes (authenticated users)
  getMe: () => apiCall('/me'),
  
  updateProfile: (userData) => apiCall('/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  
  updatePassword: (passwordData) => apiCall('/password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),

  // Admin routes
  getAllUsers: () => apiCall('/'),
  
  createAdmin: (adminData) => apiCall('/admin', {
    method: 'POST',
    body: JSON.stringify(adminData),
  }),
  
  getUser: (id) => apiCall(`/${id}`),
  
  updateUser: (id, userData) => apiCall(`/${id}`, {
    method: 'Patch',
    body: JSON.stringify(userData),
  }),
  
  deleteUser: (id) => apiCall(`/${id}`, {
    method: 'DELETE',
  }),
};