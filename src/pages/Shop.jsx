import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  products, 
  categories, 
  subcategories,
  getProductsByCategory,
  getProductsBySubcategory 
} from '../data/ProductData';
import { Filter, X, ChevronDown, Star } from 'lucide-react';

const Shop = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || 'all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  // Get all unique sizes from products
  const allSizes = [...new Set(products.flatMap(p => p.sizes))];

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = getProductsByCategory(selectedCategory);
    }

    // Filter by subcategory
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    // Filter by price range
    result = result.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by sizes
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Filter sale products
    if (showSaleOnly) {
      result = result.filter(p => p.salePrice !== null);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        result.sort((a, b) => {
          const aIsNew = a.tags.includes('new-arrival');
          const bIsNew = b.tags.includes('new-arrival');
          return bIsNew - aIsNew;
        });
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - bestsellers first
        result.sort((a, b) => {
          const aIsBest = a.tags.includes('bestseller');
          const bIsBest = b.tags.includes('bestseller');
          return bIsBest - aIsBest;
        });
    }

    setFilteredProducts(result);
  }, [selectedCategory, selectedSubcategory, priceRange, selectedSizes, showSaleOnly, sortBy]);

  // Update filters when URL params change
  useEffect(() => {
    if (category) setSelectedCategory(category);
    if (subcategory) setSelectedSubcategory(subcategory);
  }, [category, subcategory]);

  // Handle category filter
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
    if (cat === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${cat}`);
    }
  };

  // Handle subcategory filter
  const handleSubcategoryChange = (subcat) => {
    setSelectedSubcategory(subcat);
    if (subcat === 'all') {
      navigate(`/shop/${selectedCategory}`);
    } else {
      navigate(`/shop/${selectedCategory}/${subcat}`);
    }
  };

  // Handle size filter
  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceRange([0, 200000]);
    setSelectedSizes([]);
    setShowSaleOnly(false);
    navigate('/shop');
  };

  // Get available subcategories for selected category
  const availableSubcategories = selectedCategory === 'all' 
    ? subcategories
    : subcategories.filter(sub => sub.category.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto w-11/12 py-8 lg:py-12">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide mb-2">
                {selectedSubcategory !== 'all' 
                  ? subcategories.find(s => s.slug === selectedSubcategory)?.name 
                  : selectedCategory !== 'all' 
                  ? categories.find(c => c.slug === selectedCategory)?.name 
                  : 'All Products'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg p-6 sticky top-4">
              {/* Clear Filters */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold uppercase">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 uppercase text-sm">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === 'all'}
                      onChange={() => handleCategoryChange('all')}
                      className="mr-2"
                    />
                    <span className="text-sm">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.slug}
                        onChange={() => handleCategoryChange(cat.slug)}
                        className="mr-2"
                      />
                      <span className="text-sm">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Subcategory Filter */}
              <div className="mb-6 border-t pt-6">
                <h4 className="font-semibold mb-3 uppercase text-sm">Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="subcategory"
                      checked={selectedSubcategory === 'all'}
                      onChange={() => handleSubcategoryChange('all')}
                      className="mr-2"
                    />
                    <span className="text-sm">All Types</span>
                  </label>
                  {availableSubcategories.map((subcat) => (
                    <label key={subcat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="subcategory"
                        checked={selectedSubcategory === subcat.slug}
                        onChange={() => handleSubcategoryChange(subcat.slug)}
                        className="mr-2"
                      />
                      <span className="text-sm">{subcat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 border-t pt-6">
                <h4 className="font-semibold mb-3 uppercase text-sm">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6 border-t pt-6">
                <h4 className="font-semibold mb-3 uppercase text-sm">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-1 border rounded text-sm transition ${
                        selectedSizes.includes(size)
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sale Only */}
              <div className="border-t pt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showSaleOnly}
                    onChange={(e) => setShowSaleOnly(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-semibold">Sale Items Only</span>
                </label>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full mt-6 bg-black text-white py-2 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white rounded-lg p-4 mb-6 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredProducts.length} results
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.slug}`}
                    className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.tags.includes('new-arrival') && (
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                            New
                          </span>
                        )}
                        {product.salePrice && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                            Sale
                          </span>
                        )}
                        {product.tags.includes('bestseller') && (
                          <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                            Best
                          </span>
                        )}
                      </div>

                      {/* Sale Percentage */}
                      {product.salePrice && (
                        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-bold">
                          {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 fill-current'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              ₦{product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₦{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            ₦{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="mt-2">
                        {product.stockCount > 0 ? (
                          <span className="text-xs text-green-600 font-medium">In Stock</span>
                        ) : (
                          <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <X className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or search criteria
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;