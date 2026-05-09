import api from './axios';

export const adminAPI = {
  // createProduct: (data) => {
  //   const formData = new FormData();
    
  //   // Add all text fields
  //   formData.append('title', data.title);
  //   formData.append('description', data.description);
  //   formData.append('price', data.price);
  //   formData.append('stock', data.stock);
  //   formData.append('theme', data.theme);
    
  //   if (data.discount_percentage && data.discount_percentage > 0) {
  //     formData.append('discount_percentage', data.discount_percentage);
  //   }
    
  //   // Add tags
  //   if (data.tags && data.tags.length > 0) {
  //     data.tags.forEach(tag => {
  //       formData.append('tags[]', tag);
  //     });
  //   }
    
  //   // CRITICAL FIX: Add images one by one with proper field name
  //   if (data.images && data.images.length > 0) {
  //     data.images.forEach((image, index) => {
  //       // Make sure it's a File object
  //       if (image instanceof File) {
  //         console.log(`Adding image ${index}:`, image.name, image.type, image.size);
  //         formData.append(`images[]`, image);
  //       } else {
  //         console.error(`Image ${index} is not a File object:`, image);
  //       }
  //     });
  //   }
    
  //   // Debug: Log all FormData entries
  //   console.log('=== FormData being sent ===');
  //   for (let pair of formData.entries()) {
  //     if (pair[1] instanceof File) {
  //       console.log(pair[0], 'FILE:', pair[1].name, pair[1].type, pair[1].size);
  //     } else {
  //       console.log(pair[0], pair[1]);
  //     }
  //   }
    
  //   return api.post('/products', formData);
  // },
  createProduct: (data) => {
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price);
  formData.append('stock', data.stock);
  formData.append('theme', data.theme);
  
  if (data.discount_percentage && data.discount_percentage > 0) {
    formData.append('discount_percentage', data.discount_percentage);
  }
  
  if (data.tags && data.tags.length > 0) {
    data.tags.forEach(tag => formData.append('tags[]', tag));
  }
  
  if (data.images && data.images.length > 0) {
    data.images.forEach(image => formData.append('images[]', image));
  }
  
  return api.post('/products', formData);
},
  // Rest of your adminAPI remains the same...
  updateProduct: (id, data) => {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('theme', data.theme);
    
    if (data.discount_percentage && data.discount_percentage > 0) {
      formData.append('discount_percentage', data.discount_percentage);
    }
    
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach(tag => {
        formData.append('tags[]', tag);
      });
    }
    
    return api.post(`/products/${id}`, formData);
  },
  
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addProductImage: (productId, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post(`/products/${productId}/images`, formData);
  },
  deleteProductImage: (imageId) => api.delete(`/products/images/${imageId}`),
  getAllOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getDashboardStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllPromoCodes: () => api.get('/admin/promo-codes'),
  createPromoCode: (data) => api.post('/admin/promo-codes', data),
  deletePromoCode: (id) => api.delete(`/admin/promo-codes/${id}`),
  getAllTags: () => api.get('/tags'),
  createTag: (data) => api.post('/admin/tags', data),
  deleteTag: (id) => api.delete(`/admin/tags/${id}`),
};