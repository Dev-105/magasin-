import api from './axios';

export const authAPI = {
  register: (data) => api.post('/register', data),
  
  login: (data) => api.post('/login', data),
  
  logout: () => api.post('/logout'),
  
  refresh: () => api.post('/refresh'),
  
  getMe: () => api.get('/me'),
  
  getProfile: () => api.get('/profile'),
  
  updateProfile: (data) => api.put('/profile', data),
  
  uploadProfileImage: (file) => {
    const formData = new FormData();
    formData.append('profile_image', file);
    return api.post('/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getFidelityPoints: () => api.get('/fidelity-points'),
};