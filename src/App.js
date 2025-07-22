import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import RecipeCard from "./components/RecipeCard";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import ProfilePage from "./ProfilePage";
import RecipeDetailModal from "./components/RecipeDetailModal";
import { recipeService } from "./services/recipeService";
import { userService } from "./services/userService";
import { favoriteService } from "./services/favoriteService";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [categories, setCategories] = useState(["Tümü"]);
  const [userIngredients, setUserIngredients] = useState([]);
  const [inputIngredient, setInputIngredient] = useState("");
  const [showOnlyPossible, setShowOnlyPossible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favError, setFavError] = useState("");
  const [theme, setTheme] = useState('light');

  // Tema yönetimi
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  // Tarifleri yükle
  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      console.log("Tarifler yükleniyor...");
      const response = await recipeService.getRecipes();
      console.log("API Response:", response);
      const recipesData = response.data;
      console.log("Recipes Data:", recipesData);
      setRecipes(recipesData);
      
      // Kategorileri çıkar
      const uniqueCategories = [...new Set(
        recipesData
          .map(recipe => recipe?.category)
          .filter(category => category && category.trim() !== "")
      )];
      
      setCategories(["Tümü", ...uniqueCategories]);
    } catch (error) {
      console.error("Tarifler yüklenemedi:", error);
      console.error("Error details:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı favorilerini yükle
  useEffect(() => {
    if (user?.userId) {
      loadUserFavorites();
    }
  }, [user]);

  const loadUserFavorites = async () => {
    try {
      const response = await favoriteService.getUserFavorites(user.userId);
      const favoritesData = response.data;
      setFavorites(favoritesData.map(fav => fav.recipeId));
    } catch (error) {
      console.error("Favoriler yüklenemedi:", error);
    }
  };

  // Otomatik giriş kontrolü
  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    const savedUser = localStorage.getItem("user");
    
    if (jwt && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Kullanıcı bilgileri yüklenemedi:", error);
        localStorage.removeItem("jwt");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Favori ekle/çıkar
  const handleFavorite = async (recipeId) => {
    if (!user) return;
    
    setFavError("");
    try {
      const data = {
        userId: user.userId,
        recipeId: recipeId
      };

      console.log("Favori işlemi başlatılıyor:", data);
      console.log("Mevcut favoriler:", favorites);
      console.log("Bu tarif favori mi?", favorites.includes(recipeId));

      if (favorites.includes(recipeId)) {
        console.log("Favorilerden çıkarılıyor...");
        const response = await favoriteService.removeFromFavorites(data);
        console.log("RemoveFromFavorites response:", response);
        setFavorites(favorites.filter(id => id !== recipeId));
      } else {
        console.log("Favorilere ekleniyor...");
        const response = await favoriteService.addToFavorites(data);
        console.log("AddToFavorites response:", response);
        setFavorites([...favorites, recipeId]);
      }
    } catch (error) {
      console.error("Favori hatası detayı:", error.response?.data);
      console.error("Favori hatası status:", error.response?.status);
      setFavError("Favori işlemi başarısız oldu. Lütfen tekrar deneyin.");
      console.error("Favori hatası:", error);
    }
  };

  // Giriş başarılı
  const handleAuthSuccess = async (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    setShowLogin(false);
    setShowRegister(false);
  };

  // Çıkış
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    setUser(null);
    setFavorites([]);
  };

  // Navbar'daki Profilim butonuna tıklayınca yönlendirme için
  function AppNavbar(props) {
    const navigate = useNavigate();
    return (
      <Navbar
        {...props}
        user={user}
        onProfileClick={() => navigate("/profil")}
        onLogoClick={() => navigate("/")}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <AppNavbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                user={user}
                onLogout={handleLogout}
                onProfileClick={() => {}}
                onLogoClick={() => {}}
              />
              <div style={{ maxWidth: 500, margin: "24px auto 0", background: "var(--card-bg)", color: "var(--text-primary)", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px var(--shadow-color)", border: "1px solid var(--border-color)" }}>
                <h3 style={{ color: "var(--text-primary)", marginBottom: 16 }}>Elinizdeki Malzemeler</h3>
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <input
                    type="text"
                    value={inputIngredient}
                    onChange={e => setInputIngredient(e.target.value)}
                    placeholder="Malzeme ekle..."
                    style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid var(--border-color)", backgroundColor: "var(--input-bg)", color: "var(--text-primary)" }}
                    onKeyDown={e => { if (e.key === "Enter" && inputIngredient.trim()) { setUserIngredients([...userIngredients, inputIngredient.trim().toLowerCase()]); setInputIngredient(""); } }}
                  />
                  <button
                    onClick={() => { if (inputIngredient.trim()) { setUserIngredients([...userIngredients, inputIngredient.trim().toLowerCase()]); setInputIngredient(""); } }}
                    style={{ padding: "8px 16px", borderRadius: 6, background: "var(--accent-color)", color: "#fff", border: "none" }}
                  >Ekle</button>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                  {userIngredients.map((ing, idx) => (
                    <span key={idx} style={{ background: "var(--bg-secondary)", color: "var(--accent-color)", padding: "4px 10px", borderRadius: 8, fontSize: 15, border: "1px solid var(--border-color)" }}>{ing} <button style={{ background: "none", border: "none", color: "var(--accent-color)", cursor: "pointer" }} onClick={() => setUserIngredients(userIngredients.filter((_, i) => i !== idx))}>×</button></span>
                  ))}
                </div>
                <button
                  onClick={() => setShowOnlyPossible(!showOnlyPossible)}
                  style={{ padding: "8px 16px", borderRadius: 6, background: showOnlyPossible ? "var(--text-secondary)" : "var(--accent-color)", color: "#fff", border: "none", marginTop: 8 }}
                >{showOnlyPossible ? "Tüm Tarifleri Göster" : "Sadece Yapabileceğim Tarifler"}</button>
              </div>
              {favError && <div style={{ color: '#e60023', textAlign: 'center', margin: '12px 0' }}>{favError}</div>}
              <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '50px' }}>Tarifler yükleniyor...</div>
                ) : (
                  <div className="recipe-grid">
                    {recipes
                      .filter((r) => {
                        if (!r) return false;
                        const title = r.recipeName?.toLowerCase() || "";
                        const category = r.category || "";
                        const search = searchTerm.toLowerCase();
                        const matchesSearch =
                          title.includes(search) ||
                          category.toLowerCase().includes(search);
                        const matchesCategory =
                          selectedCategory === "Tümü" ||
                          (category && category.trim().toLowerCase() === selectedCategory.trim().toLowerCase());
              
                        // Malzeme bazlı filtreleme
                        let matchesIngredients = true;
                        if (userIngredients.length > 0) {
                          let recipeIngredients = [];
                          if (typeof r.recipeIngredients === "string") {
                            recipeIngredients = r.recipeIngredients.split(/,|\n/).map(i => i.trim().toLowerCase()).filter(Boolean);
                          } else if (Array.isArray(r.recipeIngredients)) {
                            recipeIngredients = r.recipeIngredients.map(i => i.trim().toLowerCase());
                          }
                          matchesIngredients = userIngredients.some(userIng =>
                            recipeIngredients.some(recipeIng => recipeIng.includes(userIng))
                          );
                        }
                        return matchesSearch && matchesCategory && matchesIngredients;
                      })
                      .map((r) => {
                        const { recipeId, recipeName, recipeImageUrl, recipeIngredients, recipeInstructions } = r;
                        
                        return (
                          <RecipeCard
                            key={recipeId}
                            title={recipeName}
                            imageUrl={recipeImageUrl}
                            ingredients={recipeIngredients}
                            recipeInstructions={recipeInstructions}
                            userIngredients={userIngredients}
                            onClick={() => setSelectedRecipe(r)}
                            showIngredients={false}
                            isFavorite={favorites.includes(recipeId)}
                            onFavoriteClick={() => handleFavorite(recipeId)}
                            user={user}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
              {selectedRecipe && (
                <RecipeDetailModal
                  recipe={selectedRecipe}
                  user={user}
                  onClose={() => setSelectedRecipe(null)}
                />
              )}
            </div>
          }
        />
        <Route
          path="/profil"
          element={
            <div>
              <AppNavbar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onLoginClick={() => setShowLogin(true)}
                onRegisterClick={() => setShowRegister(true)}
                user={user}
                onLogout={handleLogout}
                onProfileClick={() => {}}
                onLogoClick={() => {}}
              />
              <ProfilePage 
                user={user} 
                favorites={favorites} 
                recipes={recipes} 
                onFavoriteClick={handleFavorite}
              />
            </div>
          }
        />
      </Routes>
      {/* Giriş ve Üye Ol modalları */}
      {showLogin && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowLogin(false)}>
          <div style={{ background: "var(--modal-bg)", color: "var(--text-primary)", borderRadius: 16, padding: 32, maxWidth: 400, width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLogin(false)} style={{ position: "absolute", top: 16, right: 16, background: "var(--accent-color)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 18, cursor: "pointer" }}>Kapat</button>
            <h2 style={{ marginBottom: 24, color: "var(--text-primary)" }}>Giriş Yap</h2>
            <LoginForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
      {showRegister && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowRegister(false)}>
          <div style={{ background: "var(--modal-bg)", color: "var(--text-primary)", borderRadius: 16, padding: 32, maxWidth: 400, width: "100%", position: "relative" }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowRegister(false)} style={{ position: "absolute", top: 16, right: 16, background: "var(--accent-color)", color: "#fff", border: "none", borderRadius: 8, padding: "4px 12px", fontSize: 18, cursor: "pointer" }}>Kapat</button>
            <h2 style={{ marginBottom: 24, color: "var(--text-primary)" }}>Üye Ol</h2>
            <RegisterForm onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </Router>
  );
}

// Gerçek API ile çalışan LoginForm
function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      console.log("Giriş denemesi:", { username: email, password: password });
      const response = await userService.login({
        username: email, // API'de username olarak gönderiliyor
        password: password
      });
      
      console.log("Login Response:", response);
      
      // Login başarılı ama user bilgileri dönmüyor, ayrı API çağrısı yapalım
      if (response.status === 204 || !response.data) {
        console.log("Login başarılı, user bilgilerini ayrı API ile çekiyorum...");
        
        try {
          // Önce email ile kullanıcı bilgilerini çekmeyi dene
          const userResponse = await userService.getUserByEmail(email);
          console.log("User Response:", userResponse);
          
          if (userResponse.data) {
            const user = userResponse.data;
            const userData = {
              userId: user.userId || user.id,
              username: user.username || user.email,
              email: user.email
            };
            console.log("User Data from API:", userData);
            
            // Geçici token oluştur
            const tempToken = "temp_token_" + Date.now();
            localStorage.setItem("jwt", tempToken);
            
            if (onSuccess) onSuccess(userData);
            return;
          }
        } catch (userError) {
          console.error("GetUserByEmail çalışmadı, tüm kullanıcıları çekmeyi deniyorum:", userError);
          
          try {
            // Tüm kullanıcıları çek ve email ile filtrele
            const allUsersResponse = await userService.getUsers();
            console.log("All Users Response:", allUsersResponse);
            
            if (allUsersResponse.data) {
              const user = allUsersResponse.data.find(u => u.email === email || u.username === email);
              if (user) {
                const userData = {
                  userId: user.userId || user.id,
                  username: user.username || user.email,
                  email: user.email
                };
                console.log("User Data from filtered users:", userData);
                
                // Geçici token oluştur
                const tempToken = "temp_token_" + Date.now();
                localStorage.setItem("jwt", tempToken);
                
                if (onSuccess) onSuccess(userData);
                return;
              }
            }
          } catch (allUsersError) {
            console.error("Tüm kullanıcılar çekilemedi:", allUsersError);
          }
        }
        
        setError("Kullanıcı bilgileri alınamadı.");
        return;
      }
      
      const { token, user } = response.data;
      console.log("Token:", token);
      console.log("User:", user);
      
      if (!user) {
        console.error("User objesi boş!");
        setError("Kullanıcı bilgileri alınamadı.");
        return;
      }
      
      localStorage.setItem("jwt", token);
      
      // Backend'den gelen user verisini kontrol et ve düzenle
      const userData = {
        userId: user.userId || user.id,
        username: user.username || user.email,
        email: user.email
      };
      console.log("Processed User Data:", userData);
      
      if (onSuccess) onSuccess(userData);
    } catch (err) {
      console.error("Login Error:", err);
      console.error("Error Response:", err.response?.data);
      setError(err?.response?.data?.message || "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="login-email" style={{ color: 'var(--text-primary)' }}>E-posta</label>
        <input id="login-email" name="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="login-password" style={{ color: 'var(--text-primary)' }}>Şifre</label>
        <input id="login-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      {error && <div style={{ color: 'var(--error-color)', fontSize: 14, marginBottom: 12 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--accent-color)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }} disabled={!email || !password || loading}>{loading ? "Giriş Yapılıyor..." : "Giriş Yap"}</button>
    </form>
  );
}

// Gerçek API ile çalışan RegisterForm
function RegisterForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    
    setLoading(true);
    try {
      const response = await userService.register({
        username,
        email,
        password,
        confirmPassword
      });
      
      const { token, user } = response.data;
      localStorage.setItem("jwt", token);
      
      // Backend'den gelen user verisini kontrol et ve düzenle
      const userData = {
        userId: user?.userId || user?.id || 1,
        username: user?.username || user?.email || username,
        email: user?.email || email
      };
      console.log("Processed User Data:", userData);
      
      if (onSuccess) onSuccess(userData);
    } catch (err) {
      setError(err?.response?.data?.message || "Kayıt başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="register-username" style={{ color: 'var(--text-primary)' }}>Kullanıcı Adı</label>
        <input id="register-username" name="username" type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="register-email" style={{ color: 'var(--text-primary)' }}>E-posta</label>
        <input id="register-email" name="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="register-password" style={{ color: 'var(--text-primary)' }}>Şifre</label>
        <input id="register-password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="register-confirm-password" style={{ color: 'var(--text-primary)' }}>Şifre Tekrarı</label>
        <input id="register-confirm-password" name="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border-color)', marginTop: 4, backgroundColor: 'var(--input-bg)', color: 'var(--text-primary)' }} />
      </div>
      {error && <div style={{ color: 'var(--error-color)', fontSize: 14, marginBottom: 12 }}>{error}</div>}
      <button type="submit" style={{ width: '100%', padding: 10, borderRadius: 8, background: 'var(--accent-color)', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 16 }} disabled={!username || !email || !password || !confirmPassword || loading}>{loading ? "Üye Olunuyor..." : "Üye Ol"}</button>
    </form>
  );
}

export default App;
