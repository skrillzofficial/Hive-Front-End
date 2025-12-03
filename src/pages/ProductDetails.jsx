import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { products, loading: productsLoading } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productsLoading && products.length > 0) {
      if (slug) {
        const foundProduct = products.find(p => p.slug === slug);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedColor(foundProduct.colors?.[0] || '');
          if (foundProduct.sizes?.length === 1) {
            setSelectedSize(foundProduct.sizes[0]);
          }
          setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setProduct(products[0]);
        setSelectedColor(products[0]?.colors?.[0] || '');
        if (products[0]?.sizes?.length === 1) {
          setSelectedSize(products[0].sizes[0]);
        }
        setLoading(false);
      }
    }
  }, [slug, products, productsLoading]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id, selectedSize, selectedColor, 1);
    }
    
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id, selectedSize, selectedColor, 1);
    }
    
    navigate('/cart');
  };

  const handleQuantityChange = (change) => {
    if (!product) return;
    
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const nextImage = () => {
    if (!product || !product.images) return;
    
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!product || !product.images) return;
    
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  if (productsLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition uppercase font-semibold text-sm"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const inCart = isInCart(product.id, selectedSize, selectedColor);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto w-11/12 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 sm:mb-6 transition text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              {product.images?.[currentImageIndex] ? (
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400 text-sm">No image available</span>
                </div>
              )}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </>
              )}
              {product.salePrice && product.salePrice > 0 && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  SALE
                </div>
              )}
              {product.tags?.includes('new-arrival') && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                  NEW
                </div>
              )}
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-base sm:text-lg">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{product.name}</h1>
              
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600">
                  {product.rating || 0} ({product.reviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {product.salePrice && product.salePrice > 0 ? (
                  <>
                    <span className="text-2xl sm:text-3xl font-bold text-red-600">
                      ₦{product.salePrice.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-lg sm:text-2xl text-gray-400 line-through">
                      ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs sm:text-sm font-semibold whitespace-nowrap">
                      Save ₦{(product.price - product.salePrice).toLocaleString('en-NG')}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                    ₦{product.price.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{product.description}</p>

            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">
                  Select Size {!selectedSize && <span className="text-red-500">*</span>}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-lg font-semibold transition text-sm sm:text-base ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors && product.colors.length > 1 && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 sm:px-6 py-2 sm:py-3 border-2 rounded-lg font-medium transition text-sm sm:text-base ${
                        selectedColor === color
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 sm:mb-3">Quantity</label>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-lg"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 sm:px-6 py-2 font-semibold text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3 sm:px-4 py-2 hover:bg-gray-100 transition text-lg"
                    disabled={quantity >= (product.stockCount || 0)}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs sm:text-sm text-gray-500">
                  {product.stockCount || 0} items available
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base ${
                    addedToCart
                      ? 'bg-green-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="truncate">{addedToCart ? 'Added!' : inCart ? 'Add More' : 'Add to Cart'}</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-3 sm:p-4 border-2 rounded-lg transition flex-shrink-0 ${
                    isFavorite ? 'bg-red-50 border-red-500 text-red-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-white border-2 border-black text-black font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition hover:bg-gray-50 disabled:bg-gray-100 disabled:border-gray-300 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Buy Now
              </button>
            </div>

            {product.features && product.features.length > 0 && (
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                      <span className="text-black mt-1 flex-shrink-0">•</span>
                      <span className="break-words">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t pt-4 sm:pt-6 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Free Shipping</p>
                  <p className="text-xs sm:text-sm text-gray-600">On orders over ₦100,000</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Easy Returns</p>
                  <p className="text-xs sm:text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-black mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">Secure Payment</p>
                  <p className="text-xs sm:text-sm text-gray-600">100% secure transactions</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 sm:pt-6 space-y-2">
              <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Product Details</h3>
              <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                {product.material && (
                  <p className="break-words"><span className="font-medium">Material:</span> {product.material}</p>
                )}
                {product.care && (
                  <p className="break-words"><span className="font-medium">Care:</span> {product.care}</p>
                )}
                {product.madeIn && (
                  <p className="break-words"><span className="font-medium">Made in:</span> {product.madeIn}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;