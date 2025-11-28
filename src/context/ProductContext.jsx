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
      setProducts(data.products || data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
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
      return data.product || data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create product
  const createProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.create(productData);
      setProducts([...products, data.product || data]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update product
  const updateProduct = async (id, productData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.update(id, productData);
      setProducts(products.map(p => p._id === id ? (data.product || data) : p));
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error updating product:', err);
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

  // Upload image
  const uploadImage = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productAPI.uploadImage(file);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error uploading image:', err);
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