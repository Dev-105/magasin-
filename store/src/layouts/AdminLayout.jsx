// AdminLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
    { path: '/admin/tags', label: 'Tags', icon: 'bi-tags' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-truck' },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: 'bi-ticket-perforated' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#0a0a0a]">
      <Navbar />
      <div className="flex relative">
        {/* Desktop Sidebar - Hidden on mobile */}
        <aside
          className={`hidden lg:block z-40 w-72 bg-black/80 backdrop-blur-xl border-r border-[#D4AF37]/20 shadow-2xl min-h-screen transition-all duration-300`}
        >
          <div className="flex flex-col h-screen">

            {/* Navigation */}
            <nav className="mt-6 px-3 space-y-2">
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                      ${isActive 
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                        : 'text-gray-300 hover:bg-white/5 hover:text-[#D4AF37]'
                      }
                    `}
                  >
                    <i className={`${link.icon} text-xl ${isActive ? 'text-black' : ''}`}></i>
                    <span className="ml-3 font-medium">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile Navigation - Bottom Left Button with Floating Menu */}
        {isMobile && (
          <div className="lg:hidden fixed z-50" style={{ bottom: '24px', left: '24px' }}>
            {/* Floating Menu - Shows above the button when menuOpen is true */}
            {menuOpen && (
              <div className="absolute bottom-16 left-0 mb-2 bg-black/90 backdrop-blur-xl rounded-2xl border border-[#D4AF37]/20 shadow-2xl p-2 min-w-[200px] animate-fade-in-up">
                <div className="flex flex-col space-y-1">
                  {adminLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`
                          flex items-center px-4 py-3 rounded-xl transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-[#D4AF37]'
                          }
                        `}
                      >
                        <i className={`${link.icon} text-xl ${isActive ? 'text-black' : ''}`}></i>
                        <span className="ml-3 font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Main Button - Left Bottom */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black p-4 rounded-full shadow-2xl hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-grid-3x3-gap-fill'} text-xl font-bold`}></i>
            </button>
          </div>
        )}

        {/* Overlay to close menu when clicking outside */}
        {isMobile && menuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setMenuOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 transition-all duration-300">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8 border border-[#D4AF37]/20">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;