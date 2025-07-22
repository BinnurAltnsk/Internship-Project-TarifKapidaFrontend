import api from './api';

export const recipeService = {
  // Tüm tarifleri getir
  getRecipes: () => api.get('/api/Recipe/GetRecipes'),
  
  // Tarif detayını getir
  getRecipeById: (recipeId) => api.get(`/api/Recipe/GetRecipeById/${recipeId}`),
  
  // Tarif ara
  searchRecipes: (query) => api.get(`/api/Recipe/SearchRecipes?query=${query}`),
  
  // Kullanıcının tariflerini getir
  getRecipesByUserId: (userId) => api.get(`/api/Recipe/GetRecipesByUserId/${userId}`),
  
  // Yeni tarif oluştur
  createRecipe: (recipeData) => api.post('/api/Recipe/CreateRecipe', recipeData),
  
  // Tarif güncelle
  updateRecipe: (recipeData) => api.put('/api/Recipe/UpdateRecipe', recipeData),
  
  // Tarif sil
  deleteRecipe: (recipeId) => api.post(`/api/Recipe/DeleteRecipe/${recipeId}`),
}; 