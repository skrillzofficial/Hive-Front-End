import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Context
import { UserProvider } from "./context/UserContext";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";

// Components
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import CustomerService from "./components/footer/CustomerService";
import SizeGuide from "./components/footer/SizeGuide";
import ReturnAndExchange from "./components/footer/ReturnAndExchanges";
import Login from "./Auths/Login";
import Register from "./Auths/Register";
import ForgotPassword from "./Auths/ForgotPassword";
import AdminDashboard from "./dashboard/AdminDashboard";
import VerifyOTP from "./Auths/VerifyOtp";
import Men from "./pages/Men";
import Women from "./pages/Women";
import Checkout from "./checkout/Checkout";
import PaymentCallback from "./checkout/PaymentCallback";
import OrderTracking from "./pages/OrderTracking";
import UserOrders from "./pages/UserOrder";


// Layout Component
const Layout = ({ children }) => {
  const location = useLocation();

  // Check if current route is an auth route
  const isAuthRoute =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/verify-otp" ||
    location.pathname === "/forgot-password";

  return (
    <>
      {!isAuthRoute && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!isAuthRoute && <Footer />}
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Layout>
                <Routes>
                  {/* Home Route */}
                  <Route path="/" element={<Home />} />
                  
                  {/* Category Pages */}
                  <Route path="/men" element={<Men />} />
                  <Route path="/women" element={<Women />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />

                  {/* Shop Routes */}
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:category" element={<Shop />} />
                  <Route path="/shop/:category/:subcategory" element={<Shop />} />

                  {/* Cart Route */}
                  <Route path="/cart" element={<Cart />} />

                  {/* Checkout */}
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment/callback" element={<PaymentCallback />} />

                  {/* Profile Route */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/my-orders" element={<UserOrders/>} />

                  {/* Orders */}
                  <Route path="/orders/track/:orderNumber" element={<OrderTracking />} />

                  {/* Product Details Route */}
                  <Route path="/product/:slug" element={<ProductDetails />} />

                  {/* Size Guide page */}
                  <Route path="/sizeguide" element={<SizeGuide />} />

                  {/* CustomerService page */}
                  <Route path="/support" element={<CustomerService />} />

                  {/* ReturnAndExchange page */}
                  <Route
                    path="/returnandexchange"
                    element={<ReturnAndExchange />}
                  />

                  {/* 404 Not Found Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

// 404 Not Found Component
const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>

        <a
          href="/"
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition inline-block uppercase font-medium tracking-wider"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

function App() {
  return <AppRoutes />;
}

export default App;