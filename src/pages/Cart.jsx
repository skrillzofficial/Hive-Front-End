import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag, ArrowLeft, Trash2, Tag } from 'lucide-react';
import { products } from '../data/ProductData';

const Cart = () => {
  const navigate = useNavigate();
  
  // Mock cart items - In production, this would come from context/state management
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      product: products.find(p => p.id === 'hd001'), // Hive Privilege Hoodie Grey
      selectedSize: 'L',
      selectedColor: 'Grey',
      quantity: 1
    },
    {
      id: 2,
      product: products.find(p => p.id === 'ts003'), // Hive Property T-Shirt Black
      selectedSize: 'M',
      selectedColor: 'Black',
      quantity: 2
    },
    {
      id: 3,
      product: products.find(p => p.id === 'cp001'), // Hive Cap Black Denim
      selectedSize: 'One Size',
      selectedColor: 'Black Denim',
      quantity: 1
    }
  ]);

  // Update quantity
  const updateQuantity = (itemId, change) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity > 0 && newQuantity <= item.product.stockCount) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  // Remove item
  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Calculate totals
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.salePrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  // Calculate savings
  const calculateSavings = () => {
    return cartItems.reduce((savings, item) => {
      if (item.product.salePrice) {
        const discount = (item.product.price - item.product.salePrice) * item.quantity;
        return savings + discount;
      }
      return savings;
    }, 0);
  };

  const totalSavings = calculateSavings();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto w-11/12 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto w-11/12 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
                <div className="flex gap-4 lg:gap-6">
                  {/* Product Image */}
                  <Link 
                    to={`/product/${item.product.slug}`}
                    className="flex-shrink-0 w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link 
                          to={`/product/${item.product.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span>Size: <span className="font-medium text-gray-900">{item.selectedSize}</span></span>
                          <span>Color: <span className="font-medium text-gray-900">{item.selectedColor}</span></span>
                        </div>
                      </div>
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.product.stockCount}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        {item.product.salePrice ? (
                          <div>
                            <p className="text-lg font-bold text-red-600">
                              ${(item.product.salePrice * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sale Badge */}
                    {item.product.salePrice && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                        <Tag className="w-3 h-3" />
                        Save ${((item.product.price - item.product.salePrice) * item.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Continue Shopping Button - Mobile */}
            <button
              onClick={() => navigate('/shop')}
              className="lg:hidden w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 uppercase tracking-wide"
            >
              Continue Shopping
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                Order Summary
              </h2>

              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-semibold">-${totalSavings.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                    🎉 You've qualified for free shipping!
                  </div>
                )}

                {shipping > 0 && subtotal < 100 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Tax (8%)</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping - Desktop */}
              <button
                onClick={() => navigate('/shop')}
                className="hidden lg:block w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Continue Shopping
              </button>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;