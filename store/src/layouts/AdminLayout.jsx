import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useState } from 'react';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
    { path: '/admin/tags', label: 'Tags', icon: 'bi-tags' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-truck' },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: 'bi-ticket-perforated' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex relative">
        {/* Sidebar Toggle Button (Mobile) */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <i className={`bi ${sidebarOpen ? 'bi-x-lg' : 'bi-list'} text-xl`}></i>
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed lg:relative z-40 w-72 bg-white/95 backdrop-blur-sm shadow-2xl min-h-screen transition-all duration-300 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'
          }`}
        >
          <div className="flex flex-col h-screen ">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-100">
              <div className={`flex items-center ${!sidebarOpen && 'lg:justify-center'}`}>
                <i className="bi bi-shield-lock-fill text-2xl text-gray-900"></i>
                {sidebarOpen && (
                  <span className="ml-3 font-semibold text-gray-900 text-lg lg:inline hidden">
                    Admin Panel
                  </span>
                )}
              </div>
            </div>

            {/* Navigation */}
            <nav className="mt-2 px-3 space-y-1">
              {adminLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`
                      flex items-center px-4 py-3 rounded-2xl transition-all duration-200 group
                      ${isActive 
                        ? 'bg-gray-900 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                      ${!sidebarOpen && 'lg:justify-center'}
                    `}
                    title={!sidebarOpen ? link.label : ''}
                  >
                    <i className={`${link.icon} text-xl ${!sidebarOpen && 'lg:text-2xl'}`}></i>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium lg:inline hidden">
                        {link.label}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer removed per request */}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 transition-all duration-300">
          <div className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;