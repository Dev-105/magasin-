import api from './axios';

export const productsAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  
  getById: (id) => api.get(`/products/${id}`),
  
  getByTheme: (theme) => api.get(`/products/theme/${theme}`),
  
  getByTag: (tagName) => api.get(`/products/tag/${tagName}`),
  
  toggleLike: (productId) => api.post(`/likes/${productId}`),
  
  getLikes: () => api.get('/likes'),
  
  addReview: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};