import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Tag, Sparkles } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const Men = () => {
  const { products, loading } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [hoodies, setHoodies] = useState([]);
  const [caps, setCaps] = useState([]);
  const [polos, setPolos] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categoryHeroImages, setCategoryHeroImages] = useState({});
  const [poloHeroImage, setPoloHeroImage] = useState('');

  // Process products
  useEffect(() => {
    if (loading || !products.length) return;

    // Filter men's and unisex products (excluding jumpsuits)
    const mensAndUnisexProducts = products.filter(product => 
      (product.category === 'men' || product.category === 'unisex') && 
      product.subcategory !== 'jumpsuits'
    );

    // Set category-specific products
    const hoodiesList = mensAndUnisexProducts.filter(p => p.subcategory === 'hoodies');
    const capsList = mensAndUnisexProducts.filter(p => p.subcategory === 'caps');
    const polosList = mensAndUnisexProducts.filter(p => p.subcategory === 'polos');
    
    setHoodies(hoodiesList.slice(0, 4));
    setCaps(capsList.slice(0, 4));
    setPolos(polosList.slice(0, 4));

    // Find a polo shirt for the hero section
    const poloShirt = polosList.find(polo => {
      // Look for polos with classic colors or premium quality
      const name = polo.name?.toLowerCase() || '';
      const description = polo.description?.toLowerCase() || '';
      const tags = polo.tags?.map(tag => tag.toLowerCase()) || [];
      
      return name.includes('classic') || 
             name.includes('premium') ||
             name.includes('cotton') ||
             tags.includes('featured') ||
             tags.includes('premium');
    });

    if (poloShirt?.images?.[0]) {
      setPoloHeroImage(poloShirt.images[0]);
    } else if (polosList[0]?.images?.[0]) {
      // Fallback to first polo image
      setPoloHeroImage(polosList[0].images[0]);
    }

    // Store first product image for each category
    const heroImages = {};
    if (hoodiesList[0]?.images?.[0]) heroImages.hoodies = hoodiesList[0].images[0];
    if (capsList[0]?.images?.[0]) heroImages.caps = capsList[0].images[0];
    if (polosList[0]?.images?.[0]) heroImages.polos = polosList[0].images[0];
    setCategoryHeroImages(heroImages);

    // Featured products (based on rating or featured tag)
    const featured = mensAndUnisexProducts
      .filter(p => p.rating >= 4 || p.tags?.includes('featured'))
      .slice(0, 4);
    setFeaturedProducts(featured);

    // New arrivals
    const newArrivalsList = mensAndUnisexProducts
      .filter(p => p.tags?.includes('new-arrival'))
      .slice(0, 4);
    setNewArrivals(newArrivalsList);

  }, [products, loading]);

  // Focus categories with database images
  const focusCategories = [
    { 
      slug: 'hoodies', 
      name: 'Hoodies', 
      description: 'Comfortable & stylish hoodies',
      image: categoryHeroImages.hoodies
    },
    { 
      slug: 'caps', 
      name: 'Caps', 
      description: 'Trendy caps & hats',
      image: categoryHeroImages.caps
    },
    { 
      slug: 'polos', 
      name: 'Polos', 
      description: 'Classic polo shirts',
      image: categoryHeroImages.polos
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
      {/* Hero Section - White/Grey background for text side, Image on right */}
      <section className="relative overflow-hidden">
        <div className="w-11/12 mx-auto container grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
          {/* Left Side - White/Grey Background with Text */}
          <div className="bg-gray-50 text-gray-900 py-12 lg:py-0">
            <div className="container mx-auto w-11/12 h-full flex items-center">
              <div className="max-w-lg">
                <p className="text-sm tracking-widest mb-6 text-gray-600">MEN'S ESSENTIALS</p>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                  CLASSIC POLOS
                </h1>
                <p className="text-lg md:text-xl mb-10 text-gray-700">
                  Discover our collection of premium polo shirts. 
                  Timeless style meets modern comfort in every piece.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/shop/all/polos"
                    className="bg-gray-900 text-white px-8 py-3 font-semibold hover:bg-black transition-colors"
                  >
                    Shop Polos
                  </Link>
                  <Link
                    to="/shop/men"
                    className="border-2 border-gray-900 text-gray-900 px-8 py-3 font-semibold hover:bg-gray-900 hover:text-white transition-colors"
                  >
                    View All
                  </Link>
                </div>
                
                {/* Feature Points */}
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Premium Cotton</p>
                      <p className="text-sm text-gray-600">Breathable & durable fabrics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-gray-900 rounded-full mt-2"></div>
                    <div>
                      <p className="font-semibold">Versatile Style</p>
                      <p className="text-sm text-gray-600">Perfect for any occasion</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image (Polo Shirt) */}
          <div className="relative bg-white">
            {poloHeroImage ? (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="relative max-w-lg w-full">
                  <img
                    src={poloHeroImage}
                    alt="Classic Polo Shirt"
                    className="w-full h-auto object-contain max-h-[500px] lg:max-h-[600px]"
                  />
                  {/* Decorative element */}
                  <div className="absolute -top-4 -right-4 w-32 h-32 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 border-4 border-gray-200 rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-64 h-64 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-gray-600 text-lg font-semibold">Polo Shirt</span>
                  </div>
                  <p className="text-gray-500">No polo image available</p>
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
                to="/shop/men?sort=featured" 
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

      {/* Hoodies Section */}
      {hoodies.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Hoodies</h2>
                <p className="text-gray-600">Comfort meets style</p>
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

      {/* Caps Section */}
      {caps.length > 0 && (
        <div className="py-16 bg-white">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Caps</h2>
                <p className="text-gray-600">Complete your look</p>
              </div>
              <Link 
                to="/shop/all/caps" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All Caps
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {caps.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Polos Section */}
      {polos.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto w-11/12">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">Polos</h2>
                <p className="text-gray-600">Classic elegance</p>
              </div>
              <Link 
                to="/shop/all/polos" 
                className="flex items-center text-black font-semibold hover:underline text-sm"
              >
                View All Polos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {polos.map((product) => (
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
                to="/shop/men?filter=new" 
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
      <div className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto w-11/12 text-center">
          <h2 className="text-4xl font-bold mb-4">Complete Your Wardrobe</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Discover premium men's apparel featuring polos, hoodies, and caps designed for modern style and comfort.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/shop/men"
              className="bg-white text-gray-900 px-8 py-3 font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Men's Collection
            </Link>
            <Link
              to="/shop"
              className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-gray-900 transition-colors"
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

export default Men;