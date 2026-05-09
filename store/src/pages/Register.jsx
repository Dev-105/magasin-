import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    city: '',
    address: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else if (result.errors) {
      setErrors(result.errors);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-300 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <div className="relative w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <i className="bi bi-person-plus text-5xl text-gray-800 mb-3 block"></i>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Join us and start shopping</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Username *</label>
                <div className="relative group">
                  <i className="bi bi-person absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="johndoe"
                    required
                  />
                </div>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Email *</label>
                <div className="relative group">
                  <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Password *</label>
                <div className="relative group">
                  <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Confirm Password *</label>
                <div className="relative group">
                  <i className="bi bi-lock-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Phone</label>
                <div className="relative group">
                  <i className="bi bi-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">City</label>
                <div className="relative group">
                  <i className="bi bi-geo-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                    placeholder="New York"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Address</label>
              <div className="relative group">
                <i className="bi bi-house-door absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="123 Main St, Apt 4B"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:text-gray-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;