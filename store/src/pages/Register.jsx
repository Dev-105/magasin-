// Register.jsx
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#0a0a0a] to-black py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration - Royal Gold */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#D4AF37]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative w-full max-w-2xl">
        <div className="bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-[#D4AF37]/30">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-xl shadow-[#D4AF37]/30 mb-4">
              <i className="bi bi-crown-fill text-black text-3xl"></i>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
              Join the Royalty
            </h2>
            <p className="text-gray-400 mt-2 text-sm">Create your account and access exclusive privileges</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">Username *</label>
                <div className="relative group">
                  <i className="bi bi-person absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="johndoe"
                    required
                  />
                </div>
                {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">Email *</label>
                <div className="relative group">
                  <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">Password *</label>
                <div className="relative group">
                  <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password[0]}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">Confirm Password *</label>
                <div className="relative group">
                  <i className="bi bi-lock-fill absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="password"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">Phone</label>
                <div className="relative group">
                  <i className="bi bi-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#D4AF37] block">City</label>
                <div className="relative group">
                  <i className="bi bi-geo-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                    placeholder="Casablanca"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#D4AF37] block">Address</label>
              <div className="relative group">
                <i className="bi bi-house-door absolute left-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37]/50 group-focus-within:text-[#D4AF37] transition-colors"></i>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-black/60 border-2 border-[#D4AF37]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all duration-300 text-white placeholder:text-gray-500"
                  placeholder="123 Royal Avenue, Suite 4B"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black py-3 rounded-xl font-bold hover:shadow-xl hover:shadow-[#D4AF37]/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 min-h-[52px] text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                  <span>Creating Royal Account...</span>
                </div>
              ) : (
                'Join the Royalty'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have a royal account?{' '}
              <Link to="/login" className="text-[#D4AF37] font-bold hover:text-[#FFD700] transition-colors">
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