import axios from 'axios';

const API_BASE_URL = 'http://localhost:5043';
localStorage.setItem('API_BASE_URL', API_BASE_URL);

// Axios instance oluştur
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - JWT token ekle
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

// Resim URL'sini düzgün şekilde oluştur
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Eğer zaten tam URL ise, olduğu gibi döndür
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Eğer ./ ile başlıyorsa, API base URL ile birleştir
  if (imagePath.startsWith('./')) {
    return `${API_BASE_URL}/${imagePath.substring(2)}`;
  }
  
  // Eğer sadece dosya adı ise, wwwroot altında olduğunu varsay
  return `${API_BASE_URL}/${imagePath}`;
};

// Profil fotoğrafı URL'sini düzgün şekilde oluştur - Backend yapısına uygun
export const getProfilePhotoUrl = (photoPath) => {
  if (!photoPath) return null;
  
  // Eğer zaten tam URL ise, olduğu gibi döndür
  if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
    return photoPath;
  }
  
  // Base64 formatında ise, doğrudan kullan
  if (photoPath.startsWith('data:image/')) {
    return photoPath;
  }
  
  // Backend'de /images/ProfilePhoto/ şeklinde kaydedildiği için
  if (photoPath.startsWith('/images/ProfilePhoto/')) {
    return `${API_BASE_URL}${photoPath}`;
  }
  
  // Eğer sadece dosya adı ise, /images/ProfilePhoto/ ile birleştir
  if (!photoPath.includes('/')) {
    return `${API_BASE_URL}/images/ProfilePhoto/${photoPath}`;
  }
  
  // Diğer durumlar için API base URL ile birleştir
  return `${API_BASE_URL}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
};

export default api; 