import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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
    try {
      const response = await adminAPI.updateOrderStatus(orderId, newStatus);
      if (response.data.success) {
        fetchOrders();
      }
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  const toggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-center">Details</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{order.user?.username || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.user?.email}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-600">${Number(order.total).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-2 py-1 rounded border text-sm focus:ring-2 focus:ring-blue-500 outline-none ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleDetails(order.id)}
                        className={`p-2 rounded-full transition ${expandedOrderId === order.id ? 'bg-blue-600 text-white shadow-md' : 'text-blue-600 hover:bg-blue-50'}`}
                        title={expandedOrderId === order.id ? 'Hide Details' : 'Show Details'}
                      >
                        <i className={`bi ${expandedOrderId === order.id ? 'bi-chevron-up' : 'bi-eye'}`}></i>
                      </button>
                    </td>
                  </tr>
                  {expandedOrderId === order.id && (
                    <tr className="bg-blue-50 border-t border-blue-100">
                      <td colSpan="6" className="px-8 py-4">
                        <div className="bg-white rounded-lg shadow-sm border p-4">
                          <h3 className="text-sm font-bold text-gray-700 mb-3 border-b pb-2 uppercase tracking-wider">Order Items</h3>
                          <div className="space-y-3">
                            {order.lignes?.map((item) => (
                              <div key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                <div className="flex items-center gap-3">
                                  {item.product?.images && item.product.images[0] ? (
                                    <img 
                                      src={item.product.images[0].image_url || item.product.images[0]} 
                                      alt="" 
                                      className="w-10 h-10 object-cover rounded shadow-sm"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                      <i className="bi bi-image text-gray-400"></i>
                                    </div>
                                  )}
                                  <div>
                                    <p className="font-semibold text-sm text-gray-800">{item.product?.title}</p>
                                    <p className="text-xs text-gray-500">Theme: {item.product?.theme}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-bold text-gray-800">${Number(item.unit_price).toFixed(2)} x {item.quantity}</p>
                                  <p className="text-xs text-blue-600 font-semibold">Subtotal: ${(Number(item.unit_price) * item.quantity).toFixed(2)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          {order.promo_code && (
                            <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm">
                              <span className="text-gray-600">Promo Code: <span className="font-mono font-bold text-green-600">{order.promo_code.code}</span></span>
                              <span className="font-bold text-green-600">-{order.promo_code.discount_percentage}%</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersList;