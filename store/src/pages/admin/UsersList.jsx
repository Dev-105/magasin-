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
    { value: 'all', label: 'All Users', icon: 'bi-people', color: 'gray' },
    { value: 'admin', label: 'Admins', icon: 'bi-shield-lock', color: 'purple' },
    { value: 'user', label: 'Regular Users', icon: 'bi-person', color: 'blue' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-people text-gray-600 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-gray-500 mt-1">Manage and monitor your customers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
          <i className="bi bi-people text-3xl text-gray-600 mb-2 block"></i>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
          <i className="bi bi-shield-lock text-3xl text-purple-600 mb-2 block"></i>
          <p className="text-3xl font-bold text-gray-900">{stats.admins}</p>
          <p className="text-sm text-gray-500">Administrators</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
          <i className="bi bi-person text-3xl text-blue-600 mb-2 block"></i>
          <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
          <p className="text-sm text-gray-500">Regular Users</p>
        </div>
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5 text-center border border-gray-100 shadow-sm">
          <i className="bi bi-gem text-3xl text-amber-600 mb-2 block"></i>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPoints.toLocaleString()}</p>
          <p className="text-sm text-gray-500">Total Fidelity Points</p>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-3">
        {roleTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterRole(tab.value)}
            className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
              filterRole === tab.value
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white/50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <i className={tab.icon}></i>
            {tab.label}
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              filterRole === tab.value
                ? 'bg-white/20 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}>
              {tab.value === 'all' ? stats.total : stats[tab.value + 's']}
            </span>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Users Table/Card Hybrid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Fidelity Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <i className="bi bi-people text-5xl text-gray-300 mb-3 block"></i>
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200 group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                          user.role === 'admin' 
                            ? 'bg-gradient-to-br from-purple-600 to-purple-500' 
                            : 'bg-gradient-to-br from-gray-700 to-gray-600'
                        }`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingRole === user.id}
                        className={`px-3 py-1.5 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all cursor-pointer ${
                          user.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        <option value="user">👤 Regular User</option>
                        <option value="admin">🛡️ Administrator</option>
                      </select>
                      {updatingRole === user.id && (
                        <span className="ml-2 inline-block animate-spin text-xs">
                          <i className="bi bi-arrow-repeat"></i>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <i className="bi bi-gem text-amber-500"></i>
                        <span className="font-semibold text-gray-900">{user.fidelity_points || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deletingUser === user.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 disabled:opacity-50"
                        title="Delete User"
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

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <i className="bi bi-people text-5xl text-gray-300 mb-3 block"></i>
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-5 hover:bg-gray-50/50 transition-colors duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${
                      user.role === 'admin' 
                        ? 'bg-gradient-to-br from-purple-600 to-purple-500' 
                        : 'bg-gradient-to-br from-gray-700 to-gray-600'
                    }`}>
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={deletingUser === user.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600"
                  >
                    {deletingUser === user.id ? (
                      <i className="bi bi-arrow-repeat animate-spin"></i>
                    ) : (
                      <i className="bi bi-trash3 text-lg"></i>
                    )}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={updatingRole === user.id}
                      className={`w-full px-3 py-1.5 rounded-xl text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-gray-800 ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      <option value="user">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fidelity Points</p>
                    <div className="flex items-center gap-2">
                      <i className="bi bi-gem text-amber-500"></i>
                      <span className="font-semibold text-gray-900">{user.fidelity_points || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-400">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Section */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            const csv = filteredUsers.map(u => `${u.id},${u.username},${u.email},${u.role},${u.fidelity_points}`).join('\n');
            const blob = new Blob([`ID,Username,Email,Role,Points\n${csv}`], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'users_export.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-5 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
        >
          <i className="bi bi-download"></i>
          Export to CSV
        </button>
      </div>
    </div>
  );
};

export default AdminUsersList;