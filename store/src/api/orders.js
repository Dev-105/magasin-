import api from './axios';

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  
  getById: (id) => api.get(`/orders/${id}`),
  
  create: (promoCode = null) => api.post('/orders', promoCode ? { promo_code: promoCode } : {}),
  
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  
  verifyPromoCode: (code) => api.post('/promo-codes/verify', { code }),
};