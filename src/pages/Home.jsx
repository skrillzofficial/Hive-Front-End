import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const Home = () => {
  const navigate = useNavigate();
  const { products, loading, error } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Filter products by your categories
  const hoodies = products.filter(p => p.subcategory === 'hoodies');
  const polos = products.filter(p => p.subcategory === 'polos');
  const shirts = products.filter(p => p.subcategory === 'shirts');
  const caps = products.filter(p => p.subcategory === 'caps');
  const tanks = products.filter(p => p.subcategory === 'tanks');
  const jumpsuits = products.filter(p => p.subcategory === 'jumpsuits');
  
  // Featured products
  const featuredProducts = products.filter(p => p.tags?.includes('featured'));
  // New arrivals
  const newArrivalProducts = products.filter(p => p.tags?.includes('new-arrival')).slice(0, 4);

  // Carousel slides with text on left, image on right
  const carouselSlides = [
    {
      id: 1,
      title: "NEW ARRIVALS",
      subtitle: "FRESH STYLES",
      description: "Discover our latest collection of premium apparel",
      buttonText: "Shop Now",
      image: newArrivalProducts[0]?.images?.[0] || '',
      bgColor: "bg-black"
    },
    {
      id: 2,
      title: "HOODIES",
      subtitle: "COMFORT & STYLE",
      description: "Premium hoodies for everyday comfort and modern style",
      buttonText: "Explore Hoodies",
      image: hoodies[0]?.images?.[0] || '',
      bgColor: "bg-gray-900"
    },
    {
      id: 3,
      title: "POLO SHIRTS",
      subtitle: "CLASSIC ELEGANCE",
      description: "Timeless polo shirts for smart casual occasions",
      buttonText: "View Polos",
      image: polos[0]?.images?.[0] || '',
      bgColor: "bg-black"
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    if (carouselSlides.length === 0) return;
    
    const interval = setInterval(() => {
      const nextIndex = (currentSlide + 1) % carouselSlides.length;
      setCurrentSlide(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [carouselSlides.length, currentSlide]);

  // Go to specific slide
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="container mx-auto w-11/12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="container mx-auto w-11/12 text-center">
          <p className="text-red-600 mb-4">Error loading products</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="container mx-auto w-11/12 text-center">
          <p className="text-gray-600">No products available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel - Text Left, Image Right */}
      <section className="relative overflow-hidden">
        <div className="relative w-full min-h-[100vh] md:h-[700px]">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              } ${slide.bgColor}`}
            >
              <div className="container mx-auto w-11/12 h-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full items-center gap-8 lg:gap-16">
                  {/* Left Side - Text Content */}
                  <div className="text-white py-12 lg:py-0">
                    <p className="text-sm tracking-widest mb-6 opacity-80">{slide.title}</p>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                      {slide.subtitle}
                    </h1>
                    <p className="text-lg md:text-xl mb-10 opacity-90 max-w-lg">
                      {slide.description}
                    </p>
                    <button 
                      onClick={() => navigate('/shop')}
                      className="bg-white text-black px-10 py-4 font-medium hover:bg-gray-100"
                    >
                      {slide.buttonText}
                    </button>
                  </div>

                  {/* Right Side - Image */}
                  <div className="relative h-full flex items-center justify-center">
                    {slide.image ? (
                      <div className="relative w-full max-w-lg lg:max-w-xl">
                        <img
                          src={slide.image}
                          alt={slide.subtitle}
                          className="w-full h-auto object-contain max-h-[500px] lg:max-h-[600px]"
                        />
                      </div>
                    ) : (
                      <div className="w-full max-w-lg lg:max-w-xl h-[400px] bg-gray-800/50 flex items-center justify-center">
                        <span className="text-white/50">Image Preview</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Dots Only - No Navigation Arrows */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <CategorySection 
        title="NEW ARRIVALS"
        products={newArrivalProducts}
        viewAllPath="/shop?sort=newest"
        loading={loading}
      />

      {/* Hoodies Section */}
      <CategorySection 
        title="HOODIES"
        products={hoodies.slice(0, 4)}
        viewAllPath="/shop/all/hoodies"
        loading={loading}
        bgGray
      />

      {/* Polos Section */}
      <CategorySection 
        title="POLOS"
        products={polos.slice(0, 4)}
        viewAllPath="/shop/all/polos"
        loading={loading}
      />

      {/* Shirts Section */}
      <CategorySection 
        title="SHIRTS"
        products={shirts.slice(0, 4)}
        viewAllPath="/shop/all/shirts"
        loading={loading}
        bgGray
      />

      {/* Caps Section */}
      <CategorySection 
        title="CAPS"
        products={caps.slice(0, 4)}
        viewAllPath="/shop/all/caps"
        loading={loading}
      />

      {/* Featured Products Banner with Image */}
      <FeaturedBanner 
        products={featuredProducts.slice(0, 3)}
        loading={loading}
      />

      {/* Tanks Section */}
      <CategorySection 
        title="TANKS"
        products={tanks.slice(0, 4)}
        viewAllPath="/shop/all/tanks"
        loading={loading}
        bgGray
      />

      {/* Jumpsuits Section */}
      <CategorySection 
        title="JUMPSUITS"
        products={jumpsuits.slice(0, 4)}
        viewAllPath="/shop/all/jumpsuits"
        loading={loading}
      />

      {/* CTA Section with Image */}
      <CTASection />
    </div>
  );
};

// Reusable Category Section Component
const CategorySection = ({ title, products, viewAllPath, loading, bgGray = false }) => {
  const navigate = useNavigate();

  if (!loading && products.length === 0) return null;

  return (
    <section className={`py-16 ${bgGray ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="container mx-auto w-11/12">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold">{title}</h2>
          {!loading && (
            <button 
              onClick={() => navigate(viewAllPath)}
              className="text-sm font-medium hover:text-gray-700"
            >
              View All ›
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 aspect-square mb-4 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Reusable Product Card
const ProductCard = ({ product }) => {
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group"
    >
      <div className="relative mb-4 bg-gray-100 aspect-square overflow-hidden rounded-lg">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Sale Badge */}
        {product.salePrice && product.salePrice > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs font-bold">
            SALE
          </div>
        )}
        
        {/* New Badge */}
        {product.tags?.includes('new-arrival') && (
          <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold">
            NEW
          </div>
        )}
      </div>
      <h3 className="font-medium text-sm mb-1 line-clamp-2 group-hover:text-gray-700">
        {product.name}
      </h3>
      <div className="flex items-center gap-2">
        {product.salePrice && product.salePrice > 0 ? (
          <>
            <span className="font-bold">₦{product.salePrice.toLocaleString('en-NG')}</span>
            <span className="text-sm text-gray-500 line-through">₦{product.price.toLocaleString('en-NG')}</span>
          </>
        ) : (
          <span className="font-bold">₦{product.price.toLocaleString('en-NG')}</span>
        )}
      </div>
    </Link>
  );
};

// Featured Products Banner Component
const FeaturedBanner = ({ products, loading }) => {
  const navigate = useNavigate();

  if (!loading && products.length === 0) return null;

  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto w-11/12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-300">Handpicked selections from our collection</p>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-800 aspect-square mb-4 rounded-lg"></div>
                <div className="h-5 bg-gray-800 rounded mb-3 w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link 
                key={product._id} 
                to={`/product/${product.slug}`}
                className="group"
              >
                <div className="relative mb-4 bg-white aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-lg mb-2 text-center group-hover:text-gray-300">
                  {product.name}
                </h3>
                <p className="font-bold text-center">₦{product.price.toLocaleString('en-NG')}</p>
              </Link>
            ))}
          </div>
        )}

        {!loading && (
          <div className="text-center mt-12">
            <button 
              onClick={() => navigate('/shop')}
              className="bg-white text-black px-10 py-3 font-medium hover:bg-gray-100"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// CTA Section with Image
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto w-11/12">
        <div className="bg-black rounded-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Image */}
            <div className="relative h-[400px] lg:h-auto">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Fashion Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent lg:hidden"></div>
            </div>

            {/* Right Side - Content */}
            <div className="p-12 flex flex-col justify-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Discover Premium Style
              </h2>
              <p className="text-gray-300 mb-8 text-lg">
                Elevate your wardrobe with our curated collection of premium apparel. 
                Each piece is designed for comfort, style, and lasting quality.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigate('/shop')}
                  className="w-full bg-white text-black px-8 py-4 font-medium hover:bg-gray-100 text-center"
                >
                  Shop All Collections
                </button>
                <button 
                  onClick={() => navigate('/shop?sort=newest')}
                  className="w-full bg-transparent border-2 border-white text-white px-8 py-4 font-medium hover:bg-white hover:text-black text-center"
                >
                  View New Arrivals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;