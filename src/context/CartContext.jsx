import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('hiveCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hiveCart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // ✅ FIXED: Accept entire product object, not just ID
  const addToCart = (product, selectedSize = null, selectedColor = null, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item._id === product._id &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
      );

      if (existingItemIndex !== -1) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Add new item with full product data
        return [
          ...prevItems,
          {
            ...product, // ✅ Store entire product object
            selectedSize,
            selectedColor,
            quantity,
            cartItemId: `${product._id}-${selectedSize}-${selectedColor}-${Date.now()}`,
          },
        ];
      }
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.cartItemId !== cartItemId)
    );
  };

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

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalSavings = () => {
    return cartItems.reduce((savings, item) => {
      if (item.salePrice) {
        const discount = (item.price - item.salePrice) * item.quantity;
        return savings + discount;
      }
      return savings;
    }, 0);
  };

  const getCartTotal = (taxRate = 0.08, shippingCost = 0, freeShippingThreshold = 100000) => {
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

  // ✅ FIXED: Check using _id instead of productId
  const isInCart = (productId, selectedSize = null, selectedColor = null) => {
    return cartItems.some(
      (item) =>
        item._id === productId &&
        (selectedSize === null || item.selectedSize === selectedSize) &&
        (selectedColor === null || item.selectedColor === selectedColor)
    );
  };

  // ✅ FIXED: Get item using _id
  const getCartItem = (productId, selectedSize = null, selectedColor = null) => {
    return cartItems.find(
      (item) =>
        item._id === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
  };

  const value = {
    cartItems, // ✅ Already contains full product data
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export default CartContext;