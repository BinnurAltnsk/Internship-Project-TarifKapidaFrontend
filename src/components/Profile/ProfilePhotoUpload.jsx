import React, { useState, useRef, useEffect } from 'react';
import { userService } from '../../services/userService';
import './ProfilePhotoUpload.css';

const ProfilePhotoUpload = ({ user, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (base64Image) {
      setPreviewUrl(base64Image);
    }
  }, [base64Image]);
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Dosya seçme işlemi
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setError('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    // Base64'e çevir
    const reader = new FileReader();
    reader.onload = (e) => {
      setBase64Image(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Resim yükleme işlemi
  const handleUpload = async () => {
    if (!base64Image || !user?.userId) {
      setError('Lütfen bir resim seçin ve giriş yapın.');
      return;
    }

    try {
      setIsUploading(true);
      setError('');

      const response = await userService.uploadProfilePhotoBase64(user.userId, base64Image);

      if (response.data?.profileImageBase64) {
        // Başarılı yükleme
        if (onPhotoUpdate) {
          onPhotoUpdate(response.data.profileImageBase64);
        }
        
        // Formu temizle
        resetForm();
        
        // Cache'i temizle
        if ('caches' in window) {
          caches.keys().then(names => {
            names.forEach(name => {
              if (name.includes('profile-photo') || name.includes('image')) {
                caches.delete(name);
              }
            });
          });
        }
        
        // Başarı mesajı
        showSuccessMessage('Profil fotoğrafı başarıyla yüklendi! 🎉');
      } else {
        setError('Fotoğraf yüklenirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      setError(error.response?.data?.message || 'Fotoğraf yüklenirken bir hata oluştu.');
    } finally {
      setIsUploading(false);
    }
  };

  // Başarı mesajı gösterme
  const showSuccessMessage = (message) => {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
      z-index: 9999;
      font-weight: 600;
      animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
      successDiv.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 300);
    }, 3000);
  };

  // Formu temizle
  const resetForm = () => {
    setPreviewUrl(null);
    setBase64Image(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // İptal işlemi
  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="profile-photo-upload">
      <h3>Profil Fotoğrafı Yükle</h3>
      
      {/* Dosya Seçme */}
      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
          id="profile-photo-input"
        />
        
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label htmlFor="profile-photo-input" className="file-input-label">
            <span className="upload-icon">📷</span>
            <span className="upload-text">Fotoğraf Seç veya Sürükle</span>
            <span className="upload-hint">JPG, PNG, GIF - Maksimum 5MB</span>
          </label>
        </div>
      </div>

      {/* Hata Mesajı */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Önizleme */}
      {previewUrl && (
        <div className="preview-section">
          <h4>Önizleme</h4>
          <div className="preview-container">
            <img src={previewUrl} alt="Profil fotoğrafı önizleme" className="preview-image" />
            <div className="preview-overlay">
              <div className="preview-actions">
                <button 
                  onClick={handleUpload} 
                  disabled={isUploading}
                  className="upload-btn"
                >
                  {isUploading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✅</span>
                      Yükle
                    </>
                  )}
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <span className="btn-icon">❌</span>
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bilgi */}
      <div className="upload-info">
        <div className="info-header">
          <span className="info-icon">ℹ️</span>
          <span className="info-title">Dosya Gereksinimleri</span>
        </div>
        <div className="info-content">
          <div className="info-item">
            <span className="info-label">Desteklenen formatlar:</span>
            <span className="info-value">JPG, PNG, GIF</span>
          </div>
          <div className="info-item">
            <span className="info-label">Maksimum dosya boyutu:</span>
            <span className="info-value">5MB</span>
          </div>
          <div className="info-item">
            <span className="info-label">Önerilen boyut:</span>
            <span className="info-value">400x400 piksel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload; 