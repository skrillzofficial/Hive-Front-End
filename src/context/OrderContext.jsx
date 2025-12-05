import { createContext, useContext, useState, useCallback } from 'react';
import { orderAPI } from '../api/api';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user's orders
  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.getMyOrders();
      setOrders(data.orders || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Track order by number (public)
  const trackOrder = useCallback(async (orderNumber) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.trackByNumber(orderNumber);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create order
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderAPI.create(orderData);
      // Optionally add to local orders if user is authenticated
      if (data.order) {
        setOrders(prev => [data.order, ...prev]);
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear orders (useful on logout)
  const clearOrders = useCallback(() => {
    setOrders([]);
    setError(null);
  }, []);

  const value = {
    orders,
    loading,
    error,
    fetchMyOrders,
    trackOrder,
    createOrder,
    clearOrders,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};