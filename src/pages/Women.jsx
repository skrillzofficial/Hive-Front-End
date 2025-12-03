import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Tag, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Women = () => {
  const { products, loading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [jumpsuits, setJumpsuits] = useState([]);
  const [hoodies, setHoodies] = useState([]);
  const [tanks, setTanks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categoryHeroImages, setCategoryHeroImages] = useState({});
  const [blueJumpsuitImage, setBlueJumpsuitImage] = useState('');

  // Process products
  useEffect(() => {
    if (loading || !products.length) return;

    // Filter women's and unisex products
    const womensAndUnisexProducts = products.filter(product => 
      product.category === 'women' || product.category === 'unisex'
    );

    // Set category-specific products (focus categories only)
    const jumpsuitsList = womensAndUnisexProducts.filter(p => p.subcategory === 'jumpsuits');
    const hoodiesList = womensAndUnisexProducts.filter(p => p.subcategory === 'hoodies');
    const tanksList = womensAndUnisexProducts.filter(p => p.subcategory === 'tanks');
    
    setJumpsuits(jumpsuitsList.slice(0, 4));
    setHoodies(hoodiesList.slice(0, 4));
    setTanks(tanksList.slice(0, 4));

    // Find a blue jumpsuit for the hero section
    const blueJumpsuit = jumpsuitsList.find(jumpsuit => {
      // Look for jumpsuits with "blue" in name or description
      const name = jumpsuit.name?.toLowerCase() || '';
      const description = jumpsuit.description?.toLowerCase() || '';
      const colorTags = jumpsuit.tags?.map(tag => tag.toLowerCase()) || [];
      
      return name.includes('blue') || 
             description.includes('blue') || 
             colorTags.includes('blue') ||
             colorTags.includes('navy') ||
             colorTags.includes('denim');
    });

    if (blueJumpsuit?.images?.[0]) {
      setBlueJumpsuitImage(blueJumpsuit.images[0]);
    } else if (jumpsuitsList[0]?.images?.[0]) {
      // Fallback to first jumpsuit image
      setBlueJumpsuitImage(jumpsuitsList[0].images[0]);
    }

    // Store first product image for each category
    const heroImages = {};
    if (jumpsuitsList[0]?.images?.[0]) heroImages.jumpsuits = jumpsuitsList[0].images[0];
    if (hoodiesList[0]?.images?.[0]) heroImages.hoodies = hoodiesList[0].images[0];
    if (tanksList[0]?.images?.[0]) heroImages.tanks = tanksList[0].images[0];
    setCategoryHeroImages(heroImages);

    // Featured products (based on rating or featured tag)
    const featured = womensAndUnisexProducts
      .filter(p => p.rating >= 4 || p.tags?.includes('featured'))
      .slice(0, 4);
    setFeaturedProducts(featured);

    // New arrivals
    const newArrivalsList = womensAndUnisexProducts
      .filter(p => p.tags?.includes('new-arrival'))
      .slice(0, 4);
    setNewArrivals(newArrivalsList);

  }, [products, loading]);

  // Focus categories - ONLY Jumpsuits, Hoodies, Tanks
  const focusCategories = [
    { 
      slug: 'jumpsuits', 
      name: 'Jumpsuits', 
      description: 'One-piece outfits',
      image: categoryHeroImages.jumpsuits,
      highlight: true
    },
    { 
      slug: 'hoodies', 
      name: 'Hoodies', 
      description: 'Comfort & style',
      image: categoryHeroImages.hoodies
    },
    { 
      slug: 'tanks', 
      name: 'Tanks', 
      description: 'Sleeveless tops',
      image: categoryHeroImages.tanks
    }
  ];

  // Features
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Premium Quality",
      description: "Crafted from finest materials"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Free Shipping",
      description: "On orders over ₦100,000"
    },
    {
      icon: <Tag className="w-6 h-6" />,
      title: "Best Value",
      description: "Quality at competitive prices"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Blue background for text side, Image on right */}
      <section className="relative overflow-hidden">
        <div className="w-11/12 mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          {/* Left Side - Blue Background with Text */}
          <div className="bg-blue-400 text-white py-12 lg:py-0">
            <div className="container mx-auto w-11/12 h-full flex items-center">
              <div className="max-w-lg">
                <p className="text-sm tracking-widest mb-6 opacity-90">WOMEN'S SPECIALTY</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                 JUMPSUITS
                </h1>
                <p className="text-lg md:text-xl mb-10 opacity-90">
                  Discover our collection of stylish jumpsuits. 
                  Perfect for any occasion, these one-piece outfits combine elegance with practicality.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/shop/all/jumpsuits"
                    className="bg-white text-blue-400 px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Shop Jumpsuits
                  </Link>
                  <Link
                    to="/shop/women"
                    className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    View All
                  </Link>
                </div>
                
                {/* Feature Points */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Premium Quality</p>
                      <p className="text-sm opacity-90">Fine fabrics & craftsmanship</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Comfort Fit</p>
                      <p className="text-sm opacity-90">Designed for all-day wear</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image (Blue Jumpsuit) */}
          <div className="relative bg-gray-100">
            {blueJumpsuitImage ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative max-w-lg w-full">
                  <img
                    src={blueJumpsuitImage}
                    alt="Blue Jumpsuit"
                    className="w-full h-auto object-contain max-h-[500px] lg:max-h-[600px]"
                  />
                  {/* Decorative element */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 border-4 border-blue-200/30 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 border-4 border-blue-200/30 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 bg-blue-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-blue-600 text-lg font-semibold">Blue Jumpsuit</span>
                  </div>
                  <p className="text-gray-500">No jumpsuit image available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="container mx-auto w-11/12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <h2 className="text-3xl font-bold">Featured Products</h2>
              </div>
              <Link 
                to="/shop/women?sort=featured" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Jumpsuits Section (Women's Specialty) */}
      {jumpsuits.length > 0 && (
        <div className="py-16 bg-blue-50">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Jumpsuits</h2>
                <p className="text-gray-600">One-piece elegance for any occasion</p>
              </div>
              <Link 
                to="/shop/all/jumpsuits" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All Jumpsuits
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {jumpsuits.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hoodies Section */}
      {hoodies.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Hoodies</h2>
                <p className="text-gray-600">Comfort meets everyday style</p>
              </div>
              <Link 
                to="/shop/all/hoodies" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All Hoodies
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hoodies.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tanks Section */}
      {tanks.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Tanks</h2>
                <p className="text-gray-600">Sleeveless style for warmer days</p>
              </div>
              <Link 
                to="/shop/all/tanks" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All Tanks
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tanks.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Arrivals Section */}
      {newArrivals.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
                <p className="text-gray-600">Fresh styles just added</p>
              </div>
              <Link 
                to="/shop/women?filter=new" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All New
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} isNew={true} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Cards Section - Grid of 3 side by side */}
      <div className="py-16 bg-white">
        <div className="container mx-auto w-11/12">
          <h2 className="text-3xl font-bold text-center mb-12">Shop By Category</h2>
          
          {/* Grid of 3 - All equal size side by side */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {focusCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/shop/all/${category.slug}`}
                className="group bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col"
              >
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">{category.name}</span>
                    </div>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                  <div className="flex items-center text-black font-semibold group-hover:text-gray-700 transition-colors">
                    Shop Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-400 text-white">
        <div className="container mx-auto w-11/12 text-center">
          <h2 className="text-4xl font-bold mb-4">Express Your Style</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover premium women's apparel featuring jumpsuits, hoodies, and tanks designed for comfort and elegance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop/women"
              className="bg-white text-blue-400 px-8 py-3 font-semibold hover:bg-blue-50 transition-colors"
            >
              Shop Women's Collection
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product, isNew = false }) => {
  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group bg-white"
    >
      <div className="relative mb-3 bg-gray-100 aspect-square overflow-hidden">
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
        {(isNew || product.tags?.includes('new-arrival')) && (
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
      <div className="flex items-center justify-between mt-1">
        {product.rating > 0 && (
          <div className="flex items-center gap-1">
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
        <span className="text-xs font-medium text-gray-500 uppercase">
          {product.category === 'unisex' ? 'UNISEX' : product.subcategory}
        </span>
      </div>
    </Link>
  );
};

export default Women;