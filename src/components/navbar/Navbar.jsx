import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Mock cart count - In production, this would come from context/state management
  const cartCount = 3; 

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
      {/* Main Navbar */}
      <div className="container mx-auto w-11/12">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-black tracking-tight hover:text-gray-700 transition-colors">
              Hive
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLink to="/" className={getNavLinkClass}>
              Home
            </NavLink>
            <NavLink to="/shop" className={getNavLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/shop/men" className={getNavLinkClass}>
              Men
            </NavLink>
            <NavLink to="/shop/women" className={getNavLinkClass}>
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

            {/* User Icon */}
            <button 
              onClick={() => navigate('/account')}
              className="text-gray-700 hover:text-black transition-colors"
              aria-label="Account"
            >
              <User size={22} strokeWidth={1.5} />
            </button>

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
          <div className="py-4 border-t border-gray-200 bg-white">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </form>
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
                to="/shop/men" 
                className={getMobileNavLinkClass}
                onClick={handleMobileNavClick}
              >
                Men
              </NavLink>
              <NavLink 
                to="/shop/women" 
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