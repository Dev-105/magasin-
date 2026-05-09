import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    city: '',
    address: '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [updating, setUpdating] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        setProfile(response.data.data);
        setFormData({
          username: response.data.data.username,
          email: response.data.data.email,
          phone: response.data.data.phone || '',
          city: response.data.data.city || '',
          address: response.data.data.address || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage('');
    setError('');
    try {
      const response = await authAPI.updateProfile(formData);
      if (response.data.success) {
        setMessage('Profile updated successfully');
        updateUser(response.data.user);
        setEditing(false);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    }
    setUpdating(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setUpdatingPassword(true);
    setMessage('');
    setError('');
    try {
      const response = await authAPI.updateProfile(passwordData);
      if (response.data.success) {
        setMessage('Password updated successfully');
        setPasswordData({
          current_password: '',
          new_password: '',
          new_password_confirmation: '',
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Password update failed');
    }
    setUpdatingPassword(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedImage(file);
    const formData = new FormData();
    formData.append('profile_image', file);
    
    try {
      const response = await authAPI.uploadProfileImage(file);
      if (response.data.success) {
        setMessage('Profile image updated');
        fetchProfile();
      }
    } catch (error) {
      setError('Image upload failed');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Image */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          {profile?.profile_image ? (
            <img 
              src={profile.profile_image} 
              alt={profile.username}
              className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-person text-5xl text-gray-400"></i>
            </div>
          )}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="text-blue-600 hover:underline">Change Photo</span>
          </label>
          
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">Fidelity Points</p>
            <p className="text-2xl font-bold text-blue-600">{profile?.fidelity_points || 0}</p>
          </div>
        </div>
        
        {/* Profile Info */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Personal Information</h2>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="text-blue-600 hover:underline"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {editing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Address</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    rows="3"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
              <p><strong>Phone:</strong> {profile?.phone || 'Not set'}</p>
              <p><strong>City:</strong> {profile?.city || 'Not set'}</p>
              <p><strong>Address:</strong> {profile?.address || 'Not set'}</p>
              <p><strong>Member since:</strong> {new Date(profile?.created_at).toLocaleDateString()}</p>
            </div>
          )}
          
          {/* Change Password Form */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Change Password</h3>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.new_password_confirmation}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={updatingPassword}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {updatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      {profile && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Your Activity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{profile.total_orders || 0}</p>
              <p className="text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${profile.total_spent || 0}</p>
              <p className="text-gray-600">Total Spent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{profile.likes_count || 0}</p>
              <p className="text-gray-600">Liked Products</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{profile.reviews?.length || 0}</p>
              <p className="text-gray-600">Reviews</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Liked Products */}
      {profile?.likes && profile.likes.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Liked Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {profile.likes.map((like) => (
              <div key={like.id} className="text-center group cursor-pointer" onClick={() => navigate(`/products/${like.product_id}`)}>
                {like.product?.images && like.product.images[0] ? (
                  <img 
                    src={like.product.images[0].image_url || like.product.images[0]} 
                    alt={like.product.title}
                    className="w-full h-32 object-cover rounded shadow-sm group-hover:shadow-md transition"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                    <i className="bi bi-image text-gray-400"></i>
                  </div>
                )}
                <p className="mt-2 text-xs font-semibold text-gray-800 truncate">{like.product?.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;