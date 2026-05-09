import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AdminLayout = () => {
  const location = useLocation();

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
    { path: '/admin/products', label: 'Products', icon: 'bi-box-seam' },
    { path: '/admin/tags', label: 'Tags', icon: 'bi-tags' },
    { path: '/admin/users', label: 'Users', icon: 'bi-people' },
    { path: '/admin/orders', label: 'Orders', icon: 'bi-truck' },
    { path: '/admin/promo-codes', label: 'Promo Codes', icon: 'bi-ticket-perforated' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen">
          <nav className="mt-8">
            {adminLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition ${
                  location.pathname === link.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <i className={`${link.icon} mr-3`}></i>
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;