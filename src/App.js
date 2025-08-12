import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginForm from "./components/Auth/LoginForm";
import RegisterForm from "./components/Auth/RegisterForm";
import RecipeDetailModal from "./components/Recipe/RecipeDetailModal";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    localStorage.setItem("API_BASE_URL", "https://enchanting-basbousa-e1a991.netlify.app");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch {
        localStorage.clear();
      }
    }
    
    // Tema tercihini localStorage'dan al
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
  };

  const handleFavorite = (recipeId) => {
    if (!user) return;
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handleProfileClick = () => {
    window.location.href = '/profil';
  };

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegister(false);
  };

  const handleRegisterClick = () => {
    setShowRegister(true);
    setShowLogin(false);
  };

  const handleSwitchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user}
          onLoginClick={handleLoginClick}
          onRegisterClick={handleRegisterClick}
          onLogout={handleLogout}
          onProfileClick={handleProfileClick}
          onLogoClick={handleLogoClick}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                setUser={setUser}
                recipes={recipes}
                setRecipes={setRecipes}
                favorites={favorites}
                setFavorites={setFavorites}
                onFavoriteClick={handleFavorite}
                onLoginClick={handleLoginClick}
                onRegisterClick={handleRegisterClick}
                onLogout={handleLogout}
                searchTerm={searchTerm}
              />
            }
          />
          <Route
            path="/profil"
            element={
              <ProfilePage
                user={user}
                favorites={favorites}
                recipes={recipes}
                onFavoriteClick={handleFavorite}
              />
            }
          />
        </Routes>
      
        {showLogin && (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onClose={closeModals}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}
        {showRegister && (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onClose={closeModals}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
        {selectedRecipe && (
          <RecipeDetailModal
            recipe={selectedRecipe}
            user={user}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
