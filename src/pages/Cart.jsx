import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, ArrowLeft, Trash2, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal, getTotalSavings } = useCart();

  const subtotal = getCartSubtotal();
  const FREE_SHIPPING_THRESHOLD = 100000;
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : null; 
  const tax = subtotal * 0.08;
  const total = shipping === 0 ? subtotal + tax : subtotal + tax; 
  const totalSavings = getTotalSavings();

  const hasUndefinedProducts = cartItems.some(item => !item.name || !item.price);

  if (cartItems.length === 0 && !hasUndefinedProducts) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto w-11/12 py-16">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (hasUndefinedProducts) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto w-11/12 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="container mx-auto w-11/12 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.cartItemId} className="bg-white rounded-lg p-4 lg:p-6 shadow-sm">
                <div className="flex gap-4 lg:gap-6">
                  <Link 
                    to={`/product/${item.slug}`}
                    className="flex-shrink-0 w-24 h-24 lg:w-32 lg:h-32 bg-gray-100 rounded-lg overflow-hidden group"
                  >
                    {item.images?.[0] && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 pr-4">
                        <Link 
                          to={`/product/${item.slug}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          {item.selectedSize && (
                            <span>Size: <span className="font-medium text-gray-900">{item.selectedSize}</span></span>
                          )}
                          {item.selectedColor && (
                            <span>Color: <span className="font-medium text-gray-900">{item.selectedColor}</span></span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= item.stockCount}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        {item.salePrice ? (
                          <div>
                            <p className="text-lg font-bold text-red-600">
                              ₦{(item.salePrice * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              ₦{(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-gray-900">
                            ₦{(item.price * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        )}
                      </div>
                    </div>

                    {item.salePrice && (
                      <div className="mt-3 inline-flex items-center gap-1 bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                        <Tag className="w-3 h-3" />
                        Save ₦{((item.price - item.salePrice) * item.quantity).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => navigate('/shop')}
              className="lg:hidden w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 uppercase tracking-wide"
            >
              Continue Shopping
            </button>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₦{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                
                {totalSavings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span className="font-semibold">
                      -₦{totalSavings.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      <span className="text-gray-500">Calculated at checkout</span>
                    )}
                  </span>
                </div>

                {shipping === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-700">
                    🎉 You've qualified for free shipping!
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                    Add ₦{(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more for free shipping
                  </div>
                )}

                <div className="flex justify-between text-gray-600">
                  <span>VAT (8%)</span>
                  <span className="font-semibold text-gray-900">
                    ₦{tax.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {shipping === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? (
                        <>
                          ₦{total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-xs text-green-600 ml-2">(Free Shipping)</span>
                        </>
                      ) : (
                        <>
                          ₦{total.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-xs text-gray-500 ml-2">+ Shipping</span>
                        </>
                      )}
                    </span>
                  </div>
                  {shipping !== 0 && subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-sm text-gray-500 mt-2">
                      Shipping costs will be calculated based on your location during checkout.
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 uppercase tracking-wide mb-4"
              >
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate('/shop')}
                className="hidden lg:block w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 uppercase tracking-wide text-sm"
              >
                Continue Shopping
              </button>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;