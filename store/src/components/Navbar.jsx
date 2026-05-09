import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-600">
            Store
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition">
              Products
            </Link>

            {user ? (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition">
                  <i className="bi bi-cart"></i> Cart
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition">
                  Orders
                </Link>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition">
                  <i className="bi bi-person"></i> {user.username}
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;