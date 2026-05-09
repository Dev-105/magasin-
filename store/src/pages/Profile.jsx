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
  const [activeTab, setActiveTab] = useState('info');
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
  const [uploadingImage, setUploadingImage] = useState(false);

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
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
      setTimeout(() => setError(''), 3000);
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
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Password update failed');
      setTimeout(() => setError(''), 3000);
    }
    setUpdatingPassword(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setUploadingImage(true);
    try {
      const response = await authAPI.uploadProfileImage(file);
      if (response.data.success) {
        setMessage('Profile image updated successfully');
        fetchProfile();
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setError('Image upload failed');
      setTimeout(() => setError(''), 3000);
    }
    setUploadingImage(false);
  };

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: 'bi-person-circle' },
    { id: 'password', label: 'Security', icon: 'bi-shield-lock' },
    { id: 'activity', label: 'Activity', icon: 'bi-graph-up' },
  ];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="bi bi-person-fill text-gray-900 text-xl animate-pulse"></i>
          </div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
          My Profile
        </h1>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <i className="bi bi-check-circle-fill text-emerald-600"></i>
            <p className="text-emerald-700">{message}</p>
          </div>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fade-in">
          <div className="flex items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill text-red-600"></i>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar - Profile Card */}
        <div className="lg:w-80">
          <div className="sticky top-24 space-y-6">
            {/* Profile Image Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 text-center border border-gray-100">
              <div className="relative inline-block">
                {profile?.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt={profile.username}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mx-auto shadow-xl">
                    <i className="bi bi-person text-5xl text-gray-500"></i>
                  </div>
                )}
                <label className="absolute bottom-0 right-0 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <div className="bg-gray-900 text-white p-2 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer">
                    <i className="bi bi-camera-fill text-sm"></i>
                  </div>
                </label>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">{profile?.username}</h2>
              <p className="text-gray-500 text-sm">{profile?.email}</p>
              
              {uploadingImage && (
                <p className="mt-2 text-xs text-gray-500 animate-pulse">Uploading...</p>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fidelity Points</span>
                  <div className="flex items-center gap-1">
                    <i className="bi bi-star-fill text-amber-500 text-sm"></i>
                    <span className="text-xl font-bold text-gray-900">{profile?.fidelity_points || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Mini Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-2xl shadow-md p-3 text-center border border-gray-100">
                <i className="bi bi-bag-check text-2xl text-gray-700 mb-1 block"></i>
                <p className="text-xl font-bold text-gray-900">{profile?.total_orders || 0}</p>
                <p className="text-xs text-gray-500">Orders</p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-3 text-center border border-gray-100">
                <i className="bi bi-heart-fill text-2xl text-rose-500 mb-1 block"></i>
                <p className="text-xl font-bold text-gray-900">{profile?.likes_count || 0}</p>
                <p className="text-xs text-gray-500">Likes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Tab Navigation */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 mb-6 shadow-sm border border-gray-100">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <i className={tab.icon}></i>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            {/* Personal Info Tab */}
            {activeTab === 'info' && (
              <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                    <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
                  </div>
                  {!editing && (
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200 text-sm font-medium"
                    >
                      <i className="bi bi-pencil"></i>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
                
                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
                        <input
                          type="text"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          placeholder="+1 234 567 890"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                          placeholder="New York"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                        rows="3"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>
                    <div className="flex gap-3 pt-3">
                      <button
                        type="submit"
                        disabled={updating}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md disabled:opacity-50"
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Username</p>
                        <p className="text-gray-900 font-medium">{profile?.username}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                        <p className="text-gray-900 font-medium">{profile?.email}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-gray-900 font-medium">{profile?.phone || 'Not set'}</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">City</p>
                        <p className="text-gray-900 font-medium">{profile?.city || 'Not set'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-gray-900 font-medium">{profile?.address || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {new Date(profile?.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'password' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your password</p>
                </div>
                
                <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.current_password}
                      onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.new_password_confirmation}
                      onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200"
                      required
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md disabled:opacity-50"
                  >
                    {updatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Your Activity</h2>
                  <p className="text-sm text-gray-500 mt-1">Overview of your store activity</p>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                    <i className="bi bi-bag-check text-3xl text-blue-600 mb-2 block"></i>
                    <p className="text-2xl font-bold text-gray-900">{profile?.total_orders || 0}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 text-center">
                    <i className="bi bi-currency-dollar text-3xl text-emerald-600 mb-2 block"></i>
                    <p className="text-2xl font-bold text-gray-900">${profile?.total_spent || 0}</p>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-4 text-center">
                    <i className="bi bi-heart-fill text-3xl text-rose-600 mb-2 block"></i>
                    <p className="text-2xl font-bold text-gray-900">{profile?.likes_count || 0}</p>
                    <p className="text-sm text-gray-600">Liked Products</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-4 text-center">
                    <i className="bi bi-star-fill text-3xl text-amber-600 mb-2 block"></i>
                    <p className="text-2xl font-bold text-gray-900">{profile?.reviews?.length || 0}</p>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                </div>

                {/* Liked Products */}
                {profile?.likes && profile.likes.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <i className="bi bi-heart-fill text-rose-500"></i>
                      <span>Liked Products</span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {profile.likes.slice(0, 8).map((like) => (
                        <div 
                          key={like.id} 
                          className="group cursor-pointer animate-fade-in-up"
                          onClick={() => navigate(`/products/${like.product_id}`)}
                        >
                          {like.product?.images && like.product.images[0] ? (
                            <img 
                              src={like.product.images[0].image_url || like.product.images[0]} 
                              alt={like.product.title}
                              className="w-full h-32 object-cover rounded-xl shadow-sm group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <i className="bi bi-image text-gray-400 text-3xl"></i>
                            </div>
                          )}
                          <p className="mt-2 text-xs font-medium text-gray-800 truncate text-center group-hover:text-gray-900 transition-colors">
                            {like.product?.title}
                          </p>
                        </div>
                      ))}
                    </div>
                    {profile.likes.length > 8 && (
                      <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">+{profile.likes.length - 8} more liked products</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;