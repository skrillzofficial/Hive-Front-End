import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProductById } from '../data/ProductData';

// Create Cart Context
const CartContext = createContext();

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // We only store: productId, quantity, selectedSize, selectedColor
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('hiveCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('hiveCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Get full cart items with product details from ProductData
  const getFullCartItems = () => {
    return cartItems.map(item => {
      const product = getProductById(item.productId);
      if (!product) {
        console.warn(`Product with ID ${item.productId} not found`);
        return null;
      }
      return {
        ...product,
        cartItemId: item.cartItemId,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      };
    }).filter(Boolean); // Remove any null items
  };

  // Add item to cart
  const addToCart = (productId, selectedSize = null, selectedColor = null, quantity = 1) => {
    setCartItems((prevItems) => {
      // Check if item with same productId, size, and color already exists
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.productId === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex !== -1) {
        // Item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // New item, add to cart
        return [
          ...prevItems,
          {
            productId,
            selectedSize,
            selectedColor,
            quantity,
            cartItemId: `${productId}-${selectedSize}-${selectedColor}-${Date.now()}`,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

  // Update item quantity
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart subtotal (before tax and shipping)
  const getCartSubtotal = () => {
    const fullItems = getFullCartItems();
    return fullItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  // Get total savings from sale items
  const getTotalSavings = () => {
    const fullItems = getFullCartItems();
    return fullItems.reduce((savings, item) => {
      if (item.salePrice) {
        const discount = (item.price - item.salePrice) * item.quantity;
        return savings + discount;
      }
      return savings;
    }, 0);
  };

  // Get cart total (with tax and shipping)
  const getCartTotal = (taxRate = 0.08, shippingCost = 10, freeShippingThreshold = 100) => {
    const subtotal = getCartSubtotal();
    const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
    const tax = subtotal * taxRate;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
    };
  };

  // Check if product is in cart
  const isInCart = (productId, selectedSize = null, selectedColor = null) => {
    return cartItems.some(
      (item) =>
        item.productId === productId &&
        (selectedSize === null || item.selectedSize === selectedSize) &&
        (selectedColor === null || item.selectedColor === selectedColor)
    );
  };

  // Get specific item from cart
  const getCartItem = (productId, selectedSize = null, selectedColor = null) => {
    const cartItem = cartItems.find(
      (item) =>
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    
    if (!cartItem) return null;
    
    const product = getProductById(productId);
    return {
      ...product,
      ...cartItem,
    };
  };

  const value = {
    cartItems: getFullCartItems(), // Always return full product details
    rawCartItems: cartItems, // Raw cart items (just IDs and quantities)
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartSubtotal,
    getTotalSavings,
    getCartTotal,
    isInCart,
    getCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;