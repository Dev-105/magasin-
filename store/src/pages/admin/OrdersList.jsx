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
    // remove leading international 00
    digits = digits.replace(/^00+/, '');
    // if starts with 0 (local like 06xxxxxxx), remove it and prefix country code 212
    if (digits.startsWith('0')) {
      digits = '212' + digits.slice(1);
    } else if (!digits.startsWith('212') && digits.length === 9) {
      // assume local 9-digit number without leading 0
      digits = '212' + digits;
    }
    return digits;
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { 
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: 'bi-hourglass-split',
        label: 'Pending'
      },
      processing: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'bi-arrow-repeat',
        label: 'Processing'
      },
      completed: { 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'bi-check-circle-fill',
        label: 'Completed'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: 'bi-x-circle-fill',
        label: 'Cancelled'
      },
    };
    return config[status] || { 
      color: 'bg-gray-100 text-gray-800 border-gray-200',
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
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-truck text-gray-600 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Order Management
        </h1>
        <p className="text-gray-500 mt-1">Track and manage customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statusTabs.map((tab) => (
          <div
            key={tab.value}
            className={`bg-white/50 backdrop-blur-sm rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 hover:shadow-lg ${
              filterStatus === tab.value ? 'ring-2 ring-gray-800 shadow-lg' : ''
            }`}
            onClick={() => setFilterStatus(tab.value)}
          >
            <i className={`${tab.icon} text-2xl ${filterStatus === tab.value ? 'text-gray-800' : 'text-gray-500'} mb-2 block`}></i>
            <p className="text-2xl font-bold text-gray-900">{getStatusCount(tab.value)}</p>
            <p className="text-xs text-gray-500">{tab.label}</p>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search by Order ID, Customer name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-12 text-center">
            <i className="bi bi-inbox text-6xl text-gray-300 mb-4 block"></i>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <div key={order.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                {/* Order Header */}
                <div className="p-6 cursor-pointer" onClick={() => toggleDetails(order.id)}>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Order ID & Customer */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-600 rounded-2xl flex items-center justify-center shadow-md">
                        <i className="bi bi-receipt text-white text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Order #{order.id}</p>
                        <p className="font-semibold text-gray-900">{order.user?.username || 'Guest User'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                        {order.user?.phone && (
                          <p className="text-xs text-gray-500"><i className="bi bi-telephone mr-2"></i>{order.user.phone}</p>
                        )}
                        {((order.shipping_address || order.user?.address) || (order.shipping_city || order.user?.city)) && (
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            <i className="bi bi-geo-alt mr-2"></i>
                            {order.shipping_address || order.user?.address || ''}
                            {(order.shipping_city || order.user?.city) ? (', ' + (order.shipping_city || order.user?.city)) : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">${Number(order.total).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Status Badge */}
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${statusConfig.color} border`}>
                      <i className={`${statusConfig.icon} text-sm`}></i>
                      <span className="text-sm font-semibold">{statusConfig.label}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className={`px-4 py-2 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all ${statusConfig.color} cursor-pointer`}
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
                        className={`p-2 rounded-xl transition-all duration-200 ${
                          expandedOrderId === order.id 
                            ? 'bg-gray-900 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <i className={`bi ${expandedOrderId === order.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                      </button>
                      {/* Contact Buttons */}
                      {order.user?.phone && (() => {
                        const wa = formatWaNumber(order.user.phone);
                        return wa ? (
                          <a
                            href={`https://wa.me/${wa}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200"
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
                          className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200"
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
                  <div className="border-t border-gray-100 bg-gray-50/50 p-6 animate-fade-in-up">
                    {/* Customer / Shipping Info */}
                    <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                      <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"><i className="bi bi-person-lines-fill"></i> Customer & Shipping</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{order.user?.username || 'Guest'}</p>
                          <p className="text-xs text-gray-500 mt-2">Email</p>
                          <p className="text-sm text-gray-700">{order.user?.email}</p>
                          {order.user?.phone && (
                            <p className="text-xs text-gray-500 mt-2">Phone</p>
                          )}
                          {order.user?.phone && (
                            <p className="text-sm text-gray-700"><i className="bi bi-telephone mr-2"></i>{order.user.phone}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Shipping Address</p>
                          <p className="text-sm text-gray-700">{order.shipping_address || order.user?.address || 'Not provided'}</p>
                          {(order.shipping_city || order.user?.city) && (
                            <p className="text-sm text-gray-700 mt-1">{order.shipping_city || order.user?.city}</p>
                          )}
                          <div className="mt-3 flex items-center gap-2">
                            {order.user?.phone && (() => {
                              const wa = formatWaNumber(order.user.phone);
                              return wa ? (
                                <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all duration-200"> <i className="bi bi-whatsapp mr-2"></i>WhatsApp</a>
                              ) : null;
                            })()}
                            {order.user?.email && (
                              <a href={`mailto:${order.user.email}?subject=${encodeURIComponent(`Order #${order.id} - Inquiry`)}`} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-200"> <i className="bi bi-envelope mr-2"></i>Email</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                        <i className="bi bi-box-seam"></i>
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {order.lignes?.map((item, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                {item.product?.images && item.product.images[0] ? (
                                  <img 
                                    src={item.product.images[0].image_url || item.product.images[0]} 
                                    alt={item.product?.title}
                                    className="w-16 h-16 object-cover rounded-xl shadow-md"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <i className="bi bi-image text-gray-400 text-2xl"></i>
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-gray-900">{item.product?.title}</p>
                                  {item.product?.theme && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 rounded-lg text-xs text-gray-600">
                                      {item.product.theme} edition
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-500">
                                  ${Number(item.unit_price).toFixed(2)} × {item.quantity}
                                </p>
                                <p className="text-lg font-bold text-gray-900">
                                  ${(Number(item.unit_price) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Promo Code Info */}
                    {order.promo_code && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <i className="bi bi-ticket-perforated text-green-600 text-2xl"></i>
                            <div>
                              <p className="text-sm font-semibold text-green-800">Promo Code Applied</p>
                              <p className="text-xs text-green-600">Code: <span className="font-mono font-bold">{order.promo_code.code}</span></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-700">-{order.promo_code.discount_percentage}%</p>
                            <p className="text-xs text-green-600">discount applied</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                      <div className="bg-white rounded-xl p-4 min-w-[200px] shadow-sm">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Subtotal:</span>
                          <span className="text-gray-700">${Number(order.total).toFixed(2)}</span>
                        </div>
                        {order.promo_code && (
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-green-600">Discount:</span>
                            <span className="text-green-600">-{order.promo_code.discount_percentage}%</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                          <span>Total:</span>
                          <span className="text-gray-900">${Number(order.total).toFixed(2)}</span>
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