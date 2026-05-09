import { useState, useEffect } from 'react';
import { ordersAPI } from '../api/orders';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="bi bi-inbox text-6xl text-gray-400"></i>
        <h2 className="text-2xl font-bold mt-4">No orders yet</h2>
        <p className="text-gray-600 mt-2">Start shopping to place your first order!</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-lg">${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-2">
                {order.lignes?.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      {item.product?.images && item.product.images[0] ? (
                        <img 
                          src={item.product.images[0].image_url || item.product.images[0]} 
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded"></div>
                      )}
                      <div>
                        <p className="font-medium">{item.product?.title}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span>${Number(item.unit_price).toFixed(2)}</span>
                  </div>
                ))}
                {order.lignes?.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{order.lignes.length - 3} more items
                  </p>
                )}
              </div>
              
              {order.status === 'pending' && (
                <div className="mt-4 pt-4 border-t text-right">
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;