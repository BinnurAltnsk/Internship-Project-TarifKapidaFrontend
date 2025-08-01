import React, { useState, useRef, useEffect } from "react";
import { userService } from "../services/userService";
import { getProfilePhotoUrl } from "../services/api";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, onLoginClick, onRegisterClick, user, onLogout, onProfileClick, onLogoClick, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const menuRef = useRef();

  // Arama input'u için local state
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Local search term değiştiğinde parent'a bildir
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setLocalSearchTerm(newValue);
    setSearchTerm(newValue);
  };



  // Kullanıcı profili yükle
  useEffect(() => {
    if (user?.userId) {
      // Önceki profil verilerini temizle
      setUserProfile(null);
      setProfilePhoto(null);
      
      // Kısa bir gecikme ile profil yükle
      const timer = setTimeout(() => {
        loadUserProfile();
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Kullanıcı yoksa profil bilgilerini temizle
      setUserProfile(null);
      setProfilePhoto(null);
    }
  }, [user?.userId, user?.username]); // Hem userId hem de username değişikliklerini izle

  // Profil fotoğrafını ayarla
  useEffect(() => {
    console.log("Navbar - Profil fotoğrafı ayarlanıyor:", {
      userProfile: userProfile,
      profileImageBase64: userProfile?.profileImageBase64,
      userId: user?.userId,
      username: user?.username
    });
    
    if (userProfile?.profileImageBase64 && user?.userId) {
      // Base64 formatında ise doğrudan kullan
      if (userProfile.profileImageBase64.startsWith('data:image/')) {
        console.log("Navbar - Base64 formatında profil fotoğrafı ayarlanıyor");
        setProfilePhoto(userProfile.profileImageBase64);
      } else {
        // Dosya yolu formatında ise URL oluştur
        const photoUrl = getProfilePhotoUrl(userProfile.profileImageBase64);
        // Benzersiz cache busting
        const uniqueId = `${user.userId}_${Date.now()}_${Math.random()}`;
        const cacheBustUrl = `${photoUrl}?uid=${uniqueId}`;
        console.log("Navbar - URL formatında profil fotoğrafı ayarlanıyor:", {
          originalUrl: photoUrl,
          cacheBustUrl: cacheBustUrl,
          userId: user.userId
        });
        setProfilePhoto(cacheBustUrl);
      }
    } else {
      // Profil fotoğrafı yoksa temizle
      console.log("Navbar - Profil fotoğrafı temizleniyor");
      setProfilePhoto(null);
    }
  }, [userProfile?.profileImageBase64, user?.userId]);

  const loadUserProfile = async () => {
    try {
      // Kullanıcı kontrolü
      if (!user?.userId) {
        console.log("Navbar - Kullanıcı ID yok, profil yükleme iptal edildi");
        return;
      }
      
      console.log("Navbar - Profil yükleniyor, userId:", user.userId, "username:", user.username);
      
      // Profil var mı kontrol et
      const existsResponse = await userService.profileExists(user.userId);
      
      if (existsResponse.data) {
        // Profil varsa getir
        const response = await userService.getUserProfile(user.userId);
        if (response.data) {
          console.log("Navbar - Profil yüklendi:", {
            profileData: response.data,
            profileImageBase64: response.data.profileImageBase64,
            userId: response.data.userId,
            expectedUserId: user.userId
          });
          // Kullanıcı kontrolü yap
          if (response.data.userId === user.userId) {
            setUserProfile(response.data);
          } else {
            console.log("Navbar - Profil userId eşleşmiyor, profil yüklenmedi");
            setUserProfile(null);
          }
        }
      } else {
        console.log("Navbar - Profil bulunamadı, userId:", user.userId);
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Navbar - Profil yükleme hatası:", error);
      setUserProfile(null);
    }
  };

  console.log("Navbar kategorileri:", categories);
  console.log("Navbar user:", user);

  return (
    <nav className="navbar">
      <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div className="logo-area" onClick={onLogoClick} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <span className="logo-icon">🍲</span>
          <h2 className="logo">Tarif Kapıda</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {user && user.username ? (
            <div style={{ position: "relative" }} ref={menuRef}>
              <button className="nav-profile-btn" onClick={() => setMenuOpen(v => !v)}>
                {profilePhoto ? (
                  <img 
                    src={profilePhoto} 
                    alt="Profil fotoğrafı" 
                    className="nav-profile-photo"
                    key={`${user?.userId}-${Date.now()}-${Math.random()}`}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                ) : null}
                <span className="nav-profile-icon" style={{ display: profilePhoto ? 'none' : 'inline' }}>👤</span>
                {user.username || user.email}
              </button>
              {menuOpen && (
                <div className="nav-profile-menu">
                  <button className="nav-profile-menu-item" onClick={onProfileClick}>Profilim</button>
                  <button className="nav-profile-menu-item">Şifre Değiştir</button>
                  <button className="nav-profile-menu-item" onClick={onLogout}>Çıkış</button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button className="nav-auth-btn" onClick={onLoginClick}>Giriş Yap</button>
              <button className="nav-auth-btn" onClick={onRegisterClick}>Üye Ol</button>
            </div>
          )}
        </div>
      </div>
      <input
        type="text"
        placeholder="Tarif ara..."
        className="search-input"
        value={localSearchTerm}
        onChange={handleSearchChange}
      />
      <div className="nav-links">
        {categories.map((cat) => (
          <button
            key={cat}
            className={selectedCategory === cat ? "active-category" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
