import React from 'react';
import { RefreshCw, CheckCircle, XCircle, Package, AlertCircle } from 'lucide-react';

const ReturnsAndExchanges = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto w-11/12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-gray-300 text-lg">Easy returns within 7 days</p>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-16">
        {/* Return Policy Overview */}
        <div className="bg-white p-8 shadow-sm mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <h2 className="text-2xl font-bold">Our Return Policy</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            We want you to be completely satisfied with your purchase. If you're not happy with your order, 
            you can return or exchange it within 7 days of delivery. Items must be unworn, unwashed, 
            and have all original tags attached.
          </p>
        </div>

        {/* How to Return */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">How to Return Your Order</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 shadow-sm">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
              <p className="text-gray-600">
                Call us at +234 (0) 123 456 7890 or email support@hive.com with your order number and reason for return.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Pack Your Item</h3>
              <p className="text-gray-600">
                Pack the item securely with all original tags and packaging. Include a copy of your receipt or order confirmation.
              </p>
            </div>

            <div className="bg-white p-6 shadow-sm">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Send or Drop Off</h3>
              <p className="text-gray-600">
                Ship the package to our address or drop it off at our Lagos store. We'll process your return within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* What Can Be Returned */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle size={28} className="text-green-600" />
              <h2 className="text-2xl font-bold">We Accept Returns For</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Items with original tags attached</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Unworn and unwashed items</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Items in original packaging</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Returns within 7 days of delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">Defective or damaged items</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <XCircle size={28} className="text-red-600" />
              <h2 className="text-2xl font-bold">We Cannot Accept</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <span className="text-gray-700">Items without tags</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <span className="text-gray-700">Worn or washed items</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <span className="text-gray-700">Items damaged by customer</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <span className="text-gray-700">Returns after 7 days</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">✗</span>
                <span className="text-gray-700">Sale items (unless defective)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-white p-8 shadow-sm mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
              <Package size={24} />
            </div>
            <h2 className="text-2xl font-bold">Exchanges</h2>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Need a different size or color? We're happy to exchange your item. Follow the same return process 
            and let us know what you'd like instead. Exchanges are subject to availability.
          </p>
          <div className="bg-gray-50 p-6">
            <h3 className="font-semibold mb-2">Exchange Process:</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Contact us to initiate an exchange</li>
              <li>Return your original item</li>
              <li>We'll send your new item once we receive the return</li>
              <li>No additional shipping charges for exchanges within Lagos</li>
            </ol>
          </div>
        </div>

        {/* Refunds */}
        <div className="bg-white p-8 shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-6">Refund Information</h2>
          <div className="space-y-4 text-gray-700">
            <p>
              <span className="font-semibold">Processing Time:</span> Refunds are processed within 3-5 business days 
              after we receive and inspect your return.
            </p>
            <p>
              <span className="font-semibold">Refund Method:</span> We'll refund to your original payment method. 
              Bank transfers may take 5-7 business days to reflect in your account.
            </p>
            <p>
              <span className="font-semibold">Shipping Costs:</span> Original shipping fees are non-refundable 
              unless the item is defective or we made an error.
            </p>
          </div>
        </div>

        {/* Return Address */}
        <div className="bg-black text-white p-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertCircle size={28} />
            <h2 className="text-2xl font-bold">Return Address</h2>
          </div>
          <p className="text-gray-300 mb-4">Send your returns to:</p>
          <div className="text-lg">
            <p className="font-semibold">Hive Returns Department</p>
            <p>Lagos, Nigeria</p>
            <p className="mt-4 text-gray-300">
              For pickup within Lagos, call us at +234 (0) 123 456 7890
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Have questions about returns or exchanges? Our customer service team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+2340123456789"
              className="bg-black text-white px-8 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              Call Us
            </a>
            <a
              href="/customer-service"
              className="border-2 border-black text-black px-8 py-3 font-medium hover:bg-black hover:text-white transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndExchanges;