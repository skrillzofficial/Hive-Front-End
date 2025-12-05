import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader, Package, ArrowRight, Mail } from 'lucide-react';

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('verifying'); 
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    // Get transaction reference from URL
    const reference = searchParams.get('reference');
    
    if (!reference) {
      setPaymentStatus('failed');
      setError('No payment reference found');
      return;
    }

    try {
      // Call backend to verify payment
      const response = await fetch(`/api/transactions/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        setOrderData(result.data);
        
        // Clear cart from localStorage
        localStorage.removeItem('cart');
        
        // Dispatch custom event to update cart UI
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        setPaymentStatus('failed');
        setError(result.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
      setError('An error occurred while verifying your payment. Please contact support.');
    }
  };

  // Verifying State
  if (paymentStatus === 'verifying') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we confirm your payment with Paystack...
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Success State
  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto w-11/12 py-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
              Payment Successful
            </h1>
          </div>
        </div>

        <div className="container mx-auto w-11/12 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Success Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Thank You for Your Order!
                </h2>
                <p className="text-gray-600 text-lg">
                  Your payment has been successfully processed
                </p>
              </div>

              {/* Order Details */}
              {orderData && (
                <div className="border-t border-b py-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                        Order Number
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        #{orderData.order?.orderNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                        Transaction Reference
                      </p>
                      <p className="text-lg font-semibold text-gray-900 font-mono">
                        {orderData.transaction?.reference}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                        Amount Paid
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        ₦{orderData.transaction?.amount?.toLocaleString('en-NG', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">
                        Payment Status
                      </p>
                      <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        Paid
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* What's Next */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">
                      Check Your Email
                    </h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      We've sent an order confirmation to your email address. 
                      You'll also receive shipping updates as your order is processed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 mb-8">
                <h3 className="font-bold text-gray-900 text-lg">What Happens Next?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Order Processing</p>
                      <p className="text-sm text-gray-600">
                        We're preparing your items with care
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Quality Check</p>
                      <p className="text-sm text-gray-600">
                        Each piece is carefully inspected before shipping
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Shipping</p>
                      <p className="text-sm text-gray-600">
                        Your order will be dispatched within 1-2 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Delivery</p>
                      <p className="text-sm text-gray-600">
                        Enjoy your new Hive pieces!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(`/orders/track/${orderData?.order?.orderNumber}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-all duration-300"
                >
                  <Package className="w-5 h-5" />
                  Track Order
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-black text-black py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-50 transition-all duration-300"
                >
                  Continue Shopping
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <p className="text-gray-600 mb-2">
                Need help with your order?
              </p>
              <a
                href="mailto:support@hive.com"
                className="text-black font-semibold hover:underline"
              >
                support@hive.com
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Failed State
  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="container mx-auto w-11/12 py-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 uppercase tracking-wide">
              Payment Failed
            </h1>
          </div>
        </div>

        <div className="container mx-auto w-11/12 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Error Card */}
            <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Payment Unsuccessful
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  We couldn't process your payment
                </p>
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </div>

              {/* Common Reasons */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 text-lg mb-4">
                  Common Reasons for Payment Failure:
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Incorrect card details entered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Card declined by your bank</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Network connectivity issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span>Payment session expired</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/cart')}
                  className="flex-1 bg-black text-white py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-800 transition-all duration-300"
                >
                  Return to Cart
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-4 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-50 transition-all duration-300"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <p className="text-gray-600 mb-2">
                If you need assistance or believe this was an error:
              </p>
              <a
                href="mailto:support@hive.com"
                className="text-black font-semibold hover:underline"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentCallback;