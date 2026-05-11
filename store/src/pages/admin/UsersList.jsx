import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [updatingRole, setUpdatingRole] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      if (response.data.success) {
        setUsers(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingRole(userId);
    try {
      const response = await adminAPI.updateUserRole(userId, newRole);
      if (response.data.success) {
        fetchUsers();
      }
    } catch (error) {
      alert('Failed to update user role');
    }
    setUpdatingRole(null);
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setDeletingUser(userId);
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
      setDeletingUser(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    users: users.filter(u => u.role === 'user').length,
    totalPoints: users.reduce((sum, u) => sum + (u.fidelity_points || 0), 0),
  };

  const roleTabs = [
    { value: 'all', label: 'All Royals', icon: 'bi-people', color: 'gold' },
    { value: 'admin', label: 'Royal Council', icon: 'bi-shield-lock', color: 'purple' },
    { value: 'user', label: 'Royal Subjects', icon: 'bi-person', color: 'blue' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin shadow-lg shadow-[#D4AF37]/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-crown-fill text-[#D4AF37] text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-[#D4AF37] font-medium">Loading royal subjects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <i className="bi bi-people-fill text-black text-lg"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
            Royal Court Management
          </h1>
        </div>
        <p className="text-gray-400 mt-1 ml-13">Manage and monitor your royal subjects</p>
      </div>

      {/* Stats Cards - Royal Gold */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 text-center border border-[#D4AF37]/20 shadow-lg">
          <i className="bi bi-people text-3xl text-[#D4AF37] mb-2 block"></i>
          <p className="text-3xl font-bold text-[#D4AF37]">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Royals</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 text-center border border-[#D4AF37]/20 shadow-lg">
          <i className="bi bi-shield-lock text-3xl text-purple-400 mb-2 block"></i>
          <p className="text-3xl font-bold text-purple-400">{stats.admins}</p>
          <p className="text-sm text-gray-400">Royal Council</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 text-center border border-[#D4AF37]/20 shadow-lg">
          <i className="bi bi-person text-3xl text-blue-400 mb-2 block"></i>
          <p className="text-3xl font-bold text-blue-400">{stats.users}</p>
          <p className="text-sm text-gray-400">Royal Subjects</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-xl p-5 text-center border border-[#D4AF37]/20 shadow-lg">
          <i className="bi bi-gem text-3xl text-[#D4AF37] mb-2 block"></i>
          <p className="text-3xl font-bold text-[#D4AF37]">{stats.totalPoints.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Total Fidelity Gems</p>
        </div>
      </div>

      {/* Role Filter Tabs - Royal Gold */}
      <div className="flex flex-wrap gap-3">
        {roleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterRole(tab.value)}
            className={`px-5 py-2.5 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 min-h-[44px] ${
              filterRole === tab.value
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg'
                : 'bg-black/40 text-gray-400 hover:text-[#D4AF37] hover:bg-white/5 border border-[#D4AF37]/20'
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
              filterRole === tab.value
                ? 'bg-black/20 text-black'
                : 'bg-[#D4AF37]/20 text-[#D4AF37]'
            }`}>
              {tab.value === 'all' ? stats.total : stats[tab.value + 's']}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar - Royal Gold */}
      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50"></i>
        <input
          type="text"
          placeholder="Search by royal name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-black/40 backdrop-blur-md rounded-xl border-2 border-[#D4AF37]/20 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all duration-300 text-white placeholder:text-gray-500"
        />
      </div>

      {/* Users Table/Card Hybrid */}
      <div className="bg-black/40 backdrop-blur-md rounded-xl shadow-xl overflow-hidden border border-[#D4AF37]/20">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black/60 border-b border-[#D4AF37]/20">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#D4AF37]">Royal Subject</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#D4AF37]">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#D4AF37]">Fidelity Gems</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#D4AF37]">Enlisted</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-[#D4AF37]">Royal Decrees</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/10">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <i className="bi bi-people text-5xl text-[#D4AF37]/30 mb-3 block"></i>
                    <p className="text-gray-400">No royal subjects found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/5 transition-all duration-300 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-black shadow-lg ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                            : 'bg-gradient-to-br from-[#D4AF37] to-[#FFD700]'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingRole === user.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        <option value="user">👑 Royal Subject</option>
                        <option value="admin">🛡️ Royal Council Member</option>
                      </select>
                      {updatingRole === user.id && (
                        <span className="ml-2 inline-block animate-spin text-xs text-[#D4AF37]">
                          <i className="bi bi-arrow-repeat"></i>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-gem text-[#D4AF37]"></i>
                        <span className="font-bold text-[#D4AF37]">{user.fidelity_points || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUser === user.id}
                        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50"
                        title="Remove Royal Status"
                      >
                        {deletingUser === user.id ? (
                          <i className="bi bi-arrow-repeat animate-spin"></i>
                        ) : (
                          <i className="bi bi-trash3 text-lg"></i>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Royal Gold */}
        <div className="md:hidden divide-y divide-[#D4AF37]/10">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <i className="bi bi-people text-5xl text-[#D4AF37]/30 mb-3 block"></i>
              <p className="text-gray-400">No royal subjects found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-5 hover:bg-white/5 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-black shadow-lg ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-500 to-purple-600' 
                        : 'bg-gradient-to-br from-[#D4AF37] to-[#FFD700]'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingUser === user.id}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400"
                  >
                    {deletingUser === user.id ? (
                      <i className="bi bi-arrow-repeat animate-spin"></i>
                    ) : (
                      <i className="bi bi-trash3 text-lg"></i>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-[#D4AF37]/20">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Royal Rank</p>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updatingRole === user.id}
                      className={`w-full px-3 py-1.5 rounded-lg text-sm font-bold border focus:outline-none focus:ring-2 focus:ring-[#D4AF37] ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                          : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}
                    >
                      <option value="user">Royal Subject</option>
                      <option value="admin">Royal Council</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fidelity Gems</p>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-gem text-[#D4AF37]"></i>
                      <span className="font-bold text-[#D4AF37]">{user.fidelity_points || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">Enlisted: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Section - Royal Gold */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const csv = filteredUsers.map(u => `${u.id},${u.username},${u.email},${u.role},${u.fidelity_points}`).join('\n');
            const blob = new Blob([`ID,Username,Email,Role,Points\n${csv}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'royal_subjects_export.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-black/40 backdrop-blur-md rounded-xl text-[#D4AF37] hover:bg-white/5 transition-all duration-300 border border-[#D4AF37]/30 font-bold min-h-[44px]"
        >
          <i className="bi bi-download"></i>
          Export Royal Registry
        </button>
      </div>
    </div>
  );
};

export default AdminUsersList;