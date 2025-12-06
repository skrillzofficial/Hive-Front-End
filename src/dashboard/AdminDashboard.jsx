import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Wallet,
  ShoppingCart,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Menu,
  X,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import ProductForm from "./ProductForm";
import { orderAPI, transactionAPI } from "../api/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [dataError, setDataError] = useState(null);

  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts();

  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: products.length,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    productsGrowth: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [revenueData, setRevenueData] = useState({});

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoadingData(true);
    setDataError(null);

    try {
      // 1. Fetch revenue data
      const revenueResponse = await transactionAPI.getRevenue();

      if (revenueResponse.success) {
        const revenueData = revenueResponse.data;
        setRevenueData(revenueData);

        setStats((prev) => ({
          ...prev,
          totalRevenue: revenueData.successfulRevenue || 0,
          totalOrders: revenueData.totalTransactions || 0,
          successfulTransactions: revenueData.successfulTransactions || 0,
          pendingTransactions: revenueData.pendingTransactions || 0,
          failedTransactions: revenueData.failedTransactions || 0,
        }));
      }

      // 2. Fetch recent orders
      const ordersResponse = await orderAPI.getAll({ page: 1, limit: 10 });

      if (ordersResponse.success) {
        setRecentOrders(ordersResponse.data || []);
        setAllOrders(ordersResponse.data || []);
      }

      // 3. Fetch all orders for analysis
      const allOrdersResponse = await orderAPI.getAll({ limit: 100 });

      if (allOrdersResponse.success && allOrdersResponse.data) {
        calculateTopProducts(allOrdersResponse.data);
      }
    } catch (error) {
      setDataError(error.message || "Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoadingData(false);
    }
  };

  // Calculate top selling products from orders
  const calculateTopProducts = (orders) => {
    const productSales = {};

    orders.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item) => {
          if (!productSales[item.product]) {
            productSales[item.product] = {
              id: item.product,
              name: item.name || `Product ${item.product}`,
              sales: 0,
              revenue: 0,
              quantity: 0,
            };
          }

          productSales[item.product].sales += 1;
          productSales[item.product].revenue += item.price * item.quantity;
          productSales[item.product].quantity += item.quantity;
        });
      }
    });

    // Convert to array and sort by revenue
    const productsArray = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setTopProducts(productsArray);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [activeTab]);

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      totalProducts: products.length,
    }));
  }, [products]);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return `₦${
      amount?.toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) || "0"
    }`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
      case "delivered":
        return <CheckCircle size={14} />;
      case "processing":
        return <Clock size={14} />;
      case "pending":
        return <AlertCircle size={14} />;
      case "cancelled":
      case "failed":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const StatCard = ({ title, value, growth, icon: Icon, prefix = "" }) => (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-black rounded-lg">
          <Icon className="text-white" size={24} />
        </div>
        {growth !== undefined && (
          <div className="flex items-center gap-1">
            {growth >= 0 ? (
              <TrendingUp size={16} className="text-green-600" />
            ) : (
              <TrendingDown size={16} className="text-red-600" />
            )}
            <span
              className={`text-sm font-medium ${
                growth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {growth >= 0 ? "+" : ""}
              {growth}%
            </span>
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium tracking-wide uppercase mb-1">
        {title}
      </h3>
      <p className="text-2xl font-bold text-black tracking-wide">
        {prefix}
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );

  // Handle product submission
  const handleSubmitProduct = async (formData, productId) => {
    try {
      if (productId) {
        await updateProduct(productId, formData);
        toast.success("Product updated successfully!");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully!");
      }

      setShowProductForm(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      toast.error(`Failed to save product: ${error.message}`);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");
      await fetchProducts();
    } catch (error) {
      toast.error(`Failed to delete product: ${error.message}`);
    }
  };

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await orderAPI.updateStatus(orderId, {
        status: newStatus,
      });
      if (response.success) {
        toast.success("Order status updated successfully!");
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(`Failed to update order status: ${error.message}`);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Loading State */}
      {loadingData && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {/* Error State */}
      {dataError && !loadingData && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading dashboard: {dataError}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {!loadingData && !dataError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={stats.totalRevenue}
              growth={stats.revenueGrowth}
              icon={Wallet}
              prefix="₦"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              growth={stats.ordersGrowth}
              icon={ShoppingCart}
            />
            <StatCard
              title="Successful Orders"
              value={stats.successfulTransactions || 0}
              icon={CheckCircle}
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              growth={stats.productsGrowth}
              icon={Package}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Status Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black tracking-wide uppercase mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Successful</span>
                  <span className="font-semibold">
                    {stats.successfulTransactions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold">
                    {stats.pendingTransactions || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Failed</span>
                  <span className="font-semibold">
                    {stats.failedTransactions || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Revenue Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black tracking-wide uppercase mb-4">
                Revenue Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold">
                    {formatCurrency(stats.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Transactions</span>
                  <span className="font-semibold">{stats.totalOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Order Value</span>
                  <span className="font-semibold">
                    {stats.totalOrders > 0
                      ? formatCurrency(stats.totalRevenue / stats.totalOrders)
                      : formatCurrency(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-black tracking-wide uppercase mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab("orders")}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition"
                >
                  View All Orders
                </button>
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setShowProductForm(true);
                  }}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-700 transition"
                >
                  Add New Product
                </button>
                <button
                  onClick={fetchDashboardData}
                  className="w-full text-left px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
                Recent Orders
              </h3>
            </div>
            <div className="p-6">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-black">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.customerInfo?.firstName}{" "}
                          {order.customerInfo?.lastName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-black">
                          {formatCurrency(order.total)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent orders found
                </p>
              )}
              {recentOrders.length > 5 && (
                <button
                  onClick={() => setActiveTab("orders")}
                  className="w-full mt-4 text-center text-sm text-black hover:text-gray-700 font-medium"
                >
                  View all {recentOrders.length} orders →
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-black tracking-wide uppercase">
            All Orders ({allOrders.length})
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {loadingData ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : allOrders.length === 0 ? (
        <div className="p-8 text-center">
          <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                      <div className="text-xs text-gray-500">
                        {order.customerInfo?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || "pending"}
                        onChange={(e) =>
                          handleUpdateOrderStatus(order._id, e.target.value)
                        }
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )} border-0 focus:ring-2 focus:ring-black outline-none cursor-pointer`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `/orders/track/${order.orderNumber}`,
                              "_blank"
                            )
                          }
                          className="p-1 hover:bg-gray-100 rounded text-gray-600"
                          title="View Order"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="p-1 hover:bg-gray-100 rounded text-blue-600"
                          title="Edit Order"
                          onClick={() =>
                            toast.info("Edit order functionality coming soon")
                          }
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-200">
            {allOrders.map((order) => (
              <div key={order._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-black text-sm">
                      {order.orderNumber}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {order.customerInfo?.firstName}{" "}
                      {order.customerInfo?.lastName}
                    </p>
                  </div>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) =>
                      handleUpdateOrderStatus(order._id, e.target.value)
                    }
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )} border-0 focus:ring-2 focus:ring-black outline-none cursor-pointer`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div>
                    <p className="text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="font-semibold text-black mt-1">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items?.length || 0} items
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        window.open(
                          `/orders/track/${order.orderNumber}`,
                          "_blank"
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded text-gray-600"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded text-blue-600"
                      title="Edit"
                      onClick={() =>
                        toast.info("Edit order functionality coming soon")
                      }
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {!showProductForm && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-black tracking-wide uppercase">
                Products ({products.length})
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Manage your product catalog
              </p>
            </div>
            <button
              onClick={() => {
                setShowProductForm(true);
                setEditingProduct(null);
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 tracking-wide uppercase text-xs sm:text-sm font-medium w-full sm:w-auto justify-center"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>

          {productsLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : productsError ? (
            <div className="p-8 text-center">
              <p className="text-red-600">
                Error loading products: {productsError}
              </p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">
                No products found. Add your first product!
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium text-black">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-black">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.status === "active"
                                ? "bg-green-100 text-green-800"
                                : product.status === "draft"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.status || "draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1 hover:bg-gray-100 rounded text-blue-600"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-1 hover:bg-gray-100 rounded text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {products.map((product) => (
                  <div key={product._id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-3 mb-3">
                      {product.images?.[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-black text-sm">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium text-black text-sm">
                            {formatCurrency(product.price)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              product.stock > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock > 0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.stock} in stock
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : product.status === "draft"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status || "draft"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 hover:bg-gray-100 rounded text-blue-600"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showProductForm && (
        <ProductForm
          editingProduct={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSubmitProduct}
        />
      )}
    </div>
  );

  const renderCustomers = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
          Customer Management
        </h3>
        <p className="text-gray-600 mt-2">Customer analytics coming soon...</p>
      </div>
      <div className="p-6">
        <div className="text-center py-8">
          <Users size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500">
            Customer management features are under development
          </p>
          <button
            onClick={() => toast.info("Feature coming soon!")}
            className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            View Customer Analytics
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-30 left-6 z-50 p-2 rounded-md text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 shadow-sm"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <aside
          className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-black tracking-wide">
              Admin Dashboard
            </h1>
          </div>
          <nav className="p-4 space-y-2 pt-8">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "products", label: "Products", icon: Package },
              { id: "customers", label: "Customers", icon: Users },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                  if (item.id === "overview") {
                    fetchDashboardData();
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium tracking-wide transition-colors ${
                  activeTab === item.id
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 mt-4 border-t border-gray-200">
            <button
              onClick={fetchDashboardData}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw size={20} />
              Refresh Data
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-black tracking-wide capitalize">
              {activeTab === "overview" && "Dashboard Overview"}
              {activeTab === "orders" && "Order Management"}
              {activeTab === "products" && "Product Management"}
              {activeTab === "customers" && "Customer Management"}
            </h2>
            <p className="text-gray-600 mt-2">
              {activeTab === "overview" &&
                "Monitor your store performance and analytics"}
              {activeTab === "orders" && "Manage and track customer orders"}
              {activeTab === "products" &&
                "Add, edit, and manage your products"}
              {activeTab === "customers" &&
                "View and manage customer information"}
            </p>
          </div>

          {activeTab === "overview" && renderOverview()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "customers" && renderCustomers()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
