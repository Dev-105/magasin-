import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrder, updateOrderStatus } from '../../api';
import LoadingSpinner from '../Common/LoadingSpinner';
import Alert from '../Common/Alert';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isAdmin = user?.role === 'admin';

  const statuses = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { value: 'processing', label: 'Processing', icon: Truck, color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
  ];

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getOrder(id);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setAlert({ type: 'error', message: 'Failed to load order details' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!isAdmin) return;
    
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      setOrder({ ...order, status: newStatus });
      setAlert({ type: 'success', message: `Order status updated to ${newStatus}` });
      setTimeout(() => setAlert(null), 3000);
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to update order status' });
    } finally {
      setUpdating(false);
    }
  };

  const getStatusConfig = (status) => {
    return statuses.find(s => s.value === status) || statuses[0];
  };

  const getStatusHistory = () => {
    // This would come from your backend if you store status history
    // For now, we'll just show current status
    return [
      { status: 'pending', date: order?.created_at, completed: true },
      { status: 'processing', date: order?.updated_at, completed: order?.status !== 'pending' },
      { status: 'completed', date: order?.updated_at, completed: order?.status === 'completed' },
    ];
  };

  if (loading) return <LoadingSpinner />;
  if (!order) return <div>Order not found</div>;

  const currentStatus = getStatusConfig(order.status);
  const StatusIcon = currentStatus.icon;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
      
      {/* Header with Back Button */}
      <div className="flex justify-between items-center">
        <Link
          to={isAdmin ? "/admin" : "/orders"}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAdmin ? "Back to Admin Dashboard" : "Back to Orders"}
        </Link>
        
        {isAdmin && (
          <div className="flex gap-2">
            {statuses.map(status => (
              <button
                key={status.value}
                onClick={() => handleStatusUpdate(status.value)}
                disabled={updating || order.status === status.value}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  order.status === status.value
                    ? status.color
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50`}
              >
                Set as {status.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.id}</h1>
            <p className="text-gray-500 mt-1">
              Placed on {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${currentStatus.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-semibold">{currentStatus.label}</span>
          </div>
        </div>
      </div>
      
      {/* Order Status Timeline (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Order Status Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {statuses.map((status, index) => {
                const isCompleted = index <= statuses.findIndex(s => s.value === order.status);
                const StatusIconComponent = status.icon;
                
                return (
                  <div key={status.value} className="relative pl-10">
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <StatusIconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold">{status.label}</p>
                      {isCompleted && order.status === status.value && (
                        <p className="text-sm text-gray-500">
                          {new Date(order.updated_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* Promo Code Info */}
      {order.promo_code && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Discount Applied</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800">Code: {order.promo_code.code}</p>
            <p className="text-green-700">{order.promo_code.discount_percentage}% discount applied</p>
          </div>
        </div>
      )}
      
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Order Items</h2>
        </div>
        <div className="divide-y">
          {order.items.map(item => (
            <div key={item.id} className="p-6 flex justify-between items-center hover:bg-gray-50">
              <div className="flex gap-4">
                <img
                  src={item.product.images?.[0]?.image_url || '/api/placeholder/100/100'}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <Link to={`/products/${item.product.id}`} className="font-semibold hover:text-blue-600">
                    {item.product.title}
                  </Link>
                  <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-gray-500 text-sm">Price: ${parseFloat(item.unit_price).toFixed(2)} each</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${parseFloat(item.subtotal).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Customer Information (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="font-medium">{order.user?.username}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="font-medium">{order.user?.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Phone</p>
              <p className="font-medium">{order.user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">City</p>
              <p className="font-medium">{order.user?.city || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-gray-500 text-sm">Address</p>
              <p className="font-medium">{order.user?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${parseFloat(order.total).toFixed(2)}</span>
          </div>
          {order.promo_code && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.promo_code.discount_percentage}%)</span>
              <span>-${(parseFloat(order.total) * (order.promo_code.discount_percentage / 100)).toFixed(2)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;