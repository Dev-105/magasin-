// UserLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

const UserLayout = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userLinks = [
    { path: '/profile', label: 'My Profile', icon: 'bi-person-circle' },
    { path: '/orders', label: 'My Orders', icon: 'bi-receipt' },
    { path: '/cart', label: 'My Cart', icon: 'bi-cart' },
    { path: '/favorites', label: 'Favorites', icon: 'bi-heart' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-black">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar for User */}
          <aside className="lg:w-80">
            <div className="sticky top-24">
              {/* User Card - Gold Accent */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-6 border border-[#D4AF37]/20 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full flex items-center justify-center shadow-xl shadow-[#D4AF37]/30">
                    <i className="bi bi-crown-fill text-black text-3xl"></i>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FFD700]">
                    Royal Member
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Your exclusive dashboard</p>
                </div>
              </div>

              {/* Navigation Links - Gold Hover */}
              <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-4 border border-[#D4AF37]/20">
                <nav className="space-y-2">
                  {userLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          flex items-center px-4 py-3 rounded-xl transition-all duration-300
                          ${isActive 
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-lg shadow-[#D4AF37]/30' 
                            : 'text-gray-300 hover:bg-white/5 hover:text-[#D4AF37]'
                          }
                        `}
                      >
                        <i className={`${link.icon} text-xl ${isActive ? 'text-black' : ''}`}></i>
                        <span className="ml-3 font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-black/40 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8 border border-[#D4AF37]/20">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/60 backdrop-blur-md border-t border-[#D4AF37]/20 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400 text-sm tracking-wide">
            © 2024 <span className="text-[#D4AF37] font-semibold">RFIFISA</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;