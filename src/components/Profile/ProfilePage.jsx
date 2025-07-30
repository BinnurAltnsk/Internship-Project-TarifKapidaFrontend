import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { reviewService } from "../../services/reviewService";
import { userService } from "../../services/userService";
import { getProfilePhotoUrl } from "../../services/api";
import RecipeCard from "../Recipe/RecipeCard";
import RecipeDetailModal from "../Recipe/RecipeDetailModal";
import ProfileEditModal from "./ProfileEditModal";

const tabs = [
  { key: "profile", label: "Profil" },
  { key: "favorites", label: "Favoriler" },
  { key: "comments", label: "Yorumlarım" },
];

export default function ProfilePage({ user, favorites, recipes, onFavoriteClick }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [userComments, setUserComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      loadUserProfile();
      loadUserComments();
    }
  }, [user]);

  useEffect(() => {
    if (userProfile?.profileImageUrl) {
      const photoUrl = getProfilePhotoUrl(userProfile.profileImageUrl);
      setProfilePhoto(photoUrl);
    }
  }, [userProfile]);

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      
      // Profil var mı kontrol et
      const existsResponse = await userService.profileExists(user.userId);
      
      if (existsResponse.data) {
        // Profil varsa getir
        const response = await userService.getUserProfile(user.userId);
        if (response.data) {
          setUserProfile(response.data);
        }
      } else {
        // Profil yoksa oluştur
        await createUserProfile();
      }
    } catch (error) {
      console.error("Profil yükleme hatası:", error);
      // Hata durumunda yeni profil oluşturmayı dene
      try {
        await createUserProfile();
      } catch (createError) {
        console.error("Profil oluşturma hatası:", createError);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

  // Yeni profil oluştur
  const createUserProfile = async () => {
    try {
      const newProfile = {
        userId: user.userId,
        username: user.username,
        email: user.email,
        profileImageUrl: null,
        bio: null,
        location: null,
        website: null,
        dateOfBirth: null,
        phoneNumber: null
      };
      
      const response = await userService.createUserProfile(newProfile);
      if (response.data) {
        setUserProfile(response.data);
      }
    } catch (error) {
      console.error("Profil oluşturma hatası:", error);
    }
  };

  // Kullanıcı yorumlarını yükle
  const loadUserComments = async () => {
    try {
      setLoadingComments(true);
      const response = await reviewService.getReviews();
      const userReviews = response.data.filter(review => review.userId === user.userId);
      setUserComments(userReviews);
    } catch (error) {
      console.error("Yorumlar yüklenemedi:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  // Profil fotoğrafı güncelleme
  const handleProfilePhotoUpdate = async (photoUrl) => {
    if (userProfile) {
      try {
        const updatedProfile = {
          ...userProfile,
          profileImageUrl: photoUrl
        };
        
        const response = await userService.updateUserProfile(updatedProfile);
        if (response.data) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error("Profil güncelleme hatası:", error);
      }
    }
  };

  // Tarif detayı aç
  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  // Modal kapat
  const handleCloseModal = () => {
    setShowRecipeModal(false);
    setSelectedRecipe(null);
  };

  // Favori tarifleri filtrele
  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.recipeId));

  return (
    <div className="profile-root">
      {/* Profil Başlığı */}
      <div className="profile-cover">
        <button className="profile-photo-btn" onClick={() => setShowProfileEditModal(true)}>
          📷 Profili Düzenle
        </button>
      </div>

      {/* Profil Ana Bilgileri */}
      <div className="profile-main">
        <div className="profile-avatar">
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profil fotoğrafı" 
              className="profile-photo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
          ) : null}
          <span role="img" aria-label="avatar" style={{ fontSize: 64, display: profilePhoto ? 'none' : 'block' }}>
            👤
          </span>
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.username || "Kullanıcı"}</div>
          <div className="profile-username">@{user?.username || "kullanici"}</div>
        </div>
        <button className="profile-edit-btn" onClick={() => setShowProfileEditModal(true)}>
          Profili Düzenle
        </button>
      </div>

      {/* Tab Menüsü */}
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

      {/* Tab İçerikleri */}
      <div className="profile-tab-content">
        {/* Profil Tab */}
        {activeTab === "profile" && (
          <div>
            {loadingProfile ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Profil bilgileri yükleniyor...</p>
              </div>
            ) : (
              <>
                <h3>Hoş geldin, {userProfile?.username || user?.username || "Kullanıcı"}!</h3>
                <p>Burada profil bilgilerini ve ayarlarını görebilirsin.</p>
                
                <div className="profile-details" style={{ marginTop: 20 }}>
                  <div className="profile-detail-item">
                    <strong>Kullanıcı Adı:</strong> {userProfile?.username || user?.username || "Belirtilmemiş"}
                  </div>
                  <div className="profile-detail-item">
                    <strong>E-posta:</strong> {userProfile?.email || user?.email || "Belirtilmemiş"}
                  </div>
                  {userProfile?.bio && (
                    <div className="profile-detail-item">
                      <strong>Hakkımda:</strong> {userProfile.bio}
                    </div>
                  )}
                  {userProfile?.location && (
                    <div className="profile-detail-item">
                      <strong>Konum:</strong> {userProfile.location}
                    </div>
                  )}
                  {userProfile?.website && (
                    <div className="profile-detail-item">
                      <strong>Website:</strong> 
                      <a href={userProfile.website} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 5, color: '#007bff' }}>
                        {userProfile.website}
                      </a>
                    </div>
                  )}
                  {userProfile?.phoneNumber && (
                    <div className="profile-detail-item">
                      <strong>Telefon:</strong> {userProfile.phoneNumber}
                    </div>
                  )}
                  {userProfile?.dateOfBirth && (
                    <div className="profile-detail-item">
                      <strong>Doğum Tarihi:</strong> {new Date(userProfile.dateOfBirth).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                  {userProfile?.createdAt && (
                    <div className="profile-detail-item">
                      <strong>Üyelik Tarihi:</strong> {new Date(userProfile.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Favoriler Tab */}
        {activeTab === "favorites" && (
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

        {/* Yorumlar Tab */}
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
      
      {/* Modaller */}
      {showRecipeModal && selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          user={user}
          onClose={handleCloseModal}
        />
      )}

      <ProfileEditModal
        user={user}
        userProfile={userProfile}
        isOpen={showProfileEditModal}
        onClose={() => setShowProfileEditModal(false)}
        onPhotoUpdate={handleProfilePhotoUpdate}
      />
    </div>
  );
}
