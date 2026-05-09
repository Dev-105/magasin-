import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    try {
      const response = await adminAPI.updateUserRole(userId, newRole);
      if (response.data.success) {
        fetchUsers();
      }
    } catch (error) {
      alert('Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await adminAPI.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading users...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Points</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{user.id}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">{user.fidelity_points}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersList;