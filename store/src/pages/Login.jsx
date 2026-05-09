import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
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
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <i className="bi bi-box-seam text-5xl text-gray-800 mb-3 block"></i>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Email Address</label>
              <div className="relative group">
                <i className="bi bi-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">Password</label>
              <div className="relative group">
                <i className="bi bi-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-600 transition-colors"></i>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-2xl font-medium hover:bg-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <i className="bi bi-arrow-repeat animate-spin"></i>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-gray-900 font-semibold hover:text-gray-700 transition-colors">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;