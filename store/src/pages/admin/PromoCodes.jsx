import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminPromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    max_usage: '',
    expires_at: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllPromoCodes();
      if (response.data.success) {
        setPromoCodes(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching promo codes:', error);
    }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discount_percentage) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await adminAPI.createPromoCode(formData);
      if (response.data.success) {
        setShowForm(false);
        setFormData({ code: '', discount_percentage: '', max_usage: '', expires_at: '' });
        fetchPromoCodes();
        showNotification('Promo code created successfully', 'success');
      }
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to create promo code', 'error');
    }
  };

  const handleDelete = async (id, code) => {
    if (confirm(`Delete promo code "${code}"? This action cannot be undone.`)) {
      try {
        await adminAPI.deletePromoCode(id);
        fetchPromoCodes();
        showNotification('Promo code deleted successfully', 'success');
      } catch (error) {
        showNotification('Failed to delete promo code', 'error');
      }
    }
  };

  const showNotification = (message, type) => {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg animate-fade-in ${
      type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
    } text-white`;
    notification.innerHTML = `<i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} mr-2"></i>${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: `PROMO${code}` });
  };

  const isExpired = (expiresAt) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isMaxUsageReached = (promo) => {
    return promo.max_usage && promo.used_count >= promo.max_usage;
  };

  const getDiscountColor = (percentage) => {
    if (percentage >= 50) return 'from-rose-500 to-rose-600';
    if (percentage >= 30) return 'from-amber-500 to-amber-600';
    if (percentage >= 15) return 'from-emerald-500 to-emerald-600';
    return 'from-blue-500 to-blue-600';
  };

  const filteredPromoCodes = promoCodes.filter(promo => {
    const matchesSearch = promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true :
      filter === 'active' ? !isExpired(promo.expires_at) && !isMaxUsageReached(promo) :
      filter === 'expired' ? isExpired(promo.expires_at) :
      filter === 'full' ? isMaxUsageReached(promo) : true;
    return matchesSearch && matchesFilter;
  });

  const filters = [
    { id: 'all', label: 'All Codes', icon: 'bi-grid-3x3-gap-fill' },
    { id: 'active', label: 'Active', icon: 'bi-check-circle', color: 'emerald' },
    { id: 'expired', label: 'Expired', icon: 'bi-clock-history', color: 'red' },
    { id: 'full', label: 'Max Usage', icon: 'bi-exclamation-triangle', color: 'amber' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-ticket-perforated text-gray-900 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading promo codes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Promo Codes
          </h1>
          <p className="text-gray-500 mt-1">Manage discounts and promotions</p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-sm border border-gray-100 flex items-center gap-2">
            <i className="bi bi-ticket-perforated text-gray-600"></i>
            <span className="text-sm text-gray-600">Total:</span>
            <span className="text-lg font-bold text-gray-900">{promoCodes.length}</span>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md flex items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Code</span>
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in">
          <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <i className="bi bi-ticket-perforated text-gray-700"></i>
              <span>Create New Promo Code</span>
            </h2>
          </div>
          
          <form onSubmit={handleCreate} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <div className="relative">
                  <i className="bi bi-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="SUMMER2024"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50 uppercase"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage *</label>
                <div className="relative">
                  <i className="bi bi-percent absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="number"
                    placeholder="15"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    min="1"
                    max="100"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Usage (Optional)</label>
                <div className="relative">
                  <i className="bi bi-people absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.max_usage}
                    onChange={(e) => setFormData({ ...formData, max_usage: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    min="1"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for unlimited usage</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date (Optional)</label>
                <div className="relative">
                  <i className="bi bi-calendar-event absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="datetime-local"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for no expiration</p>
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="button"
                onClick={generateRandomCode}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <i className="bi bi-shuffle"></i>
                <span>Generate random code</span>
              </button>
            </div>
            
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md"
              >
                Create Promo Code
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search promo codes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent bg-white/50 backdrop-blur-sm"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-white/50 backdrop-blur-sm text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <i className={filterOption.icon}></i>
              <span>{filterOption.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promo Codes Grid */}
      {filteredPromoCodes.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="bi bi-ticket-perforated text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No promo codes found</h3>
          <p className="text-gray-500">
            {searchTerm ? `No codes matching "${searchTerm}"` : "Create your first promo code to get started"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Clear search →
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromoCodes.map((promo, index) => {
            const expired = isExpired(promo.expires_at);
            const maxReached = isMaxUsageReached(promo);
            const isActive = !expired && !maxReached;
            const discountColor = getDiscountColor(promo.discount_percentage);
            const usagePercentage = promo.max_usage ? (promo.used_count / promo.max_usage) * 100 : 0;
            
            return (
              <div
                key={promo.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden animate-fade-in-up border border-gray-100"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Header */}
                <div className={`bg-gradient-to-r ${discountColor} p-5 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-ticket-perforated-fill text-white text-2xl"></i>
                        <span className="text-white/90 text-xs font-mono">#{promo.id}</span>
                      </div>
                      <button
                        onClick={() => handleDelete(promo.id, promo.code)}
                        className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                      >
                        <i className="bi bi-trash text-lg"></i>
                      </button>
                    </div>
                    <div className="text-center">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 inline-block mb-3">
                        <code className="text-white font-mono font-bold text-xl tracking-wider">
                          {promo.code}
                        </code>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-bold text-white">{promo.discount_percentage}%</span>
                        <span className="text-white/80">OFF</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  {/* Status Badge */}
                  <div className="mb-4">
                    {isActive ? (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm">
                        <i className="bi bi-check-circle-fill text-xs"></i>
                        <span>Active</span>
                      </div>
                    ) : expired ? (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
                        <i className="bi bi-clock-history text-xs"></i>
                        <span>Expired</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-sm">
                        <i className="bi bi-exclamation-triangle-fill text-xs"></i>
                        <span>Max Usage Reached</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Usage Stats */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="bi bi-people"></i>
                        <span className="text-sm">Usage</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-gray-900">{promo.used_count || 0}</span>
                        {promo.max_usage && (
                          <span className="text-sm text-gray-500"> / {promo.max_usage}</span>
                        )}
                      </div>
                    </div>
                    
                    {promo.max_usage && (
                      <div className="space-y-1">
                        <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`bg-gradient-to-r ${discountColor} h-full rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min(100, usagePercentage)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right">
                          {Math.round(usagePercentage)}% used
                        </p>
                      </div>
                    )}
                    
                    {/* Expiration */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <i className="bi bi-calendar3"></i>
                        <span className="text-sm">Expires</span>
                      </div>
                      <div className="text-right">
                        {promo.expires_at ? (
                          <span className={expired ? 'text-red-600' : 'text-gray-900'}>
                            {new Date(promo.expires_at).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-500">Never</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(promo.code);
                        showNotification('Code copied to clipboard!', 'success');
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                    >
                      <i className="bi bi-clipboard"></i>
                      <span>Copy Code</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Summary Footer */}
      {filteredPromoCodes.length > 0 && (
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <i className="bi bi-ticket-perforated text-gray-600"></i>
              <span className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredPromoCodes.length}</span> of <span className="font-semibold text-gray-900">{promoCodes.length}</span> codes
              </span>
            </div>
            <div className="flex gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <i className="bi bi-check-circle text-emerald-500"></i>
                <span>Active: {promoCodes.filter(p => !isExpired(p.expires_at) && !isMaxUsageReached(p)).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="bi bi-clock-history text-red-500"></i>
                <span>Expired: {promoCodes.filter(p => isExpired(p.expires_at)).length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromoCodes;