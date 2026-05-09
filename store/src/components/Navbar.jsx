import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/products', label: 'Browse', icon: 'bi-grid-3x3-gap-fill' },
  ];

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-xl' 
          : 'bg-white/80 backdrop-blur-sm shadow-md'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-600 rounded-xl flex items-center justify-center shadow-md">
                <i className="bi bi-bag-fill text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                RFIFISA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2
                    ${location.pathname === link.path 
                      ? 'bg-gray-900 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  {/* Cart Button */}
                  <Link 
                    to="/cart" 
                    className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <i className="bi bi-cart text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      0
                    </span>
                  </Link>

                  {/* Orders */}
                  <Link 
                    to="/orders"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    <i className="bi bi-receipt mr-2"></i>
                    Orders
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-500 rounded-full flex items-center justify-center shadow-md">
                        <i className="bi bi-person-fill text-white text-sm"></i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.username}</span>
                      <i className="bi bi-chevron-down text-xs text-gray-500"></i>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <i className="bi bi-person mr-3"></i> My Profile
                        </Link>
                        <Link to="/favorites" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <i className="bi bi-heart mr-3"></i> Favorites
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                            <i className="bi bi-shield-lock mr-3"></i> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <i className="bi bi-box-arrow-right mr-3"></i> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link 
                    to="/login" 
                    className="px-5 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-5 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl text-gray-700`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-100 animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <i className="bi bi-cart"></i> <span>Cart</span>
                  </Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <i className="bi bi-receipt"></i> <span>Orders</span>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    <i className="bi bi-person"></i> <span>Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                      <i className="bi bi-shield-lock"></i> <span>Admin</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200">
                    <i className="bi bi-box-arrow-right"></i> <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all duration-200">
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;