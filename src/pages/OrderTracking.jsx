import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Truck, CheckCircle, Clock, ArrowLeft, Search, Mail, AlertCircle, XCircle } from 'lucide-react';
import { orderAPI } from '../api/api';

const OrderTracking = () => {
  const { orderNumber: urlOrderNumber } = useParams();
  const navigate = useNavigate();
  
  const [orderNumber, setOrderNumber] = useState(urlOrderNumber || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmailInput, setShowEmailInput] = useState(false);

  useEffect(() => {
    if (urlOrderNumber) {
      // If we have a logged-in user, we don't need email
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        fetchOrder(urlOrderNumber, null);
      } else {
        setShowEmailInput(true);
      }
    }
  }, [urlOrderNumber]);

  const fetchOrder = async (orderNum, userEmail = null) => {
    if (!orderNum || !orderNum.trim()) {
      setError('Please enter an order number');
      return;
    }

    // For guest orders, email is required
    if (!userEmail && !(localStorage.getItem('token') || sessionStorage.getItem('token'))) {
      setError('Please provide the email used for this order');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching order:', orderNum, 'with email:', userEmail);
      
      // Pass email for guest order verification
      const response = await orderAPI.trackByNumber(orderNum.trim(), userEmail);
      
      console.log('Order response:', response);

      if (response && (response.data || response.success)) {
        setOrder(response.data || response);
        setError(null);
        setShowEmailInput(false);
      } else {
        setError('Order not found. Please check your order number and email.');
        setOrder(null);
      }
    } catch (err) {
      console.error('Fetch order error:', err);
      
      // Better error handling
      if (err.message.includes('<!DOCTYPE')) {
        setError('Server error: Unable to connect to the API. Please check if the backend is running.');
      } else if (err.message.includes('404')) {
        setError('Order not found. Please check your order number and email.');
      } else if (err.message.includes('403')) {
        setError('Not authorized. Please provide the email used for this order.');
        setShowEmailInput(true);
      } else if (err.message.includes('Failed to fetch')) {
        setError('Network error: Unable to reach the server. Please check your connection.');
      } else {
        setError(err.message || 'Failed to fetch order. Please try again.');
      }
      
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderNumber.trim()) {
      // Check if user is logged in
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // Logged in user - no email needed
        navigate(`/orders/track/${orderNumber.trim()}`);
        fetchOrder(orderNumber.trim(), null);
      } else if (email.trim()) {
        // Guest user with email
        navigate(`/orders/track/${orderNumber.trim()}`);
        fetchOrder(orderNumber.trim(), email.trim());
      } else {
        // Guest user without email - show email input
        setError('Please provide the email used for this order');
        setShowEmailInput(true);
      }
    }
  };

  // If we need email for verification
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (orderNumber.trim() && email.trim()) {
      fetchOrder(orderNumber.trim(), email.trim());
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: <Package className="w-5 h-5" /> },
      { id: 'processing', label: 'Processing', icon: <Clock className="w-5 h-5" /> },
      { id: 'shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
      { id: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> }
    ];

    // Determine current step based on deliveryStatus
    const deliveryStatus = order?.deliveryStatus?.toLowerCase();
    
    // Map deliveryStatus to step index
    const statusMap = {
      'pending': 0,
      'processing': 1,
      'shipped': 2,
      'delivered': 3,
      'cancelled': -1 // Special case for cancelled orders
    };

    // For cancelled orders, don't show any completed steps
    const currentStepIndex = deliveryStatus === 'cancelled' ? -1 : (statusMap[deliveryStatus] || 0);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentStepIndex && currentStepIndex >= 0,
      active: index === currentStepIndex,
      cancelled: deliveryStatus === 'cancelled'
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      // Order status values
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      
      // Delivery status values
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('token') || !!sessionStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto w-11/12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            Track Your Order
          </h1>
          <p className="text-gray-600 mt-2">
            {isLoggedIn 
              ? "Enter your order number to track its status" 
              : "Enter your order number and email to track your order"
            }
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          {showEmailInput ? (
            // Email verification form
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter order number (e.g., ORD-12345)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                  disabled={loading}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email used for this order"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                    disabled={loading}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Please provide the email address you used when placing the order.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !orderNumber.trim() || !email.trim()}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                  {loading ? 'Verifying...' : 'Verify and Track'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailInput(false);
                    setError(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // Normal search form
            <form onSubmit={handleSearch} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="Enter order number (e.g., ORD-12345)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Search className="w-5 h-5" />
                  Track Order
                </button>
              </div>
              {!isLoggedIn && (
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-yellow-600 font-medium">Note:</span>
                  <span>Guest orders require email verification. You'll be asked to provide your email if needed.</span>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-10 w-10 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">
              {showEmailInput ? 'Verifying your order...' : 'Fetching your order...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <div className="text-red-600 shrink-0 mt-1">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Unable to Find Order</h3>
                <p className="text-sm text-red-800 mb-3">{error}</p>
                {error.includes('Not authorized') && !showEmailInput && (
                  <button
                    onClick={() => setShowEmailInput(true)}
                    className="px-4 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
                  >
                    Provide Email Address
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && !loading && !error && (
          <div className="space-y-6">
            {/* Order Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(order.status)} flex items-center gap-2`}>
                    {getStatusIcon(order.status)}
                    Order Status: {order.status}
                  </span>
                  {order.deliveryStatus && (
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(order.deliveryStatus)} flex items-center gap-2`}>
                      {getStatusIcon(order.deliveryStatus)}
                      Delivery: {order.deliveryStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* Delivery Status Timeline */}
              <div className="mt-8">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Delivery Progress</h3>
                <div className="flex justify-between items-center">
                  {getStatusSteps().map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center flex-1 relative">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 relative ${
                            step.cancelled
                              ? 'bg-gray-200 text-gray-400'
                              : step.completed
                              ? 'bg-black text-white'
                              : step.active
                              ? 'bg-black text-white ring-4 ring-black ring-opacity-20'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p
                          className={`text-xs mt-2 text-center font-medium ${
                            step.cancelled
                              ? 'text-gray-400'
                              : step.completed || step.active
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.active && order.deliveryStatus !== 'cancelled' && (
                          <p className="text-xs text-gray-500 mt-1">
                            Current Status
                          </p>
                        )}
                      </div>
                      {index < getStatusSteps().length - 1 && (
                        <div
                          className={`h-1 flex-1 -mt-6 transition-all ${
                            step.cancelled
                              ? 'bg-gray-200'
                              : step.completed
                              ? 'bg-black'
                              : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Tracking Information */}
                {(order.deliveryStatus === 'shipped' || order.deliveryStatus === 'delivered') && (
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Shipping Information
                    </h4>
                    {order.trackingNumber && (
                      <p className="text-sm text-blue-800 mb-1">
                        <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                      </p>
                    )}
                    {order.estimatedDelivery && (
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}
                      </p>
                    )}
                    {order.deliveryMethod && (
                      <p className="text-sm text-blue-800 mt-1">
                        <span className="font-medium">Delivery Method:</span> {order.deliveryMethod}
                      </p>
                    )}
                  </div>
                )}
                
                {order.deliveryStatus === 'cancelled' && (
                  <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Order Cancelled
                    </h4>
                    <p className="text-sm text-red-800">
                      This order has been cancelled. Please contact support if you have any questions.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium">
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium">{order.customerInfo?.email}</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Phone:</span>{' '}
                    <span className="font-medium">{order.customerInfo?.phone}</span>
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Address
                </h3>
                <div className="space-y-1 text-sm">
                  {order.customerInfo?.shippingAddress ? (
                    <>
                      <p className="font-medium">{order.customerInfo.shippingAddress.street}</p>
                      <p className="text-gray-600">
                        {order.customerInfo.shippingAddress.city},{' '}
                        {order.customerInfo.shippingAddress.state}{' '}
                        {order.customerInfo.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-600">{order.customerInfo.shippingAddress.country}</p>
                    </>
                  ) : order.customerInfo?.address ? (
                    <>
                      <p className="font-medium">{order.customerInfo.address}</p>
                      <p className="text-gray-600">
                        {order.customerInfo.city},{' '}
                        {order.customerInfo.state}{' '}
                        {order.customerInfo.postalCode}
                      </p>
                      <p className="text-gray-600">{order.customerInfo.country || 'Nigeria'}</p>
                    </>
                  ) : (
                    <p className="text-gray-600">No shipping address provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₦{(item.price * item.quantity).toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                      <p className="text-sm text-gray-600">
                        ₦{item.price.toLocaleString('en-NG')} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ₦{order.subtotal?.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {order.shippingCost === 0 || order.shippingFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${(order.shippingCost || order.shippingFee || 0)?.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span className="font-semibold">
                    ₦{order.tax?.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₦{order.total?.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <button
                onClick={() => navigate('/support')}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;