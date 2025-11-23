import React, { useState } from 'react';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">

      {/* Main Navbar */}
      <div className="container mx-auto w-11/12">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl lg:text-3xl font-bold text-black tracking-tight">
              Hive
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide">
              Shop
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide">
              Men
            </a>
            <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide">
              Women
            </a>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* Search Icon */}
            <button className="text-gray-700 hover:text-black transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </button>

            {/* User Icon */}
            <button className="text-gray-700 hover:text-black transition-colors">
              <User size={22} strokeWidth={1.5} />
            </button>

            {/* Cart Icon with Badge */}
            <button className="text-gray-700 hover:text-black transition-colors relative">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-black transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white py-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                Shop
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                Men
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                Women
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors font-medium uppercase text-sm tracking-wide py-2">
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;