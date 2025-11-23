import React, { useState, useEffect } from 'react';
import { products, categories, subcategories, getFeaturedProducts, getSaleProducts } from '../data/ProductData';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get featured products for carousel
  const featuredProducts = getFeaturedProducts();
  const saleProducts = getSaleProducts();

  const carouselSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1600&auto=format&fit=crop&q=80",
      title: "HOODIES COLLECTION",
      subtitle: "Comfort meets style",
      category: "hoodies",
      buttonText: "SHOP HOODIES",
      position: "object-cover object-center"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1600&auto=format&fit=crop&q=80",
      title: "POLO ESSENTIALS",
      subtitle: "Classic elegance for every occasion",
      category: "polos",
      buttonText: "SHOP POLOS",
      position: "object-cover object-center"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&auto=format&fit=crop&q=80",
      title: "SHIRTS & TOPS",
      subtitle: "Versatile styles for any day",
      category: "shirts",
      buttonText: "EXPLORE SHIRTS",
      position: "object-cover object-center"
    }
  ];

  // Auto-rotate carousel every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Manual slide navigation
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Get unique subcategories for product grid
  const displaySubcategories = subcategories.slice(0, 8);

  // Get first 3 sale products for hot deals
  const hotDeals = saleProducts.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel Section */}
      <section className="relative h-[500px] lg:h-[650px] overflow-hidden bg-gray-100">
        {/* Carousel Slides */}
        <div className="relative w-full h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Slide Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={`w-full h-full ${slide.position}`}
                />
                {/* Light overlay for text contrast */}
                <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent"></div>
              </div>

              {/* Slide Content - Left Aligned */}
              <div className="container mx-auto w-11/12 relative h-full flex flex-col justify-center items-start">
                <div className="max-w-xl">
                  <p className="text-white text-sm lg:text-base font-light mb-3 tracking-widest uppercase">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-white text-5xl lg:text-7xl font-bold tracking-tight mb-10 leading-tight">
                    {slide.title}
                  </h1>
                  
                  <button className="bg-white text-black px-10 py-4 font-semibold text-sm tracking-wider hover:bg-gray-100 transition-all duration-300 uppercase">
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-10 h-1' 
                  : 'bg-white/50 w-8 h-1 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Product Categories Grid Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto w-11/12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {subcategories.map((subcat) => {
              // Get first product from this subcategory for image
              const product = products.find(p => p.subcategory === subcat.slug);
              
              return (
                <div key={subcat.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-3/4">
                    {product && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={subcat.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">{subcat.name}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                  <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">
                    {subcat.name}
                  </h3>
                  <p className="text-sm text-gray-600">{subcat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto w-11/12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-gray-900 uppercase tracking-wide">Hot Deals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {hotDeals.map((product) => (
              <div key={product.id} className="group cursor-pointer bg-white">
                <div className="relative overflow-hidden mb-5 bg-gray-100 aspect-3/4">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase">
                    Sale
                  </div>
                  {product.salePrice && (
                    <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-xs font-bold">
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="px-4 pb-5">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 uppercase tracking-wide">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-4">
                    {product.salePrice ? (
                      <>
                        <p className="text-lg font-bold text-red-600">
                          ${product.salePrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-gray-900">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container mx-auto w-11/12">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
              Featured Products
            </h2>
            <button className="text-sm font-semibold uppercase tracking-wider hover:underline">
              View All
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-square">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.tags.includes('new-arrival') && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold uppercase">
                      New
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-semibold mb-1 text-gray-900 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  {product.salePrice ? (
                    <>
                      <p className="text-base font-bold text-gray-900">
                        ${product.salePrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-base font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 fill-current'
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto w-11/12">
          <div className="relative overflow-hidden bg-gray-900 h-[400px] lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1622445275576-721325763afe?w=1600&auto=format&fit=crop&q=80"
              alt="Hoodies & Streetwear Collection"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/70 to-transparent"></div>
            
            <div className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16">
              <div className="max-w-xl">
                <p className="text-white text-sm lg:text-base font-light mb-3 tracking-widest uppercase">
                  New Arrival
                </p>
                <h2 className="text-3xl lg:text-5xl font-bold text-white mb-5 uppercase tracking-wide">
                  Hoodies & Streetwear
                </h2>
                <p className="text-white/90 text-base lg:text-lg mb-8">
                  Premium quality hoodies and casual wear for your everyday style
                </p>
                <button className="bg-white text-black px-10 py-4 text-sm font-semibold uppercase tracking-wider hover:bg-gray-100 transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;