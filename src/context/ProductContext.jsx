import { createContext, useState, useEffect, useContext } from 'react';
import { productAPI } from '../api/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all products 
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

  // Fetch single product 
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

  // Create product (receives FormData with files)
  const createProduct = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.create(formData);
      
      // Update local state
      setProducts(prev => [...prev, data.product]);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product (receives FormData with files)
  const updateProduct = async (id, formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.update(id, formData);
      
      // Update local state
      setProducts(prev => prev.map(p => p._id === id ? data.product : p));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete product 
  const deleteProduct = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await productAPI.delete(id);
      
      // Update local state
      setProducts(prev => prev.filter(p => p._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
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