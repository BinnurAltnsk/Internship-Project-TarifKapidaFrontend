import React, { useState, useRef, useEffect } from "react";
import "./Navbar.css";

const Navbar = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, onLoginClick, onRegisterClick, user, onLogout, onProfileClick, onLogoClick, theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

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
                <span className="nav-profile-icon">👤</span> {user.username || user.email}
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
