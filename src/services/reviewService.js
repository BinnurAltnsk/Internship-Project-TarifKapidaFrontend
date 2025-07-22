import api from './api';

export const reviewService = {
  // Tüm yorumları getir
  getReviews: () => api.get('/api/Review/GetReviews'),
  
  // Yorum detayını getir
  getReviewById: (reviewId) => api.get(`/api/Review/GetReviewById/${reviewId}`),
  
  // Yeni yorum oluştur
  createReview: (reviewData) => api.post('/api/Review/CreateReview', reviewData),
  
  // Yorum güncelle
  updateReview: (reviewData) => api.put('/api/Review/UpdateReview', reviewData),
  
  // Yorum sil
  deleteReview: (reviewId) => api.post(`/api/Review/DeleteReview/${reviewId}`),
}; 