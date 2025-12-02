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
      console.log('📦 Fetching all products...');
      const data = await productAPI.getAll();
      console.log('✅ Products fetched:', data);
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch single product (Public route)
  const fetchProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📦 Fetching product:', id);
      const data = await productAPI.getById(id);
      console.log('✅ Product fetched:', data);
      return data.product;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error fetching product:', err);
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
      console.log('📦 Creating product:', productData);
      const data = await productAPI.create(productData);
      console.log('✅ Product created:', data);
      
      // Update local state
      setProducts([...products, data.product]);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error creating product:', err);
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
      console.log('📦 Updating product:', id, productData);
      const data = await productAPI.update(id, productData);
      console.log('✅ Product updated:', data);
      
      // Update local state
      setProducts(products.map(p => p._id === id ? data.product : p));
      return data;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error updating product:', err);
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
      console.log('📦 Deleting product:', id);
      await productAPI.delete(id);
      console.log('✅ Product deleted');
      
      // Update local state
      setProducts(products.filter(p => p._id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      console.error('❌ Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Upload image (Admin only - requires authentication)
  const uploadImage = async (file) => {
    try {
      console.log('🖼️ Starting image upload for file:', file.name);
      console.log('🖼️ File size:', (file.size / 1024).toFixed(2), 'KB');
      console.log('🖼️ File type:', file.type);
      
      const data = await productAPI.uploadImage(file);
      console.log('✅ Image uploaded successfully:', data);
      
      return { url: data.imageUrl || data.url };
    } catch (err) {
      console.error('❌ Upload error:', err.message);
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