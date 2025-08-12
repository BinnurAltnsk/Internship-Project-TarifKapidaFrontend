import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileEditModal from "../components/Profile/ProfileEditModal";
import "./ProfilePage.css";

const ProfilePage = ({ user }) => {
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");
  const token = localStorage.getItem("token");

  // Kullanıcı profilini getir
  useEffect(() => {
    if (!user?.userId) return;

    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/UserProfile/GetUserProfile/${user.userId}`);
        console.log("Backend'den gelen profil:", res.data);
        console.log("Fotoğraf değeri:", res.data?.profileImageBase64);
        setUserProfile(res.data);
      } catch (err) {
        console.error("Profil yüklenemedi:", err);
        // Profil yoksa varsayılan değerler kullan
        setUserProfile({
          bio: "Havalı bir kediyim.",
          profileImageBase64: null
        });
      }
    };

    fetchUserProfile();
  }, [user]);

  // Favori tarifleri getir
  useEffect(() => {
    console.log("ProfilePage useEffect - user:", user);
    console.log("ProfilePage useEffect - token:", token);
    
    if (!user?.userId || !token) {
      console.log("ProfilePage: user veya token eksik");
      return;
    }

    const fetchFavorites = async () => {
      try {
        console.log("Favoriler yükleniyor...");
        const res = await axios.get(`${API_BASE_URL}/api/Favorite/GetUserFavorites/${user.userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data || []);
        console.log("Favoriler yüklendi:", res.data);
      } catch (err) {
        console.error("Favoriler yüklenemedi:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, token]);

  // Kullanıcının yaptığı yorumları getir
  useEffect(() => {
    if (!user?.userId) return;

    const fetchReviews = async () => {
      try {
        // Backend'de kullanıcıya göre yorum getirme endpoint'i yok, 
        // şimdilik boş array kullan
        setReviews([]);
      } catch (err) {
        console.error("Yorumlar yüklenemedi:", err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [user]);

  if (!user || !user.userId) {
    return (
      <div className="profile-page">
        <div className="empty-state">
          <div className="empty-state-icon">🔒</div>
          <div className="empty-state-text">Giriş yapmanız gerekiyor</div>
          <div className="empty-state-subtext">Profil sayfasını görüntülemek için lütfen giriş yapın.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Profil Başlığı */}
      <div className="profile-header">
        <h1 className="profile-title">Profil Sayfası</h1>
        <p className="profile-subtitle">Hoş geldin, {user.username}! 👋</p>
      </div>

      {/* Profil İçeriği */}
      <div className="profile-content">
        {/* Sol Sidebar - Profil Bilgileri */}
        <div className="profile-sidebar">
          {/* Profil Fotoğrafı */}
          {userProfile?.profileImageBase64 ? (
            <img 
              src={userProfile.profileImageBase64.startsWith('data:') 
                ? userProfile.profileImageBase64 
                : `${API_BASE_URL}${userProfile.profileImageBase64}`
              }
              alt="Profil Fotoğrafı"
              className="profile-photo"
              onError={(e) => {
                console.log("Fotoğraf yüklenemedi, placeholder gösteriliyor");
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="profile-photo-placeholder" style={{ display: userProfile?.profileImageBase64 ? 'none' : 'flex' }}>
            👤
          </div>

          {/* Profil Bilgileri */}
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-title-icon">👤</span>
              Bilgiler
            </h3>
            <div className="profile-info">
              <div className="info-item">
                <span className="info-label">Kullanıcı Adı:</span>
                <span className="info-value">{user.username}</span>
              </div>
              <div className="info-item">
                <span className="info-label">E-posta:</span>
                <span className="info-value">{user.email}</span>
              </div>
              {userProfile?.bio && (
                <div className="info-item">
                  <span className="info-label">Hakkımda:</span>
                  <span className="info-value">{userProfile.bio}</span>
                </div>
              )}
            </div>

            {/* Profil Düzenleme Butonu */}
            <div className="profile-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setShowEditModal(true)}
              >
                ✏️ Profili Düzenle
              </button>
            </div>
          </div>
        </div>

        {/* Sağ Ana İçerik */}
        <div className="profile-main">
          {/* Favori Tarifler */}
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-title-icon">❤️</span>
              Favori Tarifler
            </h3>
            {loading ? (
              <div className="empty-state">
                <div className="empty-state-icon">⏳</div>
                <div className="empty-state-text">Yükleniyor...</div>
              </div>
            ) : favorites.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🍽️</div>
                <div className="empty-state-text">Henüz favori tarifiniz yok</div>
                <div className="empty-state-subtext">Ana sayfadan tarifleri keşfedin ve favorilere ekleyin!</div>
              </div>
            ) : (
              <div className="favorites-grid">
                {favorites.map((fav, i) => (
                  <div key={i} className="favorite-card">
                    <div className="favorite-name">{fav.recipeName || 'Tarif Adı'}</div>
                    <div className="favorite-category">{fav.category || 'Kategori'}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Yorumlar */}
          <div className="profile-section">
            <h3 className="section-title">
              <span className="section-title-icon">💬</span>
              Yaptığınız Yorumlar
            </h3>
            {reviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">⭐</div>
                <div className="empty-state-text">Henüz yorum yapmadınız</div>
                <div className="empty-state-subtext">Tarifleri değerlendirip yorum yapmaya başlayın!</div>
              </div>
            ) : (
              <div className="reviews-list">
                {reviews.map((rev, i) => (
                  <div key={i} className="review-item">
                    <div className="review-recipe">{rev.recipeName || 'Tarif Adı'}</div>
                    <div className="review-comment">{rev.comment || 'Yorum'}</div>
                    <div className="review-rating">⭐ {rev.rating || 0}/5</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profil Düzenleme Modal */}
      {showEditModal && (
        <ProfileEditModal
          user={user}
          userProfile={userProfile}
          onClose={() => {
            setShowEditModal(false);
            // Profil güncellendikten sonra sayfayı yenile
            window.location.reload();
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
