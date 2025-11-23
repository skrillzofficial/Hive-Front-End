import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Context
import { CartProvider } from "./context/CartContext";

// Components
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";

// Pages
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";

// Layout Component
const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <CartProvider>
        <Layout>
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />

            {/* Shop Routes */}
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/shop/:category/:subcategory" element={<Shop />} />

            {/* Cart Route */}
            <Route path="/cart" element={<Cart />} />

            {/* Profile Route */}
            <Route path="/profile" element={<Profile />} />

            {/* Product Details Route */}
            <Route path="/product/:slug" element={<ProductDetails />} />

            {/* 404 Not Found Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </CartProvider>
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