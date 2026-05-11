// Navbar.jsx
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
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-xl shadow-2xl border-b border-[#D4AF37]/20' 
          : 'bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/10'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo - Luxury Gold */}
            <Link 
              to="/" 
              className="group flex items-center space-x-2 transition-all duration-300 hover:scale-105"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-xl flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                <i className="bi bi-crown-fill text-black text-sm"></i>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent tracking-wide">
                RFIFISA
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2
                    ${location.pathname === link.path 
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-[#D4AF37]'
                    }`}
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}

              {user ? (
                <>
                  {/* Cart Button - Gold Badge */}
                  <Link 
                    to="/cart" 
                    className="relative p-2.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300"
                  >
                    <i className="bi bi-cart text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                      0
                    </span>
                  </Link>

                  {/* Orders */}
                  <Link 
                    to="/orders"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300"
                  >
                    <i className="bi bi-receipt mr-2"></i>
                    Orders
                  </Link>

                  {/* User Dropdown - Royal */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-300">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-md">
                        <i className="bi bi-person-fill text-black text-sm"></i>
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-[#D4AF37] transition-colors">{user.username}</span>
                      <i className="bi bi-chevron-down text-xs text-[#D4AF37]"></i>
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-[#D4AF37]/20">
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">
                          <i className="bi bi-person mr-3"></i> My Profile
                        </Link>
                        <Link to="/favorites" className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">
                          <i className="bi bi-heart mr-3"></i> Favorites
                        </Link>
                        <div className="border-t border-[#D4AF37]/20 my-1"></div>
                        {isAdmin && (
                          <Link to="/admin" className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-colors">
                            <i className="bi bi-shield-lock mr-3"></i> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <i className="bi bi-box-arrow-right mr-3"></i> Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/login" 
                    className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300"
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black hover:shadow-lg hover:shadow-[#D4AF37]/30 transform hover:scale-105 transition-all duration-300 font-bold"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button - Gold */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300"
            >
              <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl text-[#D4AF37]`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Luxury Dark */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-[#D4AF37]/20 animate-fade-in-up">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]"
                >
                  <i className={link.icon}></i>
                  <span>{link.label}</span>
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]">
                    <i className="bi bi-cart"></i> <span>Cart</span>
                  </Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]">
                    <i className="bi bi-receipt"></i> <span>Orders</span>
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]">
                    <i className="bi bi-person"></i> <span>Profile</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center space-x-3 px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]">
                      <i className="bi bi-shield-lock"></i> <span>Admin</span>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-300 min-h-[48px]">
                    <i className="bi bi-box-arrow-right"></i> <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3.5 rounded-xl text-gray-300 hover:bg-white/5 hover:text-[#D4AF37] transition-all duration-300 min-h-[48px]">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block text-center px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold hover:shadow-lg transition-all duration-300 min-h-[48px]">
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