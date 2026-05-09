import api from './axios';

export const adminAPI = {
  // Products
  createProduct: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key]) && data[key].length > 0) {
        data[key].forEach(image => formData.append('images[]', image));
      } else if (key === 'tags' && Array.isArray(data[key])) {
        data[key].forEach(tag => formData.append('tags[]', tag));
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  updateProduct: (id, data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.keys(data).forEach(key => {
      if (key === 'tags' && Array.isArray(data[key])) {
        data[key].forEach(tag => formData.append('tags[]', tag));
      } else if (key !== 'images') {
        formData.append(key, data[key]);
      }
    });
    return api.post(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  addProductImage: (productId, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post(`/products/${productId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteProductImage: (imageId) => api.delete(`/products/images/${imageId}`),
  
  // Orders (Admin)
  getAllOrders: () => api.get('/admin/orders'),
  
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/stats'),

  // Users (Admin)
  getAllUsers: () => api.get('/admin/users'),
  
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  
  // Promo Codes
  getAllPromoCodes: () => api.get('/admin/promo-codes'),
  
  createPromoCode: (data) => api.post('/admin/promo-codes', data),
  
  deletePromoCode: (id) => api.delete(`/admin/promo-codes/${id}`),

  // Tags
  getAllTags: () => api.get('/tags'),
  createTag: (data) => api.post('/admin/tags', data),
  deleteTag: (id) => api.delete(`/admin/tags/${id}`),
};