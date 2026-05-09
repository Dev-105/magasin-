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
    try {
      await cartAPI.removeItem(productId);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
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
        alert('Order placed successfully!');
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
    return <div className="text-center py-12">Loading cart...</div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="bi bi-cart-x text-6xl text-gray-400"></i>
        <h2 className="text-2xl font-bold mt-4">Your cart is empty</h2>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Product</th>
                  <th className="px-4 py-3 text-center">Quantity</th>
                  <th className="px-4 py-3 text-right">Price</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.product.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0].image_url || item.product.images[0]} 
                            alt={item.product.title}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded"></div>
                        )}
                        <span className="font-medium">{item.product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.product_id, parseInt(e.target.value))}
                        className="w-20 px-2 py-1 border rounded text-center"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      ${Number(item.product.final_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ${(Number(item.product.final_price) * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveItem(item.product_id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 text-right">
              <button
                onClick={handleClearCart}
                className="text-red-500 hover:text-red-700"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${Number(subtotal).toFixed(2)}</span>
              </div>
              
              {promoDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({promoDiscount.discount_percentage}%)</span>
                  <span>-${Number(discountAmount).toFixed(2)}</span>
                </div>
              )}
              
              <div className="border-t pt-3 font-bold text-lg">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${Number(total).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Promo Code */}
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleVerifyPromo}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Apply
                </button>
              </div>
              {promoError && <p className="text-red-500 text-sm mt-1">{promoError}</p>}
              {promoDiscount && <p className="text-green-600 text-sm mt-1">Promo code applied!</p>}
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;