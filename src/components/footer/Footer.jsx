import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import HiveLogo from '../../assets/images/Hive logo.png'

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto w-11/12">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <img src={HiveLogo} alt="Hive Logo" className="h-8 w-auto" />
              <p className="text-gray-400 text-sm leading-relaxed">
                Crafting timeless fashion for the modern wardrobe. Quality meets style.
              </p>
              {/* Social Icons */}
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Shop</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/shop/women" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Women's Collection
                  </a>
                </li>
                <li>
                  <a href="/shop/men" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Men's Collection
                  </a>
                </li>
                <li>
                  <a href="/shop?filter=new-arrival" className="text-gray-400 text-sm hover:text-white transition-colors">
                    New Arrivals
                  </a>
                </li>
              </ul>
            </div>

            {/* Help Links */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Help</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/support" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Customer Service
                  </a>
                </li>
                <li>
                  <a href="/returnandexchange" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Returns & Exchanges
                  </a>
                </li>
                <li>
                  <a href="sizeguide" className="text-gray-400 text-sm hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider">Stay Connected</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Subscribe to get exclusive deals and fashion updates.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-transparent border border-white text-white text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                />
                <button className="w-full px-6 py-3 bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2025 Hive. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;