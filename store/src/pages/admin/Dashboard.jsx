import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';
import { ordersAPI } from '../../api/orders';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          totalUsers: data.total_users,
          totalOrders: data.total_orders,
          totalProducts: data.total_products,
          totalRevenue: data.total_revenue,
          recentOrders: data.recent_orders,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setLoading(false);
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

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: 'bi-people-fill',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      textColor: 'text-blue-600',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: 'bi-bag-check-fill',
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      textColor: 'text-emerald-600',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: 'bi-box-seam-fill',
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100',
      textColor: 'text-purple-600',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: 'bi-currency-dollar',
      color: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100',
      textColor: 'text-amber-600',
      change: '+23%',
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-speedometer2 text-gray-900 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin</p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2 bg-white/50 backdrop-blur-sm rounded-2xl p-1 shadow-sm border border-gray-100">
          {['day', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 capitalize ${
                selectedPeriod === period
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`bg-gradient-to-br ${card.bgGradient} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center shadow-md`}>
                  <i className={`${card.icon} text-white text-xl`}></i>
                </div>
                <div className="flex items-center gap-1">
                  <i className="bi bi-arrow-up-short text-emerald-600 text-sm"></i>
                  <span className="text-xs font-medium text-emerald-600">{card.change}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-500 text-sm mb-1">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor} group-hover:scale-105 transition-transform duration-300`}>
                  {card.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500 mt-1">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
                <span className="text-xs text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          
          {/* Simple Bar Chart Visualization */}
          <div className="space-y-3">
            {[85, 70, 95, 60, 80, 75, 90].map((height, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-gray-800 to-gray-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${height}%` }}
                  >
                    <div className="h-full flex items-center justify-end px-3">
                      <span className="text-white text-xs font-medium">${(height * 45).toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Status Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Order Status</h2>
              <p className="text-sm text-gray-500 mt-1">Distribution of orders</p>
            </div>
            <i className="bi bi-pie-chart text-gray-400 text-2xl"></i>
          </div>
          
          <div className="space-y-4">
            {[
              { label: 'Completed', count: 145, color: 'emerald', percentage: 58 },
              { label: 'Processing', count: 62, color: 'blue', percentage: 25 },
              { label: 'Pending', count: 28, color: 'amber', percentage: 11 },
              { label: 'Cancelled', count: 15, color: 'red', percentage: 6 },
            ].map((status) => (
              <div key={status.label}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 bg-${status.color}-500 rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-700">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{status.count}</span>
                    <span className="text-xs text-gray-500">({status.percentage}%)</span>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`bg-${status.color}-500 h-full rounded-full transition-all duration-500`}
                    style={{ width: `${status.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">Latest customer orders</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-sm font-medium">
            <i className="bi bi-download"></i>
            <span>Export Report</span>
          </button>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-inbox text-3xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers place them</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentOrders.map((order, index) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <i className="bi bi-receipt text-gray-600 text-sm"></i>
                          </div>
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            #{order.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <i className="bi bi-person text-gray-600 text-sm"></i>
                          </div>
                          <span className="text-sm text-gray-900">{order.user?.username || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ${Number(order.total).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          <i className={`${statusStyle.icon} text-xs`}></i>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <i className="bi bi-calendar3 text-xs"></i>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Table Footer */}
        {stats.recentOrders.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{Math.min(5, stats.recentOrders.length)}</span> of <span className="font-semibold">{stats.recentOrders.length}</span> orders
            </p>
            <button className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors">
              View All Orders →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;