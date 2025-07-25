import axios from 'axios';

const API_BASE_URL = 'http://localhost:7175';

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

export default api; 