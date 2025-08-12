import React, { useState } from "react";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = ({ onSuccess, onClose, onSwitchToRegister }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/User/Login`, {
        email: usernameOrEmail, // username yerine email gönder
        password: password,
      });

      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", user.token || "");

      onSuccess(user);
      if (onClose) onClose();
    } catch (err) {
      console.error("Giriş hatası:", err);
      if (err.response?.status === 401) {
        setError("E-posta veya şifre hatalı.");
      } else if (err.response?.status === 404) {
        setError("Kullanıcı bulunamadı.");
      } else if (err.response?.status === 400) {
        setError("Geçersiz veri formatı. Lütfen kontrol edin.");
      } else {
        setError("Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleSwitchToRegister = () => {
    if (onSwitchToRegister) onSwitchToRegister();
  };

  return (
    <div className="login-form" onClick={handleClose}>
      <div className="login-form-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={handleClose}>
          ✕
        </button>
        
        <div className="login-form-header">
          <h2 className="login-form-title">Giriş Yap</h2>
          <p className="login-form-subtitle">Hesabınıza giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              className="form-input"
              placeholder="E-posta adresiniz"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-input"
              placeholder="Şifreniz"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </button>
        </form>

        <div className="form-footer">
          <span className="switch-form-text">
            Hesabınız yok mu?
          </span>
          <button 
            type="button" 
            className="switch-form-btn"
            onClick={handleSwitchToRegister}
          >
            Üye Ol
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
