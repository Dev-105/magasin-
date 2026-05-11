import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/cart';
import { ordersAPI } from '../api/orders';
import PayPalButton from '../components/PayPalButton';

const Cart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);
  const [showPayPalModal, setShowPayPalModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
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

  const subtotal = cart.total;
  const discountAmount = promoDiscount ? (subtotal * promoDiscount.discount_percentage / 100) : 0;
  const total = subtotal - discountAmount;

  const handlePrintReceipt = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-2xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading your royal cart...</p>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="bg-black/60 backdrop-blur-md rounded-full p-8 mb-6 border border-[#D4AF37]/30">
          <i className="bi bi-cart-x text-7xl text-[#D4AF37]/50"></i>
        </div>
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Looks like you haven't added any royal items yet</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-8 py-3 rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#D4AF37]/50 transform hover:scale-105 transition-all duration-300 shadow-lg min-h-[48px]"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Shopping Cart</span>
        </h1>
        <p className="text-gray-400">
          You have <span className="font-semibold text-[#D4AF37]">{cart.items.length}</span> royal items in your cart
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 bg-[#D4AF37]/5 px-6 py-4 border-b border-[#D4AF37]/20">
              <div className="col-span-5 text-sm font-bold text-[#D4AF37] uppercase tracking-wide">Product</div>
              <div className="col-span-3 text-center text-sm font-bold text-[#D4AF37] uppercase tracking-wide">Quantity</div>
              <div className="col-span-2 text-right text-sm font-bold text-[#D4AF37] uppercase tracking-wide">Price</div>
              <div className="col-span-2 text-right text-sm font-bold text-[#D4AF37] uppercase tracking-wide">Total</div>
            </div>
            
            {/* Cart Items List */}
            <div className="divide-y divide-[#D4AF37]/10">
              {cart.items.map((item) => (
                <div key={item.id} className="p-6 hover:bg-white/5 transition-all duration-300">
                  <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-5 w-full">
                      <div className="flex items-center gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800 to-black flex-shrink-0 shadow-lg border border-[#D4AF37]/20">
                          {item.product.images && item.product.images[0] ? (
                            <img 
                              src={item.product.images[0].image_url || item.product.images[0]} 
                              alt={item.product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <i className="bi bi-gem text-[#D4AF37]/30 text-2xl"></i>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-white truncate">{item.product.title}</h3>
                          <p className="text-sm text-[#D4AF37]/60 mt-1">SKU: {item.product.id}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity */}
                    <div className="col-span-3 w-full">
                      <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-2 bg-black/60 rounded-xl p-1 border border-[#D4AF37]/30">
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-200 flex items-center justify-center text-[#D4AF37]"
                          >
                            <i className="bi bi-dash"></i>
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value))}
                            className="w-16 text-center py-1 bg-transparent font-medium text-white focus:outline-none"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg hover:bg-[#D4AF37]/10 transition-all duration-200 flex items-center justify-center text-[#D4AF37]"
                          >
                            <i className="bi bi-plus"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Unit Price */}
                    <div className="col-span-2 w-full">
                      <span className="text-[#D4AF37] font-medium text-[12px]">
                        {`MAD ${Number(item.product.final_price).toFixed(2)}`}
                      </span>
                    </div>
                    
                    {/* Total & Actions */}
                    <div className="col-span-2 w-full flex items-center justify-between md:justify-end gap-4">
                      <span className="font-bold text-[#D4AF37] text-lg">
                        {`MAD ${(Number(item.product.final_price) * item.quantity).toFixed(2)}`}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        disabled={removingItem === item.product_id}
                        className="text-gray-500 hover:text-red-500 transition-all duration-200 disabled:opacity-50 min-h-[44px] min-w-[44px]"
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
            <div className="bg-black/80 px-6 py-4 flex justify-between items-center border-t border-[#D4AF37]/20">
              <button
                onClick={() => navigate('/products')}
                className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors duration-300 min-h-[44px]"
              >
                <i className="bi bi-arrow-left"></i>
                Continue Shopping
              </button>
              <button
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-500 transition-colors duration-300 flex items-center gap-1 min-h-[44px]"
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
            <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-[#D4AF37]/20">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <i className="bi bi-receipt text-[#D4AF37]"></i>
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Order Summary</span>
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-medium">{`MAD ${Number(subtotal).toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-[#D4AF37]">Free</span>
                </div>
                
                {promoDiscount && (
                  <div className="flex justify-between text-[#D4AF37] bg-[#D4AF37]/10 p-3 rounded-xl border border-[#D4AF37]/30">
                    <span className="flex items-center gap-1">
                      <i className="bi bi-gift"></i>
                      Discount ({promoDiscount.discount_percentage}%)
                    </span>
                    <span className="font-semibold">-{`MAD ${Number(discountAmount).toFixed(2)}`}</span>
                  </div>
                )}
                
                <div className="border-t border-[#D4AF37]/20 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-2xl text-[#D4AF37]">{`MAD ${Number(total).toFixed(2)}`}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Including all taxes</p>
                </div>
              </div>
              
              {/* Promo Code */}
              <div className="mb-6">
                <label className="text-sm font-medium text-[#D4AF37] mb-2 block">
                  <i className="bi bi-ticket-perforated mr-1"></i>
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 bg-black/60 border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent text-white placeholder-gray-500"
                  />
                  <button
                    onClick={handleVerifyPromo}
                    disabled={!promoCode}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold min-h-[48px]"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <i className="bi bi-exclamation-circle"></i>
                    {promoError}
                  </p>
                )}
                {promoDiscount && (
                  <p className="text-[#D4AF37] text-sm mt-2 flex items-center gap-1">
                    <i className="bi bi-check-circle"></i>
                    {promoDiscount.discount_percentage}% discount applied!
                  </p>
                )}
              </div>
              
              {/* Checkout Button */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowPayPalModal(true)}
                  disabled={checkoutLoading}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-[#D4AF37]/50 transform hover:scale-[1.02] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px]"
                >
                  {checkoutLoading ? (
                    <>
                      <i className="bi bi-arrow-repeat animate-spin"></i>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-crown-fill"></i>
                      Proceed to Royal Checkout
                    </>
                  )}
                </button>
              </div>
              
              {/* Payment Methods */}
              <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
                <p className="text-xs text-gray-500 text-center mb-3">Secure payment methods</p>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full flex flex-col items-center">
                    <p className="text-sm text-gray-400 mb-2">Pay quickly with PayPal</p>
                    <div className="w-full flex justify-center">
                      <PayPalButton amount={Number(total).toFixed(2)} promoCode={promoCode || null} />
                    </div>
                  </div>

                  <div className="text-gray-500 text-sm text-center">Or use the classic checkout button below to place the order without online payment.</div>
                </div>
              </div>
            </div>
            
            {/* Receipt Modal */}
            {showReceiptModal && orderDetails && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <div className="bg-gradient-to-br from-black to-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#D4AF37] animate-fade-in-up">
                  {/* Receipt Header */}
                  <div className="text-center p-6 border-b border-[#D4AF37]/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                      <i className="bi bi-crown-fill text-black text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">
                      Royal Receipt
                    </h2>
                    <p className="text-gray-400 text-sm">Thank you for your royal purchase!</p>
                    <div className="mt-4 pt-4 border-t border-[#D4AF37]/20">
                      <p className="text-xs text-gray-500">Order ID: <span className="text-[#D4AF37] font-mono">#{orderDetails.order_id || 'ROR-' + Date.now()}</span></p>
                      <p className="text-xs text-gray-500 mt-1">Date: {new Date().toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mt-1">Payment Method: PayPal</p>
                    </div>
                  </div>
                  
                  {/* Receipt Items */}
                  <div className="p-6">
                    <h3 className="font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                      <i className="bi bi-box-seam"></i>
                      Order Items
                    </h3>
                    <div className="space-y-3 mb-6">
                      {cart.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-[#D4AF37]/10">
                          <div className="flex-1">
                            <p className="text-white font-medium">{item.product.title}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} × MAD {Number(item.product.final_price).toFixed(2)}</p>
                          </div>
                          <p className="text-[#D4AF37] font-bold">MAD {(Number(item.product.final_price) * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Totals */}
                    <div className="bg-black/60 rounded-xl p-4 mb-6 border border-[#D4AF37]/20">
                      <div className="space-y-2">
                        <div className="flex justify-between text-gray-300 text-sm">
                          <span>Subtotal:</span>
                          <span>MAD {Number(subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-300 text-sm">
                          <span>Shipping:</span>
                          <span className="text-[#D4AF37]">Free</span>
                        </div>
                        {promoDiscount && (
                          <div className="flex justify-between text-[#D4AF37] text-sm">
                            <span>Discount ({promoDiscount.discount_percentage}%):</span>
                            <span>-MAD {Number(discountAmount).toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#D4AF37]/20">
                          <span className="text-white">Total Paid:</span>
                          <span className="text-[#D4AF37] text-2xl">MAD {Number(total).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Royal Message */}
                    <div className="text-center p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 rounded-xl border border-[#D4AF37]/30 mb-6">
                      <i className="bi bi-gem text-[#D4AF37] text-2xl block mb-2"></i>
                      <p className="text-sm text-gray-300">Your order has been confirmed and is being prepared for shipping.</p>
                      <p className="text-xs text-[#D4AF37] mt-2">A confirmation email has been sent to your registered email address.</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handlePrintReceipt}
                        className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <i className="bi bi-printer"></i>
                        Print Receipt
                      </button>
                      <button
                        onClick={() => {
                          setShowReceiptModal(false);
                          navigate('/orders');
                        }}
                        className="flex-1 bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] py-3 rounded-xl font-bold hover:bg-white/5 transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <i className="bi bi-eye"></i>
                        View My Orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* PayPal Modal */}
            {showPayPalModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                <div className="bg-gradient-to-br from-black to-[#0a0a0a] rounded-2xl shadow-2xl p-6 w-full max-w-lg border-2 border-[#D4AF37]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">Complete Your Royal Payment</h3>
                    <button 
                      onClick={() => setShowPayPalModal(false)} 
                      className="text-gray-400 hover:text-[#D4AF37] transition-colors min-h-[44px] min-w-[44px]"
                    >
                      <i className="bi bi-x-lg text-xl"></i>
                    </button>
                  </div>
                  <div className="mb-4 pb-4 border-b border-[#D4AF37]/20">
                    <div className="flex justify-between text-gray-300 mb-2">
                      <span>Total Amount:</span>
                      <span className="font-bold text-[#D4AF37] text-2xl">{`MAD ${Number(total).toFixed(2)}`}</span>
                    </div>
                    {promoDiscount && (
                      <div className="text-sm text-[#D4AF37]">
                        <i className="bi bi-gift-fill"></i> {promoDiscount.discount_percentage}% discount applied
                      </div>
                    )}
                  </div>
                  <div>
                    <PayPalButton
                      amount={Number(total).toFixed(2)}
                      promoCode={promoCode || null}
                      onSuccess={async (captureData) => {
                        try {
                          console.log('Payment successful:', captureData);
                          
                          const orderResponse = await ordersAPI.create(promoDiscount ? promoCode : null);
                          
                          if (orderResponse.data.success) {
                            await cartAPI.clearCart();
                            setShowPayPalModal(false);
                            
                            // Set order details for receipt
                            setOrderDetails({
                              order_id: orderResponse.data.data?.id,
                              total: total,
                              items: cart.items,
                              subtotal: subtotal,
                              discountAmount: discountAmount,
                              promoDiscount: promoDiscount
                            });
                            
                            // Show receipt modal
                            setShowReceiptModal(true);
                          } else {
                            throw new Error(orderResponse.data.message || 'Failed to create order');
                          }
                        } catch (err) {
                          console.error('Error creating order after payment:', err);
                          const errorMsg = err.response?.data?.message || err.message || 'Payment succeeded but order creation failed. Please contact support.';
                          alert(errorMsg);
                          navigate('/orders');
                        }
                      }}
                      onError={(errMsg) => {
                        console.error('PayPal error:', errMsg);
                        const message = typeof errMsg === 'string' ? errMsg : 'Payment failed. Please try again.';
                        alert(message);
                        setShowPayPalModal(false);
                      }}
                    />
                  </div>
                  <div className="mt-4 pt-4 text-center text-xs text-gray-500">
                    <i className="bi bi-shield-check text-[#D4AF37]"></i> Secure payment powered by PayPal
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;