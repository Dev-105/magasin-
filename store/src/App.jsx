import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MusicProvider } from './contexts/MusicContext';
import ProtectedRoute from './components/ProtectedRoute';
import MusicPrompt from './components/MusicPrompt';
import MusicControl from './components/MusicControl';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsersList from './pages/admin/UsersList';
import AdminOrdersList from './pages/admin/OrdersList';
import AdminPromoCodes from './pages/admin/PromoCodes';
import AdminProductsList from './pages/admin/ProductsList';
import AdminTags from './pages/admin/Tags';

function App() {
  return (
    <Router>
      <AuthProvider>
        <MusicProvider>
          {/* Music Components - Global */}
          <MusicPrompt />
          <MusicControl />
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
            
            {/* User Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
            </Route>
            
            {/* Protected User Routes */}
            <Route element={<UserLayout />}>
              <Route path="/cart" element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsersList />} />
              <Route path="orders" element={<AdminOrdersList />} />
              <Route path="products" element={<AdminProductsList />} />
              <Route path="tags" element={<AdminTags />} />
              <Route path="promo-codes" element={<AdminPromoCodes />} />
            </Route>
          </Routes>
        </MusicProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;