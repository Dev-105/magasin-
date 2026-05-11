import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllOrders();
      if (response.data.success) {
        setOrders(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      alert('Failed to update order status');
    }
    setUpdatingStatus(null);
  };

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatWaNumber = (phone) => {
    if (!phone) return '';
    let digits = phone.toString().replace(/\D/g, '');
    digits = digits.replace(/^00+/, '');
    if (digits.startsWith('0')) {
      digits = '212' + digits.slice(1);
    } else if (!digits.startsWith('212') && digits.length === 9) {
      digits = '212' + digits;
    }
    return digits;
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        color: 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/30',
        icon: 'bi-hourglass-split',
        label: 'Pending'
      },
      processing: { 
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        icon: 'bi-arrow-repeat',
        label: 'Processing'
      },
      completed: { 
        color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        icon: 'bi-check-circle-fill',
        label: 'Completed'
      },
      cancelled: { 
        color: 'bg-red-500/10 text-red-400 border-red-500/30',
        icon: 'bi-x-circle-fill',
        label: 'Cancelled'
      },
    };
    return config[status] || { 
      color: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
      icon: 'bi-question-circle',
      label: status 
    };
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.id.toString().includes(searchTerm) || 
                         order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusCount = (status) => {
    if (status === 'all') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const statusTabs = [
    { value: 'all', label: 'All Orders', icon: 'bi-grid-3x3-gap-fill' },
    { value: 'pending', label: 'Pending', icon: 'bi-hourglass-split' },
    { value: 'processing', label: 'Processing', icon: 'bi-arrow-repeat' },
    { value: 'completed', label: 'Completed', icon: 'bi-check-circle-fill' },
    { value: 'cancelled', label: 'Cancelled', icon: 'bi-x-circle-fill' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gradient-to-br from-black via-[#0a0a0a] to-black">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-2xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading royal orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">Royal Order Management</span>
        </h1>
        <p className="text-gray-400 mt-1">Track and manage royal customer orders</p>
      </div>

      {/* Stats Cards - Gold */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusTabs.map((tab) => (
          <div
            key={tab.value}
            className={`bg-black/60 backdrop-blur-md rounded-xl p-4 text-center cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-[#D4AF37]/20 ${
              filterStatus === tab.value ? 'ring-2 ring-[#D4AF37] shadow-lg shadow-[#D4AF37]/30' : 'border border-[#D4AF37]/20'
            }`}
            onClick={() => setFilterStatus(tab.value)}
          >
            <i className={`${tab.icon} text-2xl ${filterStatus === tab.value ? 'text-[#D4AF37]' : 'text-gray-500'} mb-2 block`}></i>
            <p className="text-2xl font-bold text-[#D4AF37]">{getStatusCount(tab.value)}</p>
            <p className="text-xs text-gray-400">{tab.label}</p>
          </div>
        ))}
      </div>

      {/* Search Bar - Gold */}
      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50"></i>
        <input
          type="text"
          placeholder="Search by Order ID, Customer name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/60 backdrop-blur-md rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder-gray-500"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-black/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#D4AF37]/20">
            <i className="bi bi-inbox text-6xl text-[#D4AF37]/30 mb-4 block"></i>
            <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
            <p className="text-gray-400">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <div key={order.id} className="bg-black/60 backdrop-blur-md rounded-xl shadow-2xl border border-[#D4AF37]/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#D4AF37]/10 hover:border-[#D4AF37]/40">
                {/* Order Header */}
                <div className="p-6 cursor-pointer" onClick={() => toggleDetails(order.id)}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Order ID & Customer */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                        <i className="bi bi-crown-fill text-black text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-[#D4AF37]/70">Order #{order.id}</p>
                        <p className="font-bold text-white">{order.user?.username || 'Guest User'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                        {order.user?.phone && (
                          <p className="text-xs text-gray-500"><i className="bi bi-telephone mr-2"></i>{order.user.phone}</p>
                        )}
                        {((order.shipping_address || order.user?.address) || (order.shipping_city || order.user?.city)) && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            <i className="bi bi-geo-alt mr-2 text-[#D4AF37]/50"></i>
                            {order.shipping_address || order.user?.address || ''}
                            {(order.shipping_city || order.user?.city) ? (', ' + (order.shipping_city || order.user?.city)) : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#D4AF37]">{`MAD ${Number(order.total).toFixed(2)}`}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.color} border backdrop-blur-sm`}>
                      <i className={`${statusConfig.icon} text-sm`}></i>
                      <span className="text-sm font-bold capitalize">{statusConfig.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`px-4 py-2 rounded-xl border text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 cursor-pointer bg-black/60 ${statusConfig.color} min-h-[44px]`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDetails(order.id);
                        }}
                        className={`p-2 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] ${
                          expandedOrderId === order.id 
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-[#D4AF37]'
                        }`}
                      >
                        <i className={`bi ${expandedOrderId === order.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                      </button>
                      
                      {order.user?.phone && (() => {
                        const wa = formatWaNumber(order.user.phone);
                        return wa ? (
                          <a
                            href={`https://wa.me/${wa}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                            title="Contact via WhatsApp"
                          >
                            <i className="bi bi-whatsapp"></i>
                          </a>
                        ) : null;
                      })()}
                      {order.user?.email && (
                        <a
                          href={`mailto:${order.user.email}?subject=${encodeURIComponent(`Order #${order.id} - Inquiry`)}&body=${encodeURIComponent('Hello,')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
                          title="Send email"
                        >
                          <i className="bi bi-envelope"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrderId === order.id && (
                  <div className="border-t border-[#D4AF37]/20 bg-black/40 p-6 animate-fade-in-up">
                    {/* Customer / Shipping Info */}
                    <div className="mb-6 bg-black/60 rounded-xl p-4 shadow-lg border border-[#D4AF37]/20">
                      <h3 className="text-sm font-bold text-[#D4AF37] mb-3 flex items-center gap-2">
                        <i className="bi bi-person-lines-fill"></i> Customer & Shipping
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-medium text-white">{order.user?.username || 'Guest'}</p>
                          <p className="text-xs text-gray-500 mt-2">Email</p>
                          <p className="text-sm text-gray-300">{order.user?.email}</p>
                          {order.user?.phone && (
                            <>
                              <p className="text-xs text-gray-500 mt-2">Phone</p>
                              <p className="text-sm text-gray-300"><i className="bi bi-telephone mr-2"></i>{order.user.phone}</p>
                            </>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Shipping Address</p>
                          <p className="text-sm text-gray-300">{order.shipping_address || order.user?.address || 'Not provided'}</p>
                          {(order.shipping_city || order.user?.city) && (
                            <p className="text-sm text-gray-300 mt-1">{order.shipping_city || order.user?.city}</p>
                          )}
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            {order.user?.phone && (() => {
                              const wa = formatWaNumber(order.user.phone);
                              return wa ? (
                                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all duration-300 text-sm min-h-[40px] inline-flex items-center gap-2"> <i className="bi bi-whatsapp"></i>WhatsApp</a>
                              ) : null;
                            })()}
                            {order.user?.email && (
                              <a href={`mailto:${order.user.email}?subject=${encodeURIComponent(`Order #${order.id} - Inquiry`)}`} className="px-3 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all duration-300 text-sm min-h-[40px] inline-flex items-center gap-2"> <i className="bi bi-envelope"></i>Email</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-sm font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
                        <i className="bi bi-box-seam"></i>
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.lignes?.map((item, idx) => (
                          <div key={idx} className="bg-black/60 rounded-xl p-4 shadow-lg hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 border border-[#D4AF37]/20">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                {item.product?.images && item.product.images[0] ? (
                                  <img 
                                    src={item.product.images[0].image_url || item.product.images[0]} 
                                    alt={item.product?.title}
                                    className="w-16 h-16 object-cover rounded-xl shadow-lg border border-[#D4AF37]/20"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center border border-[#D4AF37]/20">
                                    <i className="bi bi-gem text-[#D4AF37]/30 text-2xl"></i>
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-white">{item.product?.title}</p>
                                  {item.product?.theme && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#D4AF37]/10 rounded-lg text-xs text-[#D4AF37]">
                                      {item.product.theme} edition
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-400">
                                  {`MAD ${Number(item.unit_price).toFixed(2)}`} × {item.quantity}
                                </p>
                                <p className="text-lg font-bold text-[#D4AF37]">
                                  {`MAD ${(Number(item.unit_price) * item.quantity).toFixed(2)}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code Info - Gold */}
                    {order.promo_code && (
                      <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent rounded-xl p-4 border border-[#D4AF37]/30 mb-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <i className="bi bi-ticket-perforated text-[#D4AF37] text-2xl"></i>
                            <div>
                              <p className="text-sm font-bold text-[#D4AF37]">Promo Code Applied</p>
                              <p className="text-xs text-[#D4AF37]/70">Code: <span className="font-mono font-bold">{order.promo_code.code}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#D4AF37]">-{order.promo_code.discount_percentage}%</p>
                            <p className="text-xs text-[#D4AF37]/70">discount applied</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="mt-4 pt-4 border-t border-[#D4AF37]/20 flex justify-end">
                      <div className="bg-black/60 rounded-xl p-4 min-w-[200px] shadow-lg border border-[#D4AF37]/20">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="text-white">{`MAD ${Number(order.total).toFixed(2)}`}</span>
                        </div>
                        {order.promo_code && (
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-[#D4AF37]">Discount:</span>
                            <span className="text-[#D4AF37]">-{order.promo_code.discount_percentage}%</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#D4AF37]/20">
                          <span className="text-white">Total:</span>
                          <span className="text-[#D4AF37]">{`MAD ${Number(order.total).toFixed(2)}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrdersList;