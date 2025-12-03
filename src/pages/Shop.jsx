import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Filter, X, ChevronDown, Star, Grid, List } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Shop = () => {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedSubcategory, setSelectedSubcategory] = useState(subcategory || 'all');
  const [priceRange, setPriceRange] = useState([0, 200000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showSaleOnly, setShowSaleOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Define main categories
  const mainCategories = [
    { slug: 'men', name: 'Men', color: 'bg-blue-50' },
    { slug: 'women', name: 'Women', color: 'bg-pink-50' },
    { slug: 'unisex', name: 'Unisex', color: 'bg-green-50' }
  ];

  // Define subcategories
  const allSubcategories = [
    'hoodies', 'polos', 'shirts', 'caps', 'tanks', 'jumpsuits'
  ];

  // Get all unique sizes from products
  const allSizes = React.useMemo(() => {
    const sizes = new Set();
    products.forEach(p => {
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(size => sizes.add(size));
      }
    });
    return Array.from(sizes).sort();
  }, [products]);

  // Filter and sort products
  useEffect(() => {
    if (loading) return;
    
    let result = [...products];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
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
        p.sizes && p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Filter sale products
    if (showSaleOnly) {
      result = result.filter(p => p.salePrice && p.salePrice < p.price);
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
        // Sort by new-arrival tag or recent
        result.sort((a, b) => {
          const aIsNew = a.tags?.includes('new-arrival') ? 1 : 0;
          const bIsNew = b.tags?.includes('new-arrival') ? 1 : 0;
          return bIsNew - aIsNew || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // 'featured'
        // Sort by featured tag first
        result.sort((a, b) => {
          const aFeatured = a.tags?.includes('featured') ? 1 : 0;
          const bFeatured = b.tags?.includes('featured') ? 1 : 0;
          return bFeatured - aFeatured || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    setFilteredProducts(result);
  }, [
    products, 
    loading, 
    selectedCategory, 
    selectedSubcategory, 
    priceRange, 
    selectedSizes, 
    showSaleOnly, 
    sortBy
  ]);

  // Update filters when URL params change
  useEffect(() => {
    if (category) setSelectedCategory(category);
    if (subcategory) setSelectedSubcategory(subcategory);
  }, [category, subcategory]);

  // Get category info
  const getCategoryInfo = (catSlug) => {
    const cat = mainCategories.find(c => c.slug === catSlug);
    return cat || { name: 'All Products', color: 'bg-gray-50' };
  };

  // Get subcategory info
  const getSubcategoryInfo = (subcatSlug) => {
    if (subcatSlug === 'all') return { name: 'All Types' };
    return { name: subcatSlug.charAt(0).toUpperCase() + subcatSlug.slice(1) };
  };

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
  const availableSubcategories = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return ['all', ...allSubcategories];
    }
    
    const subcats = new Set();
    products.forEach(p => {
      if (p.category === selectedCategory && p.subcategory) {
        subcats.add(p.subcategory);
      }
    });
    
    return ['all', ...Array.from(subcats)];
  }, [selectedCategory, products, allSubcategories]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Error loading products</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const currentCategory = getCategoryInfo(selectedCategory);
  const currentSubcategory = getSubcategoryInfo(selectedSubcategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section with Category Tabs */}
      <div className="border-b">
        <div className="container mx-auto w-11/12">
          {/* Category Tabs */}
          <div className="flex space-x-1 pt-6">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-6 py-3 font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'border-b-2 border-black text-black'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              All Products
            </button>
            {mainCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  selectedCategory === cat.slug
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          {/* Page Title */}
          <div className="py-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {currentCategory.name}
              {selectedSubcategory !== 'all' && ` › ${currentSubcategory.name}`}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 flex-shrink-0`}>
            <div className="sticky top-4">
              <div className="bg-white border rounded-lg p-6 mb-6">
                {/* Clear Filters */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Filters</h3>
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Subcategory Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Category</h4>
                  <div className="space-y-2">
                    {availableSubcategories.map((subcat) => (
                      <button
                        key={subcat}
                        onClick={() => handleSubcategoryChange(subcat)}
                        className={`block w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                          selectedSubcategory === subcat
                            ? 'bg-black text-white'
                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }`}
                      >
                        {subcat === 'all' ? 'All Categories' : subcat.charAt(0).toUpperCase() + subcat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6 border-t pt-6">
                  <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Price Range</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-black"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₦0</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                {allSizes.length > 0 && (
                  <div className="mb-6 border-t pt-6">
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {allSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`px-3 py-1 border rounded text-sm transition ${
                            selectedSizes.includes(size)
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sale Only */}
                <div className="border-t pt-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showSaleOnly}
                      onChange={(e) => setShowSaleOnly(e.target.checked)}
                      className="mr-3 h-4 w-4 accent-black"
                    />
                    <span className="text-sm">Sale Items Only</span>
                  </label>
                </div>
              </div>

              {/* Category Cards */}
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-bold mb-4">Shop By Category</h3>
                <div className="space-y-3">
                  {mainCategories.map((cat) => {
                    const count = products.filter(p => p.category === cat.slug).length;
                    return (
                      <Link
                        key={cat.slug}
                        to={`/shop/${cat.slug}`}
                        className={`${cat.color} p-4 rounded-lg block hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{cat.name}</span>
                          <span className="text-sm bg-white px-2 py-1 rounded">{count}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">View all {cat.name.toLowerCase()} products</p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="bg-white border rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded hover:border-black transition"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex border rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListCard key={product._id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white border rounded-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <X className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or browse our categories
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition font-semibold"
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

// Product Card Component (Grid View)
const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tags?.includes('new-arrival') && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded font-bold">
              NEW
            </span>
          )}
          {product.salePrice && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
              SALE
            </span>
          )}
        </div>

        {/* Sale Percentage */}
        {product.salePrice && product.price && (
          <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-bold">
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase">
            {product.subcategory}
          </span>
          {product.category === 'unisex' && (
            <span className="text-xs font-medium text-green-600">UNISEX</span>
          )}
        </div>
        
        <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-gray-700 h-10">
          {product.name}
        </h3>
        
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 0)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300 fill-current'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">({product.reviews || 0})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="font-bold">₦{product.salePrice.toLocaleString('en-NG')}</span>
              <span className="text-sm text-gray-500 line-through">₦{product.price.toLocaleString('en-NG')}</span>
            </>
          ) : (
            <span className="font-bold">₦{product.price?.toLocaleString('en-NG')}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

// Product List Card Component (List View)
const ProductListCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white border rounded-lg p-4 hover:border-black transition-colors flex flex-col sm:flex-row gap-4"
    >
      {/* Product Image */}
      <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.tags?.includes('new-arrival') && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded font-bold">
              NEW
            </span>
          )}
          {product.salePrice && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold">
              SALE
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase">
              {product.subcategory} • {product.category}
            </span>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-700">
              {product.name}
            </h3>
          </div>
          
          {/* Price in list view */}
          <div className="text-right">
            {product.salePrice ? (
              <>
                <div className="font-bold text-lg">₦{product.salePrice.toLocaleString('en-NG')}</div>
                <div className="text-sm text-gray-500 line-through">₦{product.price.toLocaleString('en-NG')}</div>
              </>
            ) : (
              <div className="font-bold text-lg">₦{product.price?.toLocaleString('en-NG')}</div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Details */}
        <div className="flex flex-wrap gap-4 items-center">
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviews || 0})</span>
            </div>
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-sm text-gray-600">
              Sizes: {product.sizes.join(', ')}
            </div>
          )}
          
          {product.tags?.includes('featured') && (
            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              FEATURED
            </span>
          )}
        </div>
        
        {/* View Details Button */}
        <div className="mt-4">
          <span className="text-sm font-medium text-black group-hover:text-gray-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Shop;