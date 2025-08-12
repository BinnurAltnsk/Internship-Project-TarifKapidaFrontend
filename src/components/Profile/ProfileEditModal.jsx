import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileEditModal.css";

const ProfileEditModal = ({ user, userProfile, onClose }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState(userProfile?.bio || "");
  const [profileImageBase64, setProfileImageBase64] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = localStorage.getItem("API_BASE_URL");
  const token = localStorage.getItem("token");

  // Mevcut profil fotoğrafını göster
  useEffect(() => {
    if (userProfile?.profileImageBase64) {
      setProfileImageBase64(userProfile.profileImageBase64);
    }
  }, [userProfile]);

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Kullanıcı adı gereklidir";
    } else if (username.length < 3) {
      newErrors.username = "Kullanıcı adı en az 3 karakter olmalıdır";
    }

    if (!email.trim()) {
      newErrors.email = "E-posta gereklidir";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Geçerli bir e-posta adresi giriniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage("Dosya boyutu 5MB'dan küçük olmalıdır");
      setMessageType("error");
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setMessage("Sadece resim dosyaları kabul edilir");
      setMessageType("error");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      // Backend data:image/...;base64, formatını bekliyor
      setProfileImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");

    try {
      // Önce profil bilgilerini güncelle
      const updateData = {
        userId: user.userId,
        username: username.trim(),
        email: email.trim(),
        bio: bio.trim(),
        profileImageBase64: null // Fotoğrafı ayrı yükle
      };

      const res = await axios.post(
        `${API_BASE_URL}/api/UserProfile/UpdateUserProfile`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Eğer yeni fotoğraf seçildiyse, ayrıca fotoğraf yükle
      if (profileImageBase64 && profileImageBase64 !== userProfile?.profileImageBase64) {
        console.log("Yeni fotoğraf yükleniyor...");
        console.log("Seçilen fotoğraf:", profileImageBase64.substring(0, 100) + "...");
        
        const photoData = {
          userId: user.userId,
          profileImageBase64: profileImageBase64
        };

        const photoRes = await axios.post(
          `${API_BASE_URL}/api/UserProfile/UploadUserProfilePhoto`,
          photoData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Fotoğraf yükleme sonucu:", photoRes.data);
      }

      setMessage("Profil başarıyla güncellendi! 🎉");
      setMessageType("success");
      
      // LocalStorage'daki user bilgisini güncelle
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...currentUser, username: username.trim(), email: email.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Profil bilgilerini yenile
      setTimeout(() => {
        window.location.reload(); // Sayfayı yenile
      }, 2000);
    } catch (err) {
      console.error("Profil güncelleme hatası:", err);
      
      if (err.response?.status === 409) {
        setMessage("Bu kullanıcı adı veya e-posta zaten kullanılıyor");
      } else if (err.response?.status === 400) {
        setMessage("Geçersiz veri formatı");
      } else {
        setMessage("Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.");
      }
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return; // Yükleme sırasında kapatmayı engelle
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Kapatma Butonu */}
        <button className="close-btn" onClick={handleClose} disabled={loading}>
          ✕
        </button>

        {/* Modal Başlığı */}
        <div className="modal-header">
          <h3 className="modal-title">Profil Bilgilerini Güncelle</h3>
          <p className="modal-subtitle">Kişisel bilgilerinizi düzenleyin</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Kullanıcı Adı */}
          <div className="form-group">
            <label className="form-label">👤 Kullanıcı Adı</label>
            <input
              type="text"
              className={`form-input ${errors.username ? 'error' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınızı girin"
              disabled={loading}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          {/* E-posta */}
          <div className="form-group">
            <label className="form-label">📧 E-posta</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresinizi girin"
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Hakkımda */}
          <div className="form-group">
            <label className="form-label">📝 Hakkımda</label>
            <textarea
              className="form-input"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Kendiniz hakkında kısa bir açıklama yazın (opsiyonel)"
              rows="3"
              disabled={loading}
            />
          </div>

          {/* Profil Fotoğrafı */}
          <div className="form-group">
            <label className="form-label">📸 Profil Fotoğrafı</label>
            <div className="file-input-container">
              <input
                type="file"
                id="profile-image"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label 
                htmlFor="profile-image" 
                className={`file-input-label ${selectedFile ? 'has-file' : ''}`}
              >
                {selectedFile ? '📁 Dosya Seçildi' : '📁 Fotoğraf Seç'}
              </label>
            </div>
            
            {selectedFile && (
              <div className="file-name">
                Seçilen dosya: {selectedFile.name}
              </div>
            )}

            {/* Önizleme */}
            {profileImageBase64 && (
              <img
                src={profileImageBase64.startsWith('data:') 
                  ? profileImageBase64 
                  : `${API_BASE_URL}${profileImageBase64}`
                }
                alt="Profil önizleme"
                className="preview-image"
                onError={(e) => {
                  console.log("Önizleme fotoğrafı yüklenemedi");
                  e.target.style.display = 'none';
                }}
              />
            )}
          </div>

          {/* Butonlar */}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-outline" 
              onClick={handleClose}
              disabled={loading}
            >
              ❌ İptal
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
            </button>
          </div>
        </form>

        {/* Durum Mesajı */}
        {message && (
          <div className={`status-message ${messageType}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileEditModal;
