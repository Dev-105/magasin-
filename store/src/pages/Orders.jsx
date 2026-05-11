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
        // alert('Failed to cancel order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: 'bg-[#D4AF37]/10', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]/30', icon: 'bi-clock-history' },
      processing: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'bi-arrow-repeat' },
      completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: 'bi-check-circle' },
      cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', icon: 'bi-x-circle' },
    };
    return colors[status] || { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/30', icon: 'bi-question-circle' };
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-2xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading your royal orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="bg-black/60 backdrop-blur-md rounded-3xl p-12 text-center max-w-md border border-[#D4AF37]/30">
          <div className="w-24 h-24 bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="bi bi-inbox text-5xl text-[#D4AF37]"></i>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-6">Start shopping to place your first royal order!</p>
          <a 
            href="/products" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black px-6 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 shadow-lg min-h-[48px]"
          >
            <i className="bi bi-crown-fill"></i>
            <span>Start Shopping</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">My Royal Orders</span>
        </h1>
        <p className="text-gray-400">Track and manage your luxury purchases</p>
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
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px]
                ${isActive 
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                  : 'bg-black/60 backdrop-blur-sm text-gray-300 hover:bg-white/10 hover:text-[#D4AF37] border border-[#D4AF37]/20'
                }
              `}
            >
              <i className={filterOption.icon}></i>
              <span>{filterOption.label}</span>
              {count > 0 && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded-full
                  ${isActive ? 'bg-black/20 text-black' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}
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
              className="group bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-500 overflow-hidden animate-fade-in-up border border-[#D4AF37]/20 hover:border-[#D4AF37]/40"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-[#D4AF37]/5 to-transparent p-6 border-b border-[#D4AF37]/20">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                      <i className="bi bi-crown-fill text-black text-xl"></i>
                    </div>
                    <div>
                      <p className="text-sm text-[#D4AF37]/70">Order #{order.id}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <i className="bi bi-calendar3 text-[#D4AF37]/50 text-sm"></i>
                        <p className="text-sm text-gray-400">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className={`px-4 py-2 rounded-xl ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} flex items-center gap-2 backdrop-blur-sm`}>
                      <i className={`${statusStyle.icon} text-sm`}></i>
                      <span className="text-sm font-bold capitalize">{order.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Total Amount</p>
                      <p className="text-2xl font-bold text-[#D4AF37]">{`MAD ${Number(order.total).toFixed(2)}`}</p>
                    </div>
                  </div>
                </div>

                {/* Order Progress Steps */}
                {order.status !== 'cancelled' && (
                  <div className="mt-6 pt-4 border-t border-[#D4AF37]/20">
                    <div className="flex items-center justify-between">
                      {statusSteps.map((step, idx) => (
                        <div key={step.name} className="flex-1 relative">
                          <div className="flex flex-col items-center">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                              transition-all duration-300
                              ${step.completed 
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                                : 'bg-black/60 text-gray-500 border border-[#D4AF37]/30'
                              }
                              ${step.active ? 'ring-2 ring-[#D4AF37] ring-offset-2 ring-offset-black' : ''}
                            `}>
                              {step.completed ? (
                                <i className="bi bi-check-lg text-sm"></i>
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <p className={`
                              text-xs font-medium mt-2 capitalize
                              ${step.completed ? 'text-[#D4AF37]' : 'text-gray-500'}
                            `}>
                              {step.name}
                            </p>
                          </div>
                          {idx < statusSteps.length - 1 && (
                            <div className={`
                              absolute top-4 left-1/2 w-full h-0.5
                              transition-all duration-300
                              ${step.completed ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700]' : 'bg-gray-700'}
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
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        {item.product?.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0].image_url || item.product.images[0]} 
                            alt={item.product.title}
                            className="w-14 h-14 object-cover rounded-xl shadow-lg border border-[#D4AF37]/20"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                            <i className="bi bi-gem text-[#D4AF37]/30 text-xl"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white">{item.product?.title}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                            <p className="text-sm text-gray-500">×</p>
                            <p className="text-sm font-medium text-[#D4AF37]">{`MAD ${Number(item.unit_price).toFixed(2)}`}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#D4AF37]">
                          {`MAD ${(Number(item.unit_price) * item.quantity).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {order.lignes?.length > 3 && (
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-full text-center text-sm text-[#D4AF37]/70 hover:text-[#D4AF37] py-2 transition-colors"
                    >
                      + {order.lignes.length - 3} more items • View full order details
                    </button>
                  )}
                </div>

                {/* Order Summary */}
                <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="text-sm text-[#D4AF37]/70">
                      <i className="bi bi-truck mr-1"></i> 
                      Free Royal Shipping
                    </div>
                    {order.promo_code && (
                      <div className="text-sm text-[#D4AF37]">
                        <i className="bi bi-ticket-perforated mr-1"></i>
                        Promo: {order.promo_code?.code ?? order.promo_code}
                      </div>
                    )}
                  </div>
                  
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 text-sm font-medium min-h-[44px]"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="bg-gradient-to-br from-black to-[#0a0a0a] rounded-2xl shadow-2xl border-2 border-[#D4AF37] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-[#D4AF37]/20 p-6 flex justify-between items-center rounded-t-2xl">
              <div>
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">Order Details</h2>
                <p className="text-sm text-gray-400">Order #{selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px]"
              >
                <i className="bi bi-x-lg text-[#D4AF37] text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* All Items */}
              <div>
                <h3 className="font-bold text-[#D4AF37] mb-3">Luxury Items</h3>
                <div className="space-y-3">
                  {selectedOrder.lignes?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-[#D4AF37]/20">
                      <div className="flex items-center gap-3">
                        {item.product?.images && item.product.images[0] ? (
                          <img 
                            src={item.product.images[0].image_url || item.product.images[0]} 
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-lg border border-[#D4AF37]/20"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-black rounded-lg border border-[#D4AF37]/20 flex items-center justify-center">
                            <i className="bi bi-gem text-[#D4AF37]/30"></i>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{item.product?.title}</p>
                          <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-[#D4AF37]">{`MAD ${(Number(item.unit_price) * item.quantity).toFixed(2)}`}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl p-4 border border-[#D4AF37]/20">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{`MAD ${Number(selectedOrder.total).toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-[#D4AF37]">Free Royal Delivery</span>
                  </div>
                  {selectedOrder.promo_code && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Promo Code</span>
                      <span className="text-[#D4AF37]">{selectedOrder.promo_code?.code ?? selectedOrder.promo_code}</span>
                    </div>
                  )}
                  <div className="border-t border-[#D4AF37]/20 pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-[#D4AF37] text-xl">{`MAD ${Number(selectedOrder.total).toFixed(2)}`}</span>
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