import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // You can add request logging in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // You can add response logging in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    // Handle specific error statuses
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 422:
          // Validation error
          console.error('Validation Error:', data.errors);
          break;
        case 500:
          console.error('Server Error:', data);
          break;
        default:
          console.error(`Error ${status}:`, data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error: Unable to connect to server');
      if (import.meta.env.DEV) {
        console.error('Please check if your backend server is running at:', API_BASE_URL);
      }
    } else {
      // Something happened in setting up the request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const register = (userData) => api.post('/register', userData);
export const login = (credentials) => api.post('/login', credentials);
export const logout = () => api.post('/logout');

// Product APIs
export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (productData) => api.post('/products', productData);
export const updateProduct = (id, productData) => api.patch(`/products/${id}`, productData);
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const likeProduct = (id) => api.post(`/products/${id}/like`);
export const unlikeProduct = (id) => api.delete(`/products/${id}/like`);
export const getProductReviews = (id, params = {}) => api.get(`/products/${id}/reviews`, { params });
export const createReview = (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData);

// Cart APIs
export const getCart = () => api.get('/cart');
export const addToCart = (cartData) => api.post('/cart', cartData);
export const updateCartItem = (itemId, quantity) => api.patch(`/cart/${itemId}`, { quantity });
export const removeCartItem = (itemId) => api.delete(`/cart/${itemId}`);
export const clearCart = () => api.delete('/cart');

// Order APIs
export const getOrders = (params = {}) => api.get('/orders', { params });
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);

// Tag APIs
export const getTags = () => api.get('/tags');
export const createTag = (tagData) => api.post('/tags', tagData);
export const updateTag = (id, tagData) => api.patch(`/tags/${id}`, tagData);
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// Promo Code APIs
export const getPromoCodes = () => api.get('/promo-codes');
export const createPromoCode = (promoData) => api.post('/promo-codes', promoData);
export const updatePromoCode = (id, promoData) => api.patch(`/promo-codes/${id}`, promoData);
export const deletePromoCode = (id) => api.delete(`/promo-codes/${id}`);

// Utility function to check API health
export const checkApiHealth = async () => {
  try {
    const response = await api.get('/health'); // You'll need to add this endpoint in Laravel
    return response.data;
  } catch (error) {
    console.error('API Health Check Failed:', error);
    return null;
  }
};

export default api;