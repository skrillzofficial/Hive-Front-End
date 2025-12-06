import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Truck, Shield, Lock, User, Package, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { orderAPI } from '../api/api';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartSubtotal, clearCart } = useCart();
  const { user, logout } = useUser();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
    deliveryMethod: 'standard',
    orderNotes: ''
  });

  const [accountData, setAccountData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // Pre-fill form if user is logged in
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || ''
      }));
      
      // Don't show create account option for logged-in users
      setCreateAccount(false);
    }
  }, [user]);

  const shippingRates = {
    lagos: { standard: 3000, express: 5000 },
    abuja: { standard: 5000, express: 8000 },
    other: { standard: 3000, express: 6000 }
  };

  const subtotal = getCartSubtotal();
  const FREE_SHIPPING_THRESHOLD = 100000;
  
  const getShippingCost = () => {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
    const state = formData.state.toLowerCase();
    const deliveryMethod = formData.deliveryMethod;
    
    if (state.includes('lagos')) return shippingRates.lagos[deliveryMethod];
    if (state.includes('abuja') || state.includes('fct')) return shippingRates.abuja[deliveryMethod];
    return shippingRates.other[deliveryMethod];
  };

  const shippingCost = getShippingCost();
  const vat = subtotal * 0.08;
  const total = subtotal + shippingCost + vat;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAccountChange = (e) => {
    const { name, value } = e.target;
    setAccountData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'postalCode'];
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) errors[field] = 'This field is required';
    });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
    
    const phoneRegex = /^0[0-9]{10}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      errors.phone = 'Please enter a valid Nigerian phone number (11 digits starting with 0)';
    }
    
    // Only validate account creation if user is NOT logged in AND wants to create account
    if (!user && createAccount) {
      if (!accountData.password) {
        errors.password = 'Password is required';
      } else if (accountData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      
      if (!accountData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (accountData.password !== accountData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const prepareOrderData = () => {
    const orderItems = cartItems.map(item => ({
      product: item._id || item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.salePrice || item.price,
      size: item.selectedSize,
      color: item.selectedColor,
      image: item.images[0]
    }));

    return {
      customerInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.postalCode,
          country: formData.country
        }
      },
      accountOptions: {
        createAccount: !user && createAccount,
        password: (!user && createAccount) ? accountData.password : undefined
      },
      userId: user?._id || null,
      orderDetails: {
        items: orderItems,
        subtotal,
        shippingCost,
        vat,
        total,
        deliveryMethod: formData.deliveryMethod,
        notes: formData.orderNotes,
        qualifiesForFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD
      },
      metadata: {
        orderDate: new Date().toISOString(),
        itemsCount: cartItems.length,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        isLoggedInUser: !!user
      }
    };
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) {
      console.log('Already processing, ignoring duplicate request');
      return;
    }

    if (!validateForm()) {
      alert('Please fix the errors in the form before proceeding.');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = prepareOrderData();
      console.log('🛒 Initializing checkout...');
      console.log('👤 User logged in?', !!user);
      console.log('👤 User ID:', user?._id);
      console.log('📧 Order email:', orderData.customerInfo.email);
      
      const response = await orderAPI.initializeCheckout(orderData);

      if (response.success) {
        console.log('✅ Checkout initialized successfully');
        console.log('🔗 Payment URL:', response.data.authorizationUrl);
        console.log('📋 Reference:', response.data.reference);

        localStorage.setItem('pendingPaymentReference', response.data.reference);
        localStorage.setItem('pendingPaymentEmail', formData.email);

        clearCart();

        window.location.href = response.data.authorizationUrl;
      } else {
        throw new Error(response.message || 'Failed to initialize checkout');
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      alert(error.message || 'An error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const deliveryOptions = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      price: subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : `₦${shippingRates.other.standard.toLocaleString('en-NG')}`,
      description: '3-5 business days',
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: 'express',
      name: 'Express Delivery',
      price: subtotal >= FREE_SHIPPING_THRESHOLD ? 'FREE' : `₦${shippingRates.other.express.toLocaleString('en-NG')}`,
      description: '1-2 business days',
      icon: <Truck className="w-5 h-5" />
    }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Your cart is empty</p>
          <button
            onClick={() => navigate('/shop')}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const hasUndefinedProducts = cartItems.some(item => !item.name || !item.price);
  if (hasUndefinedProducts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto w-11/12 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/cart')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </button>
            
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-600">
                  Welcome back, <span className="font-semibold">{user.firstName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order with secure checkout</p>
          
          {user && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    You're logged in as {user.email}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Your order will be linked to your account for easy tracking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>
                
                {user && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Logged In
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={user}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } ${user ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                  required
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  We'll send your order confirmation here
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={user}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    } ${user ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={user}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    } ${user ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="08012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>
                )}
              </div>

              {/* Only show "Create Account" section if user is NOT logged in */}
              {!user && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      className="h-5 w-5 mt-0.5"
                    />
                    <div>
                      <span className="font-medium text-gray-900">Create an account for faster checkout next time</span>
                      <p className="text-sm text-gray-600 mt-1">
                        Save your shipping details and track orders easily
                      </p>
                    </div>
                  </label>
                  
                  {createAccount && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Create Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={accountData.password}
                          onChange={handleAccountChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                            formErrors.password ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Minimum 8 characters"
                        />
                        {formErrors.password && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={accountData.confirmPassword}
                          onChange={handleAccountChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                            formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.confirmPassword && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.confirmPassword}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address, house number"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                    formErrors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {formErrors.address && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                      formErrors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                      formErrors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select State</option>
                    {nigerianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  {formErrors.state && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.state}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition ${
                      formErrors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {formErrors.postalCode && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.postalCode}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value="Nigeria"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-5 h-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">Delivery Method</h2>
              </div>
              
              <div className="space-y-3">
                {deliveryOptions.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.deliveryMethod === option.id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value={option.id}
                      checked={formData.deliveryMethod === option.id}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{option.name}</span>
                        <span className="font-bold">{option.price}</span>
                      </div>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Notes (Optional)
                </label>
                <textarea
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleChange}
                  placeholder="Special instructions, delivery preferences, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                  rows="3"
                />
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center justify-center gap-6 text-gray-600 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                <span className="text-sm">SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                <span className="text-sm">Guaranteed Delivery</span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Items ({cartItems.length})</h3>
                {cartItems.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                      {item.images?.[0] && (
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} • {item.selectedSize}
                        {item.selectedColor && ` • ${item.selectedColor}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        ₦{((item.salePrice || item.price) * item.quantity).toLocaleString('en-NG', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₦{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${shippingCost.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    )}
                  </span>
                </div>

                {subtotal >= FREE_SHIPPING_THRESHOLD && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                    🎉 You've qualified for free shipping!
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>VAT (8%)</span>
                  <span className="font-semibold text-gray-900">
                    ₦{vat.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₦{total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-sm text-gray-500 mt-2">
                      Shipping calculated based on {formData.state || 'your location'}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-semibold uppercase tracking-wide transition-all duration-300 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {user ? 'Processing Order...' : 'Redirecting to payment...'}
                  </span>
                ) : (
                  user ? 'Place Order (Logged In)' : 'Proceed to Payment'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                {user ? 'Your order will be linked to your account' : 'You\'ll be redirected to Paystack for secure payment'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;