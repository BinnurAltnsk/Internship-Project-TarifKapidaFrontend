import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { reviewService } from "./services/reviewService";
import RecipeCard from "./components/Recipe/RecipeCard";
import RecipeDetailModal from "./components/Recipe/RecipeDetailModal";

const tabs = [
  { key: "profile", label: "Profil" },
  { key: "recipes", label: "Tarif Defteri" },
  { key: "comments", label: "Yorumlarım" },
];

export default function ProfilePage({ user, favorites, recipes, onFavoriteClick }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [userComments, setUserComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.recipeId));

  useEffect(() => {
    if (user?.userId) {
      loadUserComments();
    }
  }, [user]);

  const loadUserComments = async () => {
    try {
      setLoadingComments(true);
      const response = await reviewService.getReviews();
      // Kullanıcının yorumlarını filtrele
      const userReviews = response.data.filter(review => review.userId === user.userId);
      setUserComments(userReviews);
    } catch (error) {
      console.error("Kullanıcı yorumları yüklenemedi:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const handleCloseModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="profile-root">
      <div className="profile-cover">
        <button className="profile-photo-btn" onClick={() => alert("Fotoğraf ekleme yakında!")}>📷 Fotoğraf Ekle</button>
      </div>

      <div className="profile-main">
        <div className="profile-avatar">
          <span role="img" aria-label="avatar" style={{ fontSize: 64 }}>
            👤
          </span>
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.username || "Kullanıcı"}</div>
          <div className="profile-username">@{user?.username || "kullanici"}</div>
        </div>
        <button className="profile-edit-btn" onClick={() => alert("Profil düzenleme yakında!")}>Profili Düzenle</button>
      </div>

      <div className="profile-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "profile-tab active" : "profile-tab"}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="profile-tab-content">
        {activeTab === "profile" && (
          <div>
            <h3>Hoş geldin, {user?.username || "Kullanıcı"}!</h3>
            <p>Burada profil bilgilerini ve ayarlarını görebilirsin.</p>
            <div style={{ marginTop: 20 }}>
              <p><strong>E-posta:</strong> {user?.email || "Belirtilmemiş"}</p>
              <p><strong>Kullanıcı ID:</strong> {user?.userId || "Belirtilmemiş"}</p>
            </div>
          </div>
        )}

        {activeTab === "recipes" && (
          <div>
            <h3>Favori Tariflerin ({favoriteRecipes.length})</h3>
            <div className="recipe-grid">
              {favoriteRecipes.length === 0 ? (
                <div>Henüz favori tarifin yok.</div>
              ) : (
                favoriteRecipes.map((r) => (
                  <RecipeCard
                    key={r.recipeId}
                    title={r.recipeName}
                    imageUrl={r.recipeImageUrl}
                    calories={r.calories}
                    prepTime={r.prepTime}
                    ingredients={r.ingredients}
                    recipeInstructions={r.recipeInstructions}
                    isVegetarian={r.isVegetarian}
                    onClick={() => handleRecipeClick(r)}
                    isFavorite={favorites.includes(r.recipeId)}
                    onFavoriteClick={() => onFavoriteClick(r.recipeId)}
                    user={user}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div>
            <h3>Yorumlarım ({userComments.length})</h3>
            {loadingComments ? (
              <p>Yorumlar yükleniyor...</p>
            ) : userComments.length === 0 ? (
              <p>Henüz yorum yapmadınız.</p>
            ) : (
              <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                {userComments.map((comment) => {
                  // Yorumun ait olduğu tarifi bul
                  const recipe = recipes.find(r => r.recipeId === comment.recipeId);
                  const recipeName = recipe ? recipe.recipeName : "Tarif silinmiş";

                  return (
                    <li
                      key={comment.reviewId}
                      style={{ marginBottom: 12, borderBottom: "1px solid #ccc", paddingBottom: 8 }}
                    >
                      <strong>{recipeName}</strong>
                      <p>{comment.reviewText}</p>
                      <small>⭐ {typeof comment.rating === "number" ? `${comment.rating} / 5` : "Puan yok"}</small>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
      
      {/* Tarif Detay Modal */}
      {showRecipeModal && selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          user={user}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
