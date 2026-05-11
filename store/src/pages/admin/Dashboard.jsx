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
      pending: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: 'bi-clock-history' },
      processing: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', icon: 'bi-arrow-repeat' },
      completed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: 'bi-check-circle' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: 'bi-x-circle' },
    };
    return colors[status] || { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', icon: 'bi-question-circle' };
  };

  const statCards = [
    {
      title: 'Royal Members',
      value: stats.totalUsers,
      icon: 'bi-people-fill',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
      textColor: 'text-blue-400',
      change: '+12%',
      changeType: 'increase',
    },
    {
      title: 'Royal Orders',
      value: stats.totalOrders,
      icon: 'bi-bag-check-fill',
      color: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
      textColor: 'text-emerald-400',
      change: '+8%',
      changeType: 'increase',
    },
    {
      title: 'Treasury Items',
      value: stats.totalProducts,
      icon: 'bi-box-seam-fill',
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
      textColor: 'text-purple-400',
      change: '+5%',
      changeType: 'increase',
    },
    {
      title: 'Royal Revenue',
      value: `MAD ${stats.totalRevenue.toFixed(2)}`,
      icon: 'bi-currency-dollar',
      color: 'from-[#D4AF37] to-[#FFD700]',
      bgGradient: 'from-[#D4AF37]/10 to-[#FFD700]/5',
      textColor: 'text-[#D4AF37]',
      change: '+23%',
      changeType: 'increase',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading royal dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
              <i className="bi bi-speedometer2 text-black text-lg"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              Royal Command Center
            </h1>
          </div>
          <p className="text-gray-400 mt-1 ml-13">Welcome back, Your Majesty</p>
        </div>
        
        {/* Period Selector - Royal Gold */}
        <div className="flex gap-2 bg-black/40 backdrop-blur-md rounded-xl p-1 border border-[#D4AF37]/20">
          {['day', 'week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 capitalize min-h-[40px] ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg'
                  : 'text-gray-400 hover:text-[#D4AF37] hover:bg-white/5'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid - Royal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={card.title}
            className="group bg-black/40 backdrop-blur-md rounded-xl shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-500 overflow-hidden animate-fade-in-up border border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`bg-gradient-to-br ${card.bgGradient} p-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <i className={`${card.icon} text-black text-xl`}></i>
                </div>
                <div className="flex items-center gap-1 bg-emerald-500/20 px-2 py-1 rounded-lg">
                  <i className="bi bi-arrow-up-short text-emerald-400 text-sm"></i>
                  <span className="text-xs font-bold text-emerald-400">{card.change}</span>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">{card.title}</p>
                <p className={`text-2xl md:text-3xl font-bold ${card.textColor} group-hover:scale-105 transition-transform duration-300`}>
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
        <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-xl p-6 border border-[#D4AF37]/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#D4AF37]">Revenue Overview</h2>
              <p className="text-sm text-gray-400 mt-1">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full"></div>
                <span className="text-xs text-gray-400">Revenue</span>
              </div>
            </div>
          </div>
          
          {/* Bar Chart Visualization - Royal Gold */}
          <div className="space-y-3">
            {[85, 70, 95, 60, 80, 75, 90].map((height, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                </span>
                <div className="flex-1 bg-black/60 rounded-full h-8 overflow-hidden border border-[#D4AF37]/20">
                  <div 
                    className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] h-full rounded-full transition-all duration-500"
                    style={{ width: `${height}%` }}
                  >
                    <div className="h-full flex items-center justify-end px-3">
                      <span className="text-black text-xs font-bold">{`MAD ${(height * 45).toFixed(0)}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Status Chart - Royal Gold */}
        <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-xl p-6 border border-[#D4AF37]/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#D4AF37]">Order Status Distribution</h2>
              <p className="text-sm text-gray-400 mt-1">Royal order analytics</p>
            </div>
            <i className="bi bi-pie-chart text-[#D4AF37] text-2xl"></i>
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
                    <span className="text-sm font-medium text-gray-300">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#D4AF37]">{status.count}</span>
                    <span className="text-xs text-gray-500">({status.percentage}%)</span>
                  </div>
                </div>
                <div className="bg-black/60 rounded-full h-2 overflow-hidden border border-[#D4AF37]/20">
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
      <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#D4AF37]/20">
        <div className="px-6 py-5 border-b border-[#D4AF37]/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#D4AF37]">Recent Royal Orders</h2>
            <p className="text-sm text-gray-400 mt-1">Latest customer purchases</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/20 text-[#D4AF37] hover:from-[#D4AF37]/30 hover:to-[#FFD700]/30 transition-all duration-300 text-sm font-bold border border-[#D4AF37]/30 min-h-[44px]">
            <i className="bi bi-download"></i>
            <span>Export Report</span>
          </button>
        </div>
        
        {stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
              <i className="bi bi-inbox text-3xl text-[#D4AF37]/40"></i>
            </div>
            <p className="text-gray-400 font-medium">No royal orders yet</p>
            <p className="text-sm text-gray-500 mt-1">Orders will appear here once placed</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/60 border-b border-[#D4AF37]/20">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider font-mono">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Royal Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/10">
                {stats.recentOrders.map((order, index) => {
                  const statusStyle = getStatusColor(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-black/60 rounded-lg flex items-center justify-center border border-[#D4AF37]/30">
                            <i className="bi bi-receipt text-[#D4AF37] text-sm"></i>
                          </div>
                          <span className="font-mono text-sm font-bold text-[#D4AF37]">
                            #{order.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center">
                            <i className="bi bi-person text-black text-sm"></i>
                          </div>
                          <span className="text-sm text-white">{order.user?.username || 'Anonymous Royal'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-[#D4AF37]">
                          {`MAD ${Number(order.total).toFixed(2)}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                          <i className={`${statusStyle.icon} text-xs`}></i>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <i className="bi bi-calendar3 text-xs"></i>
                          <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-500 hover:text-[#D4AF37] transition-all duration-300">
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
          <div className="px-6 py-4 border-t border-[#D4AF37]/20 bg-black/60 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-sm text-gray-400">
              Showing <span className="font-bold text-[#D4AF37]">{Math.min(5, stats.recentOrders.length)}</span> of <span className="font-bold text-[#D4AF37]">{stats.recentOrders.length}</span> royal orders
            </p>
            <button className="text-sm text-[#D4AF37] hover:text-[#FFD700] font-bold transition-colors flex items-center gap-1">
              View All Orders <i className="bi bi-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;