import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProductForm from '../Products/ProductForm';
import TagManager from './TagManager';
import PromoCodeManager from './PromoCodeManager';
import AdminOrders from './AdminOrders';
import { Package, Tags, Ticket, ShoppingBag, Plus, LayoutDashboard } from 'lucide-react';
import { getDashboardStats } from '../../api';

const AdminDashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'products', label: 'Products', icon: Package, path: '/admin/products' },
    { id: 'add-product', label: 'Add Product', icon: Plus, path: '/admin/add-product' },
    { id: 'tags', label: 'Tags', icon: Tags, path: '/admin/tags' },
    { id: 'promos', label: 'Promo Codes', icon: Ticket, path: '/admin/promos' },
  ];

  useEffect(() => {
    const path = location.pathname;
    if (path === '/admin') setActiveTab('dashboard');
    else if (path === '/admin/orders') setActiveTab('orders');
    else if (path === '/admin/products') setActiveTab('products');
    else if (path === '/admin/add-product') setActiveTab('add-product');
    else if (path === '/admin/tags') setActiveTab('tags');
    else if (path === '/admin/promos') setActiveTab('promos');
    
    if (path === '/admin') {
      fetchStats();
    }
  }, [location]);

  const fetchStats = async () => {
    try {
      const response = await getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="flex flex-wrap gap-2 mb-8 border-b">
        {tabs.map(tab => (
          <Link
            key={tab.id}
            to={tab.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </Link>
        ))}
      </div>
      
      <Routes>
        <Route index element={<DashboardHome stats={stats} />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="products" element={<ProductListAdmin />} />
        <Route path="add-product" element={<ProductForm />} />
        <Route path="tags" element={<TagManager />} />
        <Route path="promos" element={<PromoCodeManager />} />
      </Routes>
    </div>
  );
};

// Dashboard Home Component
const DashboardHome = ({ stats }) => {
  return (
    <div>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md p-6">
            <p className="text-sm opacity-90">Total Revenue</p>
            <p className="text-3xl font-bold">${parseFloat(stats.total_revenue || 0).toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6">
            <p className="text-sm opacity-90">Total Orders</p>
            <p className="text-3xl font-bold">{stats.total_orders || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md p-6">
            <p className="text-sm opacity-90">Total Users</p>
            <p className="text-3xl font-bold">{stats.total_users || 0}</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md p-6">
            <p className="text-sm opacity-90">Total Products</p>
            <p className="text-3xl font-bold">{stats.total_products || 0}</p>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          <RecentOrdersList />
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/add-product"
              className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/promos"
              className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Create Promo Code
            </Link>
            <Link
              to="/admin/tags"
              className="block w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              Manage Tags
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Orders List Component
const RecentOrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const fetchRecentOrders = async () => {
    try {
      const response = await getAllOrders({ page: 1, per_page: 5 });
      setOrders(response.data.data.data);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      {orders.map(order => (
        <Link
          key={order.id}
          to={`/orders/${order.id}`}
          className="block p-3 border rounded-lg hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Order #{order.id}</p>
              <p className="text-sm text-gray-500">{order.user?.username}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">${parseFloat(order.total).toFixed(2)}</p>
              <p className={`text-xs px-2 py-1 rounded-full ${
                order.status === 'completed' ? 'bg-green-100 text-green-800' :
                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {order.status}
              </p>
            </div>
          </div>
        </Link>
      ))}
      {orders.length === 0 && (
        <p className="text-gray-500 text-center">No orders yet</p>
      )}
      <Link
        to="/admin/orders"
        className="block text-center text-blue-600 hover:underline mt-3"
      >
        View All Orders →
      </Link>
    </div>
  );
};

// Product List Admin Component
const ProductListAdmin = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { getProducts } = await import('../../api');
      const response = await getProducts({ page: 1 });
      setProducts(response.data.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    try {
      const { deleteProduct } = await import('../../api');
      await deleteProduct(id);
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map(product => (
            <tr key={product.id}>
              <td className="px-6 py-4">{product.id}</td>
              <td className="px-6 py-4">{product.title}</td>
              <td className="px-6 py-4">${product.price}</td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4 space-x-2">
                <button
                  onClick={() => setEditingProduct(product)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminDashboard;