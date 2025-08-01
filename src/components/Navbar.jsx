import React, { useState, useRef, useEffect } from "react";
import { userService } from "../services/userService";
import { getProfilePhotoUrl } from "../services/api";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, onLoginClick, onRegisterClick, user, onLogout, onProfileClick, onLogoClick, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  // Kullanıcı profili yükle
  useEffect(() => {
    if (user?.userId) {
      loadUserProfile();
    }
  }, [user]);

  // Profil fotoğrafını ayarla
  useEffect(() => {
    if (userProfile?.profileImageBase64) {
      // Base64 formatında ise doğrudan kullan
      if (userProfile.profileImageBase64.startsWith('data:image/')) {
        setProfilePhoto(userProfile.profileImageBase64);
      } else {
        // Dosya yolu formatında ise URL oluştur
        const photoUrl = getProfilePhotoUrl(userProfile.profileImageBase64);
        setProfilePhoto(photoUrl);
      }
    }
  }, [userProfile]);

  const loadUserProfile = async () => {
    try {
      // Profil var mı kontrol et
      const existsResponse = await userService.profileExists(user.userId);
      
      if (existsResponse.data) {
        // Profil varsa getir
        const response = await userService.getUserProfile(user.userId);
        if (response.data) {
          setUserProfile(response.data);
        }
      }
    } catch (error) {
      console.error("Navbar - Profil yükleme hatası:", error);
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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

export default Navbar;
