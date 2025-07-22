import api from './api';

export const userService = {
  // Kullanıcı girişi
  login: (credentials) => api.post('/api/User/Login', credentials),
  
  // Kullanıcı kaydı
  register: (userData) => api.post('/api/User/Register', userData),
  
  // Kullanıcı bilgilerini getir
  getUserById: (userId) => api.get(`/api/User/GetUserById/${userId}`),
  
  // Email ile kullanıcı bilgilerini getir
  getUserByEmail: (email) => api.get(`/api/User/GetUserByEmail/${email}`),
  
  // Tüm kullanıcıları getir
  getUsers: () => api.get('/api/User/GetUsers'),
  
  // Kullanıcı güncelle
  updateUser: (userData) => api.put('/api/User/UpdateUser', userData),
  
  // Kullanıcı sil
  deleteUser: (userId) => api.post('/api/User/DeleteUser', { userId }),
}; 