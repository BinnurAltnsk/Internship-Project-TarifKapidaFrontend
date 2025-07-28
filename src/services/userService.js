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
  
  // UserProfile API'leri
  
  // UserProfile'ı getir
  getUserProfile: (userId) => api.get(`/api/UserProfile/GetUserProfile/${userId}`),
  
  // UserProfile'ı güncelle
  updateUserProfile: (userProfileData) => api.put('/api/UserProfile/UpdateUserProfile', userProfileData),
  
  // UserProfile oluştur
  createUserProfile: (userProfileData) => api.post('/api/UserProfile/CreateUserProfile', userProfileData),
  
  // Profil fotoğrafı yükle
  uploadProfilePhoto: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    return api.post('/api/UserProfile/UploadProfilePhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Profil fotoğrafını getir
  getProfilePhoto: (userId) => api.get(`/api/UserProfile/GetProfilePhoto/${userId}`),
  
  // Profil fotoğrafını sil
  deleteProfilePhoto: (userId) => api.delete(`/api/UserProfile/DeleteProfilePhoto/${userId}`),
}; 