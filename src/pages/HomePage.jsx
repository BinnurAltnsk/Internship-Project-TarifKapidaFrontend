import React, { useEffect, useState } from "react";
import axios from "axios";
import RecipeList from "../components/Recipe/RecipeList";

const HomePage = ({ user, searchTerm = "", selectedCategory = "" }) => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");
  const token = localStorage.getItem("token");

  // Tüm tarifleri getir
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/Recipe/GetRecipes`);
        setRecipes(res.data);
      } catch (err) {
        console.error("Tarifler yüklenemedi:", err);
        // Hata durumunda örnek veriler göster
        setRecipes([
          {
            recipeId: 1,
            recipeName: "Fırında Tavuk",
            description: "Fırında baharatlı ve sebzeli tavuk tarifi.",
            category: "Ana Yemek",
            cookingTime: "45",
            difficulty: "Orta",
            rating: 4.5,
            imageUrl: null
          },
          {
            recipeId: 2,
            recipeName: "Mercimek Çorbası",
            description: "Geleneksel Türk mutfağının vazgeçilmez çorbası.",
            category: "Çorba",
            cookingTime: "30",
            difficulty: "Kolay",
            rating: 4.8,
            imageUrl: null
          },
          {
            recipeId: 3,
            recipeName: "Tiramisu",
            description: "İtalyan mutfağının meşhur tatlısı.",
            category: "Tatlı",
            cookingTime: "20",
            difficulty: "Orta",
            rating: 4.6,
            imageUrl: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Favori tarifleri getir
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.userId || !token) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/Favorite/GetFavoritesByUserId/${user.userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFavorites(res.data);
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // Favoriye ekle
  const addToFavorites = async (recipeId) => {
    if (!user) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/Favorite/AddToFavorites`,
        { userId: user.userId, recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites([...favorites, { recipeId }]);
    } catch (err) {
      console.error("Favoriye eklenemedi:", err);
    }
  };

  // Favoriden çıkar
  const removeFromFavorites = async (recipeId) => {
    if (!user) return;
    try {
      await axios.post(
        `${API_BASE_URL}/api/Favorite/RemoveFromFavorites`,
        { userId: user.userId, recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter((fav) => fav.recipeId !== recipeId));
    } catch (err) {
      console.error("Favoriden çıkarılamadı:", err);
    }
  };

  // Tarifleri filtrele (arama ve kategoriye göre)
  const filteredRecipes = recipes.filter((recipe) => {
    const nameMatch = recipe.recipeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = selectedCategory ? recipe.category === selectedCategory : true;
    return nameMatch && categoryMatch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <RecipeList
        recipes={filteredRecipes}
        favorites={favorites}
        onAddFavorite={addToFavorites}
        onRemoveFavorite={removeFromFavorites}
        user={user}
      />
    </div>
  );
};

export default HomePage;
