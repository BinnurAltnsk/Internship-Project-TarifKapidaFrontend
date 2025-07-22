import api from './api';

export const favoriteService = {
  // Favorilere ekle
  addToFavorites: (data) => api.post('/api/Favorite/AddToFavorites', null, { params: data }),
  
  // Favorilerden çıkar
  removeFromFavorites: (data) => api.post('/api/Favorite/RemoveFromFavorites', null, { params: data }),
  
  // Kullanıcının favorilerini getir
  getUserFavorites: (userId) => api.get(`/api/Favorite/GetUserFavorites/${userId}`),
  
  // Favori olup olmadığını kontrol et
  isFavorite: (data) => api.get('/api/Favorite/IsFavorite', { params: data }),
  
  // Favori durumunu değiştir
  toggleFavorite: (data) => api.post('/api/Favorite/ToggleFavorite', data),
  
  // Kullanıcının favorilerinde ara
  searchUserFavorites: (query) => api.get('/api/Favorite/SearchUserFavorites', { params: { query } }),
}; 