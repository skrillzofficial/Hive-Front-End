import React, { useState, useEffect } from 'react';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
      category: "polo",
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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

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
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
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

      {/* Product Grid Section - 4 Columns */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto w-11/12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {/* Hoodies */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80"
                  alt="Hoodies"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Hoodies</h3>
              <p className="text-sm text-gray-600">Premium quality</p>
            </div>

            {/* Shirts */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80"
                  alt="Shirts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Shirts</h3>
              <p className="text-sm text-gray-600">Classic styles</p>
            </div>

            {/* Polos */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&auto=format&fit=crop&q=80"
                  alt="Polos"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Polos</h3>
              <p className="text-sm text-gray-600">Timeless elegance</p>
            </div>

            {/* Caps */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&auto=format&fit=crop&q=80"
                  alt="Caps"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Caps</h3>
              <p className="text-sm text-gray-600">Street style</p>
            </div>

            {/* Pants */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80"
                  alt="Pants"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Pants</h3>
              <p className="text-sm text-gray-600">Perfect fit</p>
            </div>

            {/* Tops */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&auto=format&fit=crop&q=80"
                  alt="Tops"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Tops</h3>
              <p className="text-sm text-gray-600">Everyday comfort</p>
            </div>

            {/* Accessories */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80"
                  alt="Accessories"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Accessories</h3>
              <p className="text-sm text-gray-600">Complete your look</p>
            </div>

            {/* Shorts */}
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden mb-4 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=80"
                  alt="Shorts"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>
              <h3 className="text-base lg:text-lg font-semibold mb-1 uppercase tracking-wide">Shorts</h3>
              <p className="text-sm text-gray-600">Summer essentials</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container mx-auto w-11/12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-gray-900 uppercase tracking-wide">Hot Deals</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pants Collection */}
            <div className="group cursor-pointer bg-white">
              <div className="relative overflow-hidden mb-5 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80"
                  alt="Pants Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase">
                  Sale
                </div>
              </div>
              <div className="px-4 pb-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 uppercase tracking-wide">Pants Collection</h3>
                <p className="text-sm text-gray-600 mb-4">Starting from $45.00</p>
                <button className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Caps Collection */}
            <div className="group cursor-pointer bg-white">
              <div className="relative overflow-hidden mb-5 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80"
                  alt="Caps Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase">
                  Sale
                </div>
              </div>
              <div className="px-4 pb-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 uppercase tracking-wide">Caps Collection</h3>
                <p className="text-sm text-gray-600 mb-4">Starting from $25.00</p>
                <button className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>

            {/* Tops Collection */}
            <div className="group cursor-pointer bg-white">
              <div className="relative overflow-hidden mb-5 bg-gray-100 aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80"
                  alt="Tops Collection"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase">
                  Sale
                </div>
              </div>
              <div className="px-4 pb-5">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 uppercase tracking-wide">Tops Collection</h3>
                <p className="text-sm text-gray-600 mb-4">Starting from $35.00</p>
                <button className="w-full bg-black text-white py-3 text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-all duration-300">
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Banner */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto w-11/12">
          <div className="relative overflow-hidden bg-gray-900 h-[400px] lg:h-[500px]">
            <img
              src="https://images.unsplash.com/photo-1622445275576-721325763afe?w=1600&auto=format&fit=crop&q=80"
              alt="Hoodies & Streetwear Collection"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
            
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