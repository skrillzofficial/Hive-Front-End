import { createContext, useState, useEffect, useContext } from 'react';

const ProductContext = createContext();

// API Base URL - adjust this to match your backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  // Add auth token if available (for admin routes)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include', // Include cookies if using cookie-based auth
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (Public route)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('/products/all');
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product (Public route)
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/products/${id}`);
      return data.product;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create product (Admin only - requires authentication)
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall('/products/create', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
      
      // Update local state
      setProducts([...products, data.product]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product (Admin only - requires authentication)
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiCall(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
      
      // Update local state
      setProducts(products.map(p => p._id === id ? data.product : p));
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product (Admin only - requires authentication)
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await apiCall(`/products/${id}`, {
        method: 'DELETE',
      });
      
      // Update local state
      setProducts(products.filter(p => p._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload image (Admin only - requires authentication)
  const uploadImage = async (file) => {
    try {
      console.log('🔵 Starting image upload for file:', file.name);
      console.log('🔵 File size:', (file.size / 1024).toFixed(2), 'KB');
      console.log('🔵 File type:', file.type);
      
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please login as admin.');
      }
      console.log('🔵 Auth token exists');

      const formData = new FormData();
      formData.append('images', file);

      console.log('🔵 Uploading to:', `${API_URL}/products/upload-images`);
      
      const response = await fetch(`${API_URL}/products/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      console.log('🔵 Response status:', response.status);
      
      const data = await response.json();
      console.log('🔵 Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }

      if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
        console.error(' Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      console.log(' Image uploaded successfully:', data.images[0]);
      return { url: data.images[0] };
      
    } catch (err) {
      console.error(' Upload error:', err.message);
      throw err;
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};

export default ProductContext;