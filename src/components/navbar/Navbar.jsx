import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';
import HiveLogo from '../../assets/images/Hive logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Get cart count from context
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Get user data from UserContext
  const { user, isAuthenticated, logout: contextLogout } = useUser();

  // Debug: Log user state changes
  useEffect(() => {
    console.log('User state changed:', { user, isAuthenticated });
  }, [user, isAuthenticated]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  // Close mobile menu when navigating
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${searchQuery}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    contextLogout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    // Try different possible name fields
    if (user.name) return user.name;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    
    return 'User';
  };

  // NavLink active class helper
  const getNavLinkClass = ({ isActive }) =>
    `text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide ${
      isActive ? 'text-black font-bold' : ''
    }`;

  const getMobileNavLinkClass = ({ isActive }) =>
    `text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2 ${
      isActive ? 'text-black font-bold' : ''
    }`;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar - Announcement */}
      <div className="bg-black text-white text-center py-2 text-xs sm:text-sm">
        <p>Free shipping on orders over ₦100,000 | Shop Now</p>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto w-11/12">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={HiveLogo} alt="Hive Logo" className="h-8 lg:h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={getNavLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/men" className={getNavLinkClass}>
              Men
            </NavLink>
            <NavLink to="/women" className={getNavLinkClass}>
              Women
            </NavLink>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Search"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>

            {/* User Icon with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className={`transition-colors ${
                  isAuthenticated 
                    ? 'text-black hover:text-gray-700' 
                    : 'text-gray-700 hover:text-black'
                }`}
                aria-label="User Menu"
              >
                <User size={22} strokeWidth={isAuthenticated ? 2 : 1.5} />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {isAuthenticated ? (
                    // Authenticated User Menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold text-white bg-black rounded">
                            Admin
                          </span>
                        )}
                        {!isAdmin && (
                          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold text-gray-700 bg-gray-100 rounded">
                            Customer
                          </span>
                        )}
                      </div>
                      
                      {/* Admin Dashboard Link (only for admins) */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <Settings size={16} className="mr-3" />
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <User size={16} className="mr-3" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/profile/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Package size={16} className="mr-3" />
                        My Orders
                      </Link>
                      
                      <Link
                        to="/profile/wishlist"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <Heart size={16} className="mr-3" />
                        Wishlist
                      </Link>
                      
                      <div className="border-t border-gray-200 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    // Unauthenticated User Menu
                    <>
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          Welcome to Hive
                        </p>
                        <p className="text-xs text-gray-500">
                          Sign in to access your account
                        </p>
                      </div>
                      
                      <Link
                        to="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      
                      <Link
                        to="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon with Badge */}
            <button
              onClick={() => navigate('/cart')}
              className="text-gray-700 hover:text-black transition-colors relative group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold group-hover:scale-110 transition-transform">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-black transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div ref={searchRef} className="py-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Search
              </button>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white py-4">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className={getMobileNavLinkClass}
                onClick={handleMobileNavClick}
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className={getMobileNavLinkClass}
                onClick={handleMobileNavClick}
              >
                Shop
              </NavLink>
              <NavLink
                to="/men"
                className={getMobileNavLinkClass}
                onClick={handleMobileNavClick}
              >
                Men
              </NavLink>
              <NavLink
                to="/women"
                className={getMobileNavLinkClass}
                onClick={handleMobileNavClick}
              >
                Women
              </NavLink>

              {/* Mobile Subcategories */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">
                  Categories
                </p>
                <NavLink
                  to="/shop/all/shirts"
                  className="text-gray-600 hover:text-black transition-colors text-sm py-2 block px-2"
                  onClick={handleMobileNavClick}
                >
                  Shirts
                </NavLink>
                <NavLink
                  to="/shop/all/polos"
                  className="text-gray-600 hover:text-black transition-colors text-sm py-2 block px-2"
                  onClick={handleMobileNavClick}
                >
                  Polos
                </NavLink>
                <NavLink
                  to="/shop/all/hoodies"
                  className="text-gray-600 hover:text-black transition-colors text-sm py-2 block px-2"
                  onClick={handleMobileNavClick}
                >
                  Hoodies
                </NavLink>
                <NavLink
                  to="/shop/all/caps"
                  className="text-gray-600 hover:text-black transition-colors text-sm py-2 block px-2"
                  onClick={handleMobileNavClick}
                >
                  Caps
                </NavLink>
                <NavLink
                  to="/shop/all/tanks"
                  className="text-gray-600 hover:text-black transition-colors text-sm py-2 block px-2"
                  onClick={handleMobileNavClick}
                >
                  Tanks
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;