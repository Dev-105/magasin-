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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for User */}
          <aside className="lg:w-80">
            <div className="sticky top-24">
              {/* User Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-100 mb-6">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                    <i className="bi bi-person-fill text-white text-4xl"></i>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-gray-900">Welcome back!</h3>
                  <p className="text-gray-500 text-sm">Your account dashboard</p>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 border border-gray-100">
                <nav className="space-y-1">
                  {userLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`
                          flex items-center px-4 py-3 rounded-2xl transition-all duration-200
                          ${isActive 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                          }
                        `}
                      >
                        <i className={`${link.icon} text-xl`}></i>
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
            <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 Your Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;