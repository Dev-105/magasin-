import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/cart';
import { ordersAPI } from '../api/orders';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      if (response.data.success) {
        setCart(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.updateQuantity(productId, quantity);
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    setRemovingItem(productId);
    try {
      await cartAPI.removeItem(productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
    setRemovingItem(null);
  };

  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        fetchCart();
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const handleVerifyPromo = async () => {
    setPromoError('');
    setPromoDiscount(null);
    try {
      const response = await ordersAPI.verifyPromoCode(promoCode);
      if (response.data.success) {
        setPromoDiscount(response.data);
      }
    } catch (error) {
      setPromoError(error.response?.data?.message || 'Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await ordersAPI.create(promoDiscount ? promoCode : null);
      if (response.data.success) {
        navigate('/orders');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to place order');
    }
    setCheckoutLoading(false);
  };

  const subtotal = cart.total;
  const discountAmount = promoDiscount ? (subtotal * promoDiscount.discount_percentage / 100) : 0;
  const total = subtotal - discountAmount;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-cart text-gray-900 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-full p-8 mb-6">
          <i className="bi bi-cart-x text-7xl text-gray-400"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-gray-900 text-white px-8 py-3 rounded-2xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-500">
          You have <span className="font-semibold text-gray-800">{cart.items.length}</span> items in your cart
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50/80 px-6 py-4 border-b border-gray-100">
              <div className="col-span-5 text-sm font-semibold text-gray-600 uppercase tracking-wide">Product</div>
              <div className="col-span-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wide">Quantity</div>
              <div className="col-span-2 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">Price</div>
              <div className="col-span-2 text-right text-sm font-semibold text-gray-600 uppercase tracking-wide">Total</div>
            </div>
            
            {/* Cart Items List */}
            <div className="divide-y divide-gray-100">
              {cart.items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-gray-50/50 transition-colors duration-200">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-5 w-full">
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-sm">
                          {item.product.images && item.product.images[0] ? (
                            <img 
                              src={item.product.images[0].image_url || item.product.images[0]} 
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <i className="bi bi-image text-gray-400 text-2xl"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.product.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">SKU: {item.product.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-3 w-full">
                      <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-200 flex items-center justify-center text-gray-600"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value))}
                            className="w-16 text-center py-1 bg-transparent font-medium text-gray-800 focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg hover:bg-white transition-all duration-200 flex items-center justify-center text-gray-600"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unit Price */}
                    <div className="col-span-2 w-full text-right">
                      <span className="text-gray-600 font-medium">
                        {`MAD ${Number(item.product.final_price).toFixed(2)}`}
                      </span>
                    </div>
                    
                    {/* Total & Actions */}
                    <div className="col-span-2 w-full flex items-center justify-between md:justify-end gap-4">
                      <span className="font-bold text-gray-900 text-lg">
                        {`MAD ${(Number(item.product.final_price) * item.quantity).toFixed(2)}`}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        disabled={removingItem === item.product_id}
                        className="text-gray-400 hover:text-red-500 transition-all duration-200 disabled:opacity-50"
                      >
                        {removingItem === item.product_id ? (
                          <i className="bi bi-arrow-repeat animate-spin"></i>
                        ) : (
                          <i className="bi bi-trash3"></i>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Cart Actions */}
            <div className="bg-gray-50/80 px-6 py-4 flex justify-between items-center">
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <i className="bi bi-arrow-left"></i>
                Continue Shopping
              </button>
              <button
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-500 transition-colors duration-200 flex items-center gap-1"
              >
                <i className="bi bi-trash3"></i>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <i className="bi bi-receipt"></i>
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{`MAD ${Number(subtotal).toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                
                {promoDiscount && (
                  <div className="flex justify-between text-green-600 bg-green-50 p-3 rounded-xl">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-gift"></i>
                      Discount ({promoDiscount.discount_percentage}%)
                    </span>
                    <span className="font-semibold">-{`MAD ${Number(discountAmount).toFixed(2)}`}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-2xl">{`MAD ${Number(total).toFixed(2)}`}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <i className="bi bi-ticket-perforated mr-1"></i>
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white/60"
                  />
                  <button
                    onClick={handleVerifyPromo}
                    disabled={!promoCode}
                    className="bg-gray-900 text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <i className="bi bi-exclamation-circle"></i>
                    {promoError}
                  </p>
                )}
                {promoDiscount && (
                  <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                    <i className="bi bi-check-circle"></i>
                    {promoDiscount.discount_percentage}% discount applied!
                  </p>
                )}
              </div>
              
              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {checkoutLoading ? (
                  <>
                    <i className="bi bi-arrow-repeat animate-spin"></i>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lock"></i>
                    Proceed to Checkout
                  </>
                )}
              </button>
              
              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center mb-3">Secure payment methods</p>
                <div className="flex justify-center gap-3 text-gray-500">
                  <i className="bi bi-credit-card text-xl"></i>
                  <i className="bi bi-paypal text-xl"></i>
                  <i className="bi bi-apple text-xl"></i>
                  <i className="bi bi-google-play text-xl"></i>
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