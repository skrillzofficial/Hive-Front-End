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
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import ProductForm from "./ProductForm";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchProducts,
  } = useProducts();

  const [stats, setStats] = useState({
    totalRevenue: 2450000,
    totalOrders: 156,
    totalCustomers: 89,
    totalProducts: products.length,
    revenueGrowth: 12.5,
    ordersGrowth: 8.3,
    customersGrowth: 15.2,
    productsGrowth: 5.1,
  });

  const [recentOrders] = useState([
    {
      id: "ORD-001",
      customer: "John Doe",
      date: "2025-01-15",
      total: 45000,
      status: "completed",
    },
    {
      id: "ORD-002",
      customer: "Jane Smith",
      date: "2025-01-15",
      total: 32000,
      status: "processing",
    },
    {
      id: "ORD-003",
      customer: "Mike Johnson",
      date: "2025-01-14",
      total: 58000,
      status: "pending",
    },
    {
      id: "ORD-004",
      customer: "Sarah Williams",
      date: "2025-01-14",
      total: 27000,
      status: "completed",
    },
    {
      id: "ORD-005",
      customer: "David Brown",
      date: "2025-01-13",
      total: 41000,
      status: "cancelled",
    },
  ]);

  const [topProducts] = useState([
    {
      id: 1,
      name: "Classic Black Shirt",
      sales: 45,
      revenue: 225000,
      stock: 23,
    },
    { id: 2, name: "Slim Fit Polo", sales: 38, revenue: 190000, stock: 15 },
    { id: 3, name: "Premium Hoodie", sales: 32, revenue: 320000, stock: 8 },
    { id: 4, name: "Denim Jacket", sales: 28, revenue: 420000, stock: 12 },
    { id: 5, name: "Cotton T-Shirt", sales: 52, revenue: 156000, stock: 45 },
  ]);

  const [lowSellingProducts] = useState([
    { id: 6, name: "Vintage Cap", sales: 3, revenue: 15000, stock: 45 },
    { id: 7, name: "Leather Belt", sales: 5, revenue: 25000, stock: 38 },
    { id: 8, name: "Winter Scarf", sales: 4, revenue: 20000, stock: 52 },
    { id: 9, name: "Sports Socks", sales: 6, revenue: 12000, stock: 67 },
    { id: 10, name: "Tank Top", sales: 7, revenue: 21000, stock: 29 },
  ]);

  useEffect(() => {
    setStats((prev) => ({
      ...prev,
      totalProducts: products.length,
    }));
  }, [products]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} />;
      case "processing":
        return <Clock size={14} />;
      case "pending":
        return <AlertCircle size={14} />;
      case "cancelled":
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
        {growth && (
          <span
            className={`text-sm font-medium ${
              growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {growth >= 0 ? "+" : ""}
            {growth}%
          </span>
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

  const handleSubmitProduct = async (productData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
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
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
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
          title="Total Customers"
          value={stats.totalCustomers}
          growth={stats.customersGrowth}
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          growth={stats.productsGrowth}
          icon={Package}
        />
      </div>

      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={fetchProducts}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best Selling Products */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
              Best Selling Products
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-green-600">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-black">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">
                    ₦{product.revenue.toLocaleString()}
                  </p>
                  <p
                    className={`text-sm ${
                      product.stock < 10 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Selling Products */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-black tracking-wide uppercase">
              Low Selling Products
            </h3>
          </div>
          <div className="p-6 space-y-4">
            {lowSellingProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-red-600">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-black">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-black">
                    ₦{product.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-base sm:text-lg font-semibold text-black tracking-wide uppercase">
          All Orders
        </h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter size={16} />
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-800">
            <Download size={16} />
          </button>
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
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
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-black">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {order.date}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-black">
                  ₦{order.total.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded" title="More">
                      <MoreVertical size={16} />
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
        {recentOrders.map((order) => (
          <div key={order.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-black text-sm">{order.id}</p>
                <p className="text-xs text-gray-600 mt-1">{order.customer}</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {getStatusIcon(order.status)}
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <p className="text-xs text-gray-500">{order.date}</p>
                <p className="font-semibold text-black mt-1">
                  ₦{order.total.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-gray-100 rounded" title="View">
                  <Eye size={16} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="More">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      {!showProductForm && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base sm:text-lg font-semibold text-black tracking-wide uppercase">
              Products ({products.length})
            </h3>
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

          {loading && (
            <div className="p-6 text-center">
              <p>Loading products...</p>
            </div>
          )}

          {error && (
            <div className="p-4 sm:p-6 bg-red-50 border border-red-200 rounded m-4">
              <p className="text-red-800">Error: {error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
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
                        <td className="px-6 py-4 text-sm font-medium text-black">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-black">
                          ₦{product.price?.toLocaleString()}
                          {product.salePrice && (
                            <span className="text-gray-500 line-through ml-2 text-xs">
                              ₦{product.salePrice.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {product.stockCount}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1 hover:bg-gray-100 rounded text-blue-600"
                              title="Edit product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                              title="Delete product"
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
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 capitalize">
                          {product.category}
                        </p>
                      </div>
                      <span
                        className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-black text-sm">
                          ₦{product.price?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: {product.stockCount}
                        </p>
                      </div>
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
                          className="p-2 hover:bg-red-100 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {products.length === 0 && !loading && (
                <div className="p-6 text-center text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">
                    No products found. Create your first product to get started.
                  </p>
                </div>
              )}
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
          Customers
        </h3>
      </div>
      <div className="p-6">
        <p className="text-gray-600">Customer management coming soon...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
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