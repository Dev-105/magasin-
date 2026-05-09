import { useState, useEffect } from 'react';
import { ordersAPI } from '../api/orders';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleCancelOrder = async (orderId) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      try {
        await ordersAPI.cancel(orderId);
        fetchOrders();
      } catch (error) {
        alert('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'bi-clock-history' },
      processing: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bi-arrow-repeat' },
      completed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bi-check-circle' },
      cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'bi-x-circle' },
    };
    return colors[status] || { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: 'bi-question-circle' };
  };

  const getStatusSteps = (status) => {
    const steps = ['pending', 'processing', 'completed'];
    const currentIndex = steps.indexOf(status);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const statusFilters = [
    { value: 'all', label: 'All Orders', icon: 'bi-grid-3x3-gap-fill' },
    { value: 'pending', label: 'Pending', icon: 'bi-clock-history' },
    { value: 'processing', label: 'Processing', icon: 'bi-arrow-repeat' },
    { value: 'completed', label: 'Completed', icon: 'bi-check-circle' },
    { value: 'cancelled', label: 'Cancelled', icon: 'bi-x-circle' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-bag-fill text-gray-900 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-inbox text-5xl text-gray-400"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
          <a 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg"
          >
            <i className="bi bi-shop"></i>
            <span>Start Shopping</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          My Orders
        </h1>
        <p className="text-gray-500">Track and manage your purchases</p>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {statusFilters.map((filterOption) => {
          const isActive = filter === filterOption.value;
          const count = filterOption.value === 'all' 
            ? orders.length 
            : orders.filter(o => o.status === filterOption.value).length;
          
          return (
            <button
              key={filterOption.value}
              onClick={() => setFilter(filterOption.value)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              <i className={filterOption.icon}></i>
              <span>{filterOption.label}</span>
              {count > 0 && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}
                `}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order, index) => {
          const statusStyle = getStatusColor(order.status);
          const statusSteps = getStatusSteps(order.status);
          
          return (
            <div 
              key={order.id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center shadow-md">
                      <i className="bi bi-receipt text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <i className="bi bi-calendar3 text-gray-400 text-sm"></i>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-xl ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} flex items-center gap-2`}>
                      <i className={`${statusStyle.icon} text-sm`}></i>
                      <span className="text-sm font-semibold capitalize">{order.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Progress Steps */}
                {order.status !== 'cancelled' && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, idx) => (
                        <div key={step.name} className="flex-1 relative">
                          <div className="flex flex-col items-center">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                              transition-all duration-300
                              ${step.completed 
                                ? 'bg-emerald-500 text-white shadow-md' 
                                : 'bg-gray-200 text-gray-500'
                              }
                              ${step.active ? 'ring-4 ring-emerald-200' : ''}
                            `}>
                              {step.completed ? (
                                <i className="bi bi-check-lg text-sm"></i>
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <p className={`
                              text-xs font-medium mt-2 capitalize
                              ${step.completed ? 'text-gray-900' : 'text-gray-400'}
                            `}>
                              {step.name}
                            </p>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className={`
                              absolute top-4 left-1/2 w-full h-0.5
                              transition-all duration-300
                              ${step.completed ? 'bg-emerald-500' : 'bg-gray-200'}
                            `}></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-3">
                  {order.lignes?.slice(0, 3).map((item, itemIdx) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-4">
                        {item.product?.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0].image_url || item.product.images[0]} 
                            alt={item.product.title}
                            className="w-14 h-14 object-cover rounded-xl shadow-sm"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                            <i className="bi bi-image text-gray-400 text-xl"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.product?.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">×</p>
                            <p className="text-sm font-medium text-gray-900">${Number(item.unit_price).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {order.lignes?.length > 3 && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2 transition-colors"
                    >
                      + {order.lignes.length - 3} more items • View full order details
                    </button>
                  )}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      <i className="bi bi-truck mr-1"></i> 
                      Free Shipping
                    </div>
                    {order.promo_code && (
                      <div className="text-sm text-emerald-600">
                        <i className="bi bi-ticket-perforated mr-1"></i>
                        Promo: {order.promo_code?.code ?? order.promo_code}
                      </div>
                    )}
                  </div>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 text-sm font-medium"
                    >
                      <i className="bi bi-x-circle"></i>
                      <span>Cancel Order</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center rounded-t-3xl">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                <p className="text-sm text-gray-500">Order #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="bi bi-x-lg text-gray-600"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* All Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.lignes?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        {item.product?.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0].image_url || item.product.images[0]} 
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{item.product?.title}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">${(Number(item.unit_price) * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${Number(selectedOrder.total).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-emerald-600">Free</span>
                  </div>
                  {selectedOrder.promo_code && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Promo Code</span>
                      <span className="text-emerald-600">{selectedOrder.promo_code?.code ?? selectedOrder.promo_code}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${Number(selectedOrder.total).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;