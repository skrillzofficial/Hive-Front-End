import React, { useState } from 'react';
import { Ruler, User } from 'lucide-react';

const SizeGuide = () => {
  const [activeCategory, setActiveCategory] = useState('men-shirts');

  const categories = [
    { id: 'men-shirts', label: 'Men - Shirts & Polos' },
    { id: 'men-hoodies', label: 'Men - Hoodies' },
    { id: 'women-tops', label: 'Women - Tops' },
    { id: 'women-jumpsuits', label: 'Women - Jumpsuits' },
    { id: 'caps', label: 'Caps' }
  ];

  const sizeData = {
    'men-shirts': {
      headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)'],
      rows: [
        ['S', '36-38', '27', '17'],
        ['M', '38-40', '28', '18'],
        ['L', '40-42', '29', '19'],
        ['XL', '42-44', '30', '20'],
        ['XXL', '44-46', '31', '21']
      ]
    },
    'men-hoodies': {
      headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Sleeve (inches)'],
      rows: [
        ['S', '38-40', '26', '33'],
        ['M', '40-42', '27', '34'],
        ['L', '42-44', '28', '35'],
        ['XL', '44-46', '29', '36'],
        ['XXL', '46-48', '30', '37']
      ]
    },
    'women-tops': {
      headers: ['Size', 'Bust (inches)', 'Length (inches)', 'Shoulder (inches)'],
      rows: [
        ['XS', '30-32', '24', '14'],
        ['S', '32-34', '25', '15'],
        ['M', '34-36', '26', '16'],
        ['L', '36-38', '27', '17'],
        ['XL', '38-40', '28', '18']
      ]
    },
    'women-jumpsuits': {
      headers: ['Size', 'Bust (inches)', 'Waist (inches)', 'Hips (inches)', 'Length (inches)'],
      rows: [
        ['XS', '30-32', '24-26', '34-36', '54'],
        ['S', '32-34', '26-28', '36-38', '55'],
        ['M', '34-36', '28-30', '38-40', '56'],
        ['L', '36-38', '30-32', '40-42', '57'],
        ['XL', '38-40', '32-34', '42-44', '58']
      ]
    },
    'caps': {
      headers: ['Size', 'Head Circumference (inches)'],
      rows: [
        ['One Size', '21-24 (Adjustable)']
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto w-11/12">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Size Guide</h1>
          <p className="text-gray-300 text-lg">Find your perfect fit</p>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-16">
        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 font-medium transition-colors ${
                  activeCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Size Chart */}
        <div className="bg-white p-6 lg:p-8 shadow-sm mb-12">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black">
                  {sizeData[activeCategory].headers.map((header, index) => (
                    <th key={index} className="text-left py-4 px-4 font-bold uppercase text-sm">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sizeData[activeCategory].rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-200">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="py-4 px-4 text-gray-700">
                        {cellIndex === 0 ? <span className="font-semibold">{cell}</span> : cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                <Ruler size={24} />
              </div>
              <h2 className="text-2xl font-bold">How to Measure</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Chest/Bust</h3>
                <p className="text-gray-600">Measure around the fullest part of your chest, keeping the tape level.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Waist</h3>
                <p className="text-gray-600">Measure around your natural waistline, keeping the tape comfortably loose.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Hips</h3>
                <p className="text-gray-600">Measure around the fullest part of your hips.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Length</h3>
                <p className="text-gray-600">Measure from the highest point of the shoulder down to the desired length.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-bold">Fitting Tips</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Between Sizes?</h3>
                <p className="text-gray-600">If you're between sizes, we recommend sizing up for a more comfortable fit.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Body Type</h3>
                <p className="text-gray-600">Our clothing is designed for a regular fit. Check the product description for specific fit details.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Still Unsure?</h3>
                <p className="text-gray-600">Contact our customer service team for personalized sizing advice.</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Care Instructions</h3>
                <p className="text-gray-600">Follow the care label to maintain the best fit and quality of your garments.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-black text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Sizing?</h2>
          <p className="text-gray-300 mb-6">Our customer service team is ready to assist you</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+2340123456789"
              className="bg-white text-black px-8 py-3 font-medium hover:bg-gray-200 transition-colors"
            >
              Call Us
            </a>
            <a
              href="/customer-service"
              className="border border-white text-white px-8 py-3 font-medium hover:bg-white hover:text-black transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;