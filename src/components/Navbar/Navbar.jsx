import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Navbar.css";

const Navbar = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  onLoginClick,
  onRegisterClick,
  user,
  onLogout,
  onProfileClick,
  onLogoClick,
  theme,
  toggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const menuRef = useRef();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  useEffect(() => {
    if (user?.userId) {
      setUserProfile(null);
      setProfilePhoto(null);
      const timer = setTimeout(() => loadUserProfile(), 100);
      return () => clearTimeout(timer);
    } else {
      setUserProfile(null);
      setProfilePhoto(null);
    }
  }, [user?.userId, user?.username]);

  useEffect(() => {
    if (userProfile?.profileImageBase64 && user?.userId) {
      if (userProfile.profileImageBase64.startsWith("data:image/")) {
        // Base64 formatı
        setProfilePhoto(userProfile.profileImageBase64);
      } else if (userProfile.profileImageBase64.startsWith("/")) {
        // Dosya yolu formatı
        const API_BASE_URL = localStorage.getItem("API_BASE_URL");
        setProfilePhoto(`${API_BASE_URL}${userProfile.profileImageBase64}`);
      } else {
        // Diğer formatlar için placeholder
        setProfilePhoto(null);
      }
    } else {
      setProfilePhoto(null);
    }
  }, [userProfile?.profileImageBase64, user?.userId]);

  const loadUserProfile = async () => {
    if (!user?.userId) return;
    try {
      const API_BASE_URL = localStorage.getItem("API_BASE_URL");

      const existsRes = await axios.get(`${API_BASE_URL}/api/UserProfile/ProfileExists/${user.userId}`);
      if (existsRes.data) {
        const res = await axios.get(`${API_BASE_URL}/api/UserProfile/GetUserProfile/${user.userId}`);
        if (res.data?.userId === user.userId) {
          setUserProfile(res.data);
        }
      }
    } catch (err) {
      console.error("Navbar - Profil yüklenemedi:", err);
      setUserProfile(null);
    }
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setLocalSearchTerm(newValue);
    setSearchTerm(newValue);
  };

  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
    // Ana sayfaya yönlendir
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Sol taraf - Logo */}
        <div className="navbar-left">
          <div className="logo-area" onClick={handleLogoClick}>
            <span className="logo-icon">🍲</span>
            <h2 className="logo">Tarif Kapıda</h2>
          </div>
        </div>

        {/* Orta - Arama */}
        <div className="navbar-center">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Tarif ara..."
              className="search-input"
              value={localSearchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Sağ taraf - Kullanıcı profili ve tema */}
        <div className="navbar-right">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          
          {user?.username ? (
            <div className="nav-profile" ref={menuRef}>
              <button className="nav-profile-btn" onClick={() => setMenuOpen((v) => !v)}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profil" className="nav-profile-photo" />
                ) : (
                  <span className="nav-profile-icon">👤</span>
                )}
                <span>{user.username || user.email}</span>
              </button>
              {menuOpen && (
                <div className="nav-profile-menu">
                  <button onClick={onProfileClick}>
                    <span>👤</span>
                    Profilim
                  </button>
                  <button onClick={onLogout}>
                    <span>🚪</span>
                    Çıkış
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-auth">
              <button className="nav-auth-btn" onClick={onLoginClick}>
                Giriş Yap
              </button>
              <button className="nav-auth-btn" onClick={onRegisterClick}>
                Üye Ol
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Navbar);
