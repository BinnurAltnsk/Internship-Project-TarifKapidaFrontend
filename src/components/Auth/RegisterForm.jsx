import React, { useState } from "react";
import axios from "axios";
import "./RegisterForm.css";

const RegisterForm = ({ onRegisterSuccess, onClose, onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = localStorage.getItem("API_BASE_URL") || "tarifkapida.up.railway.app";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Şifre kontrolü
    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/Register`, {
        username,
        email,
        password,
      });

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token || "");

      onRegisterSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      console.error("Kayıt hatası:", err);
      if (err.response?.status === 409) {
        setError("Bu kullanıcı adı veya e-posta zaten kullanılıyor.");
      } else if (err.response?.status === 400) {
        setError("Geçersiz bilgiler. Lütfen kontrol edin.");
      } else {
        setError("Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) onSwitchToLogin();
  };

  return (
    <div className="register-form" onClick={handleClose}>
      <div className="register-form-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
        
        <div className="register-form-header">
          <h2 className="register-form-title">Üye Ol</h2>
          <p className="register-form-subtitle">Yeni hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              className="form-input"
              placeholder="Kullanıcı adınız"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              className="form-input"
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-input"
              placeholder="Şifreniz (en az 6 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre Tekrar</label>
            <input
              type="password"
              className="form-input"
              placeholder="Şifrenizi tekrar girin"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Kayıt olunuyor..." : "Üye Ol"}
          </button>
        </form>

        <div className="form-footer">
          <span className="switch-form-text">
            Zaten hesabınız var mı?
          </span>
          <button 
            type="button" 
            className="switch-form-btn"
            onClick={handleSwitchToLogin}
          >
            Giriş Yap
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
