import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { reviewService } from "./services/reviewService";
import { userService } from "./services/userService";
import { getProfilePhotoUrl } from "./services/api";
import RecipeCard from "./components/Recipe/RecipeCard";
import RecipeDetailModal from "./components/Recipe/RecipeDetailModal";
import ProfileEditModal from "./components/ProfileEditModal";

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
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const favoriteRecipes = recipes.filter((r) => favorites.includes(r.recipeId));

  useEffect(() => {
    if (user?.userId) {
      loadUserComments();
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await userService.getUserProfile(user.userId);
      if (response.data) {
        setUserProfile(response.data);
        // Profil fotoğrafını da ayarla (backend'de ProfileImageUrl olarak geliyor)
        if (response.data.profileImageUrl) {
          const photoUrl = getProfilePhotoUrl(response.data.profileImageUrl);
          setProfilePhoto(photoUrl);
        }
      }
    } catch (error) {
      console.error("Kullanıcı profili yüklenemedi:", error);
      // Eğer profil bulunamazsa, yeni profil oluşturmayı dene
      try {
        await createUserProfile();
      } catch (createError) {
        console.error("Yeni profil oluşturulamadı:", createError);
      }
    } finally {
      setLoadingProfile(false);
    }
  };

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

  const handleProfilePhotoUpdate = async (photoUrl) => {
    const fullPhotoUrl = getProfilePhotoUrl(photoUrl);
    setProfilePhoto(fullPhotoUrl);
    
    // UserProfile'ı da güncelle
    if (userProfile) {
      try {
        const updatedProfile = {
          ...userProfile,
          profileImageUrl: photoUrl
        };
        await userService.updateUserProfile(updatedProfile);
        setUserProfile(updatedProfile);
      } catch (error) {
        console.error("Profil güncellenirken hata:", error);
      }
    }
  };

  return (
    <div className="profile-root">
      <div className="profile-cover">
        <button className="profile-photo-btn" onClick={() => setShowProfileEditModal(true)}>📷 Profili Düzenle</button>
      </div>

      <div className="profile-main">
        <div className="profile-avatar">
          {profilePhoto ? (
            <img 
              src={profilePhoto} 
              alt="Profil fotoğrafı" 
              className="profile-photo"
            />
          ) : (
            <span role="img" aria-label="avatar" style={{ fontSize: 64 }}>
              👤
            </span>
          )}
        </div>
        <div className="profile-info">
          <div className="profile-name">{user?.username || "Kullanıcı"}</div>
          <div className="profile-username">@{user?.username || "kullanici"}</div>
        </div>
        <button className="profile-edit-btn" onClick={() => setShowProfileEditModal(true)}>Profili Düzenle</button>
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
                </div>
              </>
            )}
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

      {/* Profil Düzenleme Modal */}
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
