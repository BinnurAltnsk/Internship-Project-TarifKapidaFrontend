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
  
  // Profil var mı kontrol et
  profileExists: (userId) => api.get(`/api/UserProfile/ProfileExists/${userId}`),
  
  // Profil fotoğrafı yükle - Backend API'sine uygun
  uploadProfilePhoto: (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    return api.post('/api/UserProfile/UploadUserProfilePhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Profil fotoğrafı yükle - Base64 ile (backend kodlarınıza göre)
  uploadProfilePhotoBase64: (userId, base64Image) => {
    return api.post('/api/UserProfile/UploadUserProfilePhoto', {
      userId: userId,
      ProfileImageUrl: base64Image // Backend kodlarınızdaki UserProfileRequest modeline uygun
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
  
  // Profil fotoğrafını getir
  getProfilePhoto: (userId) => api.get(`/api/UserProfile/GetUserProfilePhoto/${userId}`),
  
  // Profil fotoğrafını sil
  deleteProfilePhoto: (userId) => api.post(`/api/UserProfile/DeleteUserProfilePhoto/${userId}`),
  
  // Bildirim ayarlarını güncelle
  updateNotificationSettings: (settings) => api.put('/api/UserProfile/UpdateNotificationSettings', settings),
  
  // Bildirim ayarlarını getir
  getNotificationSettings: (userId) => api.get(`/api/UserProfile/GetNotificationSettings/${userId}`),
  
  // Sosyal hesap bağla
  linkSocialAccount: (userId, provider, accessToken) => 
    api.get('/api/UserProfile/LinkSocialAccount', {
      params: { userId, provider, accessToken }
    }),
  
  // Bağlı sosyal hesapları getir
  getLinkedSocialAccounts: (userId) => api.get(`/api/UserProfile/GetLinkedSocialAccounts/${userId}`),
  
  getUserProfileByUserId: (userId) => api.get(`/api/UserProfile/GetUserProfile/${userId}`),
}; 