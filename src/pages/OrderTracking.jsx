import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, MapPin, Truck, CheckCircle, Clock, ArrowLeft, Search } from 'lucide-react';
import { orderAPI } from '../api/api';

const OrderTracking = () => {
  const { orderNumber: urlOrderNumber } = useParams();
  const navigate = useNavigate();
  
  const [orderNumber, setOrderNumber] = useState(urlOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (urlOrderNumber) {
      fetchOrder(urlOrderNumber);
    }
  }, [urlOrderNumber]);

  const fetchOrder = async (orderNum) => {
    if (!orderNum || !orderNum.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching order:', orderNum);
      
      // 🔵 USED: orderAPI.trackByNumber() - GET /orders/track/:orderNumber
      const response = await orderAPI.trackByNumber(orderNum.trim());
      
      console.log('Order response:', response);

      if (response && (response.order || response.success)) {
        setOrder(response.order || response);
        setError(null);
      } else {
        setError('Order not found. Please check your order number.');
        setOrder(null);
      }
    } catch (err) {
      console.error('Fetch order error:', err);
      
      // Better error handling
      if (err.message.includes('<!DOCTYPE')) {
        setError('Server error: Unable to connect to the API. Please check if the backend is running.');
      } else if (err.message.includes('404')) {
        setError('Order not found. Please check your order number and try again.');
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
      // Update URL and fetch
      navigate(`/orders/track/${orderNumber.trim()}`);
      fetchOrder(orderNumber.trim());
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { id: 'pending', label: 'Order Placed', icon: <Package className="w-5 h-5" /> },
      { id: 'processing', label: 'Processing', icon: <Clock className="w-5 h-5" /> },
      { id: 'shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
      { id: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-5 h-5" /> }
    ];

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(order?.status?.toLowerCase() || 'pending');

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
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
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

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
          <p className="text-gray-600 mt-2">Enter your order number to track its status</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4">
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
          </form>
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
            <p className="text-gray-600">Fetching your order...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">
              <svg className="w-12 h-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Unable to Find Order</h3>
              <p className="text-sm">{error}</p>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Make sure you entered the correct order number from your confirmation email.
            </p>
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
                <span className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="mt-8">
                <div className="flex justify-between items-center">
                  {getStatusSteps().map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                            step.completed
                              ? 'bg-black text-white'
                              : step.active
                              ? 'bg-black text-white'
                              : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {step.icon}
                        </div>
                        <p
                          className={`text-xs mt-2 text-center font-medium ${
                            step.completed || step.active
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                      {index < getStatusSteps().length - 1 && (
                        <div
                          className={`h-1 flex-1 -mt-6 transition-all ${
                            step.completed ? 'bg-black' : 'bg-gray-200'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
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
                  <p className="font-medium">{order.customerInfo?.shippingAddress?.address}</p>
                  <p className="text-gray-600">
                    {order.customerInfo?.shippingAddress?.city},{' '}
                    {order.customerInfo?.shippingAddress?.state}{' '}
                    {order.customerInfo?.shippingAddress?.postalCode}
                  </p>
                  <p className="text-gray-600">{order.customerInfo?.shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.orderDetails?.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b last:border-b-0">
                    <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder-image.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size}
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
                    ₦{order.orderDetails?.subtotal?.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {order.orderDetails?.shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₦${order.orderDetails?.shippingCost?.toLocaleString('en-NG', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT</span>
                  <span className="font-semibold">
                    ₦{order.orderDetails?.vat?.toLocaleString('en-NG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="flex justify-between pt-4 border-t">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ₦{order.orderDetails?.total?.toLocaleString('en-NG', {
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