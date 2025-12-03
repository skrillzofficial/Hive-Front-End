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
  const [viewMode, setViewMode] = useState('grid');

  const mainCategories = [
    { slug: 'men', name: 'Men', color: 'bg-blue-50' },
    { slug: 'women', name: 'Women', color: 'bg-pink-50' },
    { slug: 'unisex', name: 'Unisex', color: 'bg-green-50' }
  ];

  const allSubcategories = [
    'hoodies', 'polos', 'shirts', 'caps', 'tanks', 'jumpsuits'
  ];

  const allSizes = React.useMemo(() => {
    const sizes = new Set();
    products.forEach(p => {
      if (p.sizes && Array.isArray(p.sizes)) {
        p.sizes.forEach(size => sizes.add(size));
      }
    });
    return Array.from(sizes).sort();
  }, [products]);

  useEffect(() => {
    if (loading) return;
    
    let result = [...products];

    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (selectedSubcategory && selectedSubcategory !== 'all') {
      result = result.filter(p => p.subcategory === selectedSubcategory);
    }

    result = result.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes && p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    if (showSaleOnly) {
      result = result.filter(p => p.salePrice && p.salePrice < p.price);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        result.sort((a, b) => {
          const aIsNew = a.tags?.includes('new-arrival') ? 1 : 0;
          const bIsNew = b.tags?.includes('new-arrival') ? 1 : 0;
          return bIsNew - aIsNew || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        result.sort((a, b) => {
          const aFeatured = a.tags?.includes('featured') ? 1 : 0;
          const bFeatured = b.tags?.includes('featured') ? 1 : 0;
          return bFeatured - aFeatured || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    setFilteredProducts(result);
  }, [products, loading, selectedCategory, selectedSubcategory, priceRange, selectedSizes, showSaleOnly, sortBy]);

  useEffect(() => {
    if (category) setSelectedCategory(category);
    if (subcategory) setSelectedSubcategory(subcategory);
  }, [category, subcategory]);

  const getCategoryInfo = (catSlug) => {
    const cat = mainCategories.find(c => c.slug === catSlug);
    return cat || { name: 'All Products', color: 'bg-gray-50' };
  };

  const getSubcategoryInfo = (subcatSlug) => {
    if (subcatSlug === 'all') return { name: 'All Types' };
    return { name: subcatSlug.charAt(0).toUpperCase() + subcatSlug.slice(1) };
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory('all');
    if (cat === 'all') {
      navigate('/shop');
    } else {
      navigate(`/shop/${cat}`);
    }
  };

  const handleSubcategoryChange = (subcat) => {
    setSelectedSubcategory(subcat);
    if (subcat === 'all') {
      navigate(`/shop/${selectedCategory}`);
    } else {
      navigate(`/shop/${selectedCategory}/${subcat}`);
    }
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceRange([0, 200000]);
    setSelectedSizes([]);
    setShowSaleOnly(false);
    navigate('/shop');
  };

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
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex gap-1 pt-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 sm:px-6 py-3 font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
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
                className={`px-4 sm:px-6 py-3 font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat.slug
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="py-6 sm:py-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
              {currentCategory.name}
              {selectedSubcategory !== 'all' && ` › ${currentSubcategory.name}`}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {showFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowFilters(false)} />
          )}
          
          <aside className={`
            ${showFilters ? 'fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] transform translate-x-0' : 'hidden'}
            lg:block lg:relative lg:w-64 lg:flex-shrink-0
            bg-white lg:bg-transparent overflow-y-auto
          `}>
            <div className="lg:sticky lg:top-4 p-4 lg:p-0">
              <div className="lg:hidden flex justify-between items-center mb-4 pb-4 border-b">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="bg-white border rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base sm:text-lg font-bold">Filters</h3>
                  <button 
                    onClick={clearFilters}
                    className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">Category</h4>
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

                <div className="mb-6 border-t pt-6">
                  <h4 className="font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">Price Range</h4>
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
                    <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                      <span>₦0</span>
                      <span>₦{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {allSizes.length > 0 && (
                  <div className="mb-6 border-t pt-6">
                    <h4 className="font-semibold mb-3 text-xs sm:text-sm uppercase tracking-wider">Size</h4>
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

              <div className="bg-white border rounded-lg p-4 sm:p-6">
                <h3 className="font-bold mb-4 text-sm sm:text-base">Shop By Category</h3>
                <div className="space-y-3">
                  {mainCategories.map((cat) => {
                    const count = products.filter(p => p.category === cat.slug).length;
                    return (
                      <Link
                        key={cat.slug}
                        to={`/shop/${cat.slug}`}
                        className={`${cat.color} p-3 sm:p-4 rounded-lg block hover:opacity-90 transition-opacity`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm sm:text-base">{cat.name}</span>
                          <span className="text-xs sm:text-sm bg-white px-2 py-1 rounded">{count}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">View all {cat.name.toLowerCase()} products</p>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => setShowFilters(false)}
                className="lg:hidden w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-3 sm:px-4 py-2 border rounded hover:border-black transition text-sm"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
                <p className="text-xs sm:text-sm text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                <div className="flex border rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-black text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <label className="text-xs sm:text-sm text-gray-600 hidden sm:inline">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
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

            {filteredProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListCard key={product._id} product={product} />
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white border rounded-lg p-8 sm:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <X className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No products found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Try adjusting your filters or browse our categories
                  </p>
                  <button
                    onClick={clearFilters}
                    className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition font-semibold text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
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

        {product.salePrice && product.price && (
          <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded font-bold">
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs font-medium text-gray-500 uppercase truncate">
            {product.subcategory}
          </span>
          {product.category === 'unisex' && (
            <span className="text-xs font-medium text-green-600 flex-shrink-0 ml-2">UNISEX</span>
          )}
        </div>
        
        <h3 className="font-medium text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-gray-700 h-8 sm:h-10">
          {product.name}
        </h3>
        
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

        <div className="flex items-center gap-2 flex-wrap">
          {product.salePrice ? (
            <>
              <span className="font-bold text-sm sm:text-base">₦{product.salePrice.toLocaleString('en-NG')}</span>
              <span className="text-xs sm:text-sm text-gray-500 line-through">₦{product.price.toLocaleString('en-NG')}</span>
            </>
          ) : (
            <span className="font-bold text-sm sm:text-base">₦{product.price?.toLocaleString('en-NG')}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

const ProductListCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white border rounded-lg p-3 sm:p-4 hover:border-black transition-colors flex flex-col sm:flex-row gap-3 sm:gap-4"
    >
      <div className="relative w-full sm:w-40 md:w-48 h-40 sm:h-auto bg-gray-100 rounded overflow-hidden flex-shrink-0">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
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

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-gray-500 uppercase block truncate">
              {product.subcategory} • {product.category}
            </span>
            <h3 className="text-base sm:text-lg font-semibold mb-2 group-hover:text-gray-700 line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="text-right flex-shrink-0">
            {product.salePrice ? (
              <>
                <div className="font-bold text-base sm:text-lg whitespace-nowrap">₦{product.salePrice.toLocaleString('en-NG')}</div>
                <div className="text-xs sm:text-sm text-gray-500 line-through whitespace-nowrap">₦{product.price.toLocaleString('en-NG')}</div>
              </>
            ) : (
              <div className="font-bold text-base sm:text-lg whitespace-nowrap">₦{product.price?.toLocaleString('en-NG')}</div>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 fill-current'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-gray-500">({product.reviews || 0})</span>
            </div>
          )}
          
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-xs sm:text-sm text-gray-600">
              Sizes: {product.sizes.join(', ')}
            </div>
          )}
          
          {product.tags?.includes('featured') && (
            <span className="text-xs font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              FEATURED
            </span>
          )}
        </div>
        
        <div className="mt-3 sm:mt-4">
          <span className="text-xs sm:text-sm font-medium text-black group-hover:text-gray-700">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default Shop;