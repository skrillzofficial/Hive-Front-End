import { createContext, useState, useEffect, useContext } from 'react';
import { productAPI } from '../api/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products (Public route)
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.getAll();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product (Public route)
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.getById(id);
      return data.product;
    } catch (err) {
      setError(err.message);
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
      const data = await productAPI.create(productData);
      
      // Update local state
      setProducts([...products, data.product]);
      return data;
    } catch (err) {
      setError(err.message);
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
      const data = await productAPI.update(id, productData);
      
      // Update local state
      setProducts(products.map(p => p._id === id ? data.product : p));
      return data;
    } catch (err) {
      setError(err.message);
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
      await productAPI.delete(id);
      
      // Update local state
      setProducts(products.filter(p => p._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload image (Admin only - requires authentication)
  const uploadImage = async (file) => {
    try {
      // Get auth token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please login as admin.');
      }

      // Determine API URL (same logic as api.js)
      const isDevelopment = import.meta.env.MODE === 'development' || window.location.hostname === 'localhost';
      const API_URL = import.meta.env.VITE_API_URL || 
        (isDevelopment 
          ? 'http://localhost:5000/api/v1' 
          : 'https://hive-back-end.onrender.com/api/v1');

      const formData = new FormData();
      formData.append('images', file);
      
      const response = await fetch(`${API_URL}/products/upload-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Upload failed with status ${response.status}`);
      }

      if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
        throw new Error('Invalid response format from server');
      }

      // Return just the URL string, not an object
      return data.images[0];
      
    } catch (err) {
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