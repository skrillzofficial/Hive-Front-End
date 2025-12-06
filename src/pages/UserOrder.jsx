import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Eye,
  Filter,
  RefreshCw,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { orderAPI } from '../api/api';

const UserOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchUserOrders();
  }, []);

  const fetchUserOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await orderAPI.getMyOrders();
      
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message || 'Failed to load orders');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString('en-NG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || '0'}`;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
    };
    return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTotalItems = (order) => {
    return order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesStatus = statusFilter === 'all' || 
      order.deliveryStatus?.toLowerCase() === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (sortBy === 'highest') {
      return b.total - a.total;
    } else if (sortBy === 'lowest') {
      return a.total - b.total;
    }
    return 0;
  });

  const handleTrackOrder = (orderNumber) => {
    navigate(`/orders/track/${orderNumber}`);
  };

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-11/12 container mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            My Orders
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all your orders in one place
          </p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {orders.filter(o => o.deliveryStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {orders.filter(o => o.deliveryStatus === 'processing').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {orders.filter(o => o.deliveryStatus === 'shipped').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Shipped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {orders.filter(o => o.deliveryStatus === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Delivered</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by order number or product..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-gray-500" />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchUserOrders}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <div className="text-red-600 flex-shrink-0 mt-1">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
                <p className="text-sm text-red-800 mb-3">{error}</p>
                <button
                  onClick={fetchUserOrders}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm transition"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-6">
            {sortedOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'No orders match your search criteria.' 
                    : 'You haven\'t placed any orders yet.'}
                </p>
                {searchTerm || statusFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                    }}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                  >
                    Browse Products
                  </button>
                )}
              </div>
            ) : (
              sortedOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.deliveryStatus)}`}>
                          {getStatusIcon(order.deliveryStatus)}
                          {order.deliveryStatus}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Items</div>
                        <div className="text-xl font-bold text-gray-900">{getTotalItems(order)}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Delivery Method</div>
                        <div className="text-lg font-semibold text-gray-900 capitalize">
                          {order.deliveryMethod || 'Standard'}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Payment Status</div>
                        <div className={`text-lg font-semibold ${
                          order.paymentStatus === 'paid' ? 'text-green-600' : 
                          order.paymentStatus === 'pending' ? 'text-yellow-600' : 
                          'text-red-600'
                        }`}>
                          {order.paymentStatus}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleTrackOrder(order.orderNumber)}
                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                        Track Order
                      </button>
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        {expandedOrder === order._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedOrder === order._id && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h4>
                        
                        {/* Items */}
                        <div className="mb-6">
                          <h5 className="font-medium text-gray-700 mb-3">Items</h5>
                          <div className="space-y-3">
                            {order.items?.map((item, index) => (
                              <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-1">
                                    <span>Quantity: {item.quantity}</span>
                                    {item.size && <span>Size: {item.size}</span>}
                                    {item.color && <span>Color: {item.color}</span>}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {formatCurrency(item.price)} each
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium text-gray-700 mb-3">Order Summary</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Shipping</span>
                              <span className="font-medium">
                                {order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}
                              </span>
                            </div>
                            {order.tax > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">VAT</span>
                                <span className="font-medium">{formatCurrency(order.tax)}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 border-t border-gray-300">
                              <span className="font-bold text-gray-900">Total</span>
                              <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;