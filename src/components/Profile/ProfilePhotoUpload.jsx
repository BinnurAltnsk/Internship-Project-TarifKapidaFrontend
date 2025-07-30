import React, { useState, useRef, useEffect } from 'react';
import { userService } from '../../services/userService';
import './ProfilePhotoUpload.css';

const ProfilePhotoUpload = ({ user, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
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
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Dosya seçme işlemi
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

      if (response.data?.ProfileImageUrl) {
        // Başarılı yükleme
        if (onPhotoUpdate) {
          onPhotoUpdate(response.data.ProfileImageUrl);
        }
        
        // Formu temizle
        resetForm();
        alert('Profil fotoğrafı başarıyla yüklendi!');
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
        <label htmlFor="profile-photo-input" className="file-input-label">
          📷 Fotoğraf Seç
        </label>
      </div>

      {/* Hata Mesajı */}
      {error && <div className="error-message">{error}</div>}

      {/* Önizleme */}
      {previewUrl && (
        <div className="preview-section">
          <h4>Önizleme:</h4>
          <img src={previewUrl} alt="Profil fotoğrafı önizleme" className="preview-image" />
          <div className="preview-actions">
            <button 
              onClick={handleUpload} 
              disabled={isUploading}
              className="upload-btn"
            >
              {isUploading ? 'Yükleniyor...' : 'Yükle'}
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Bilgi */}
      <div className="upload-info">
        <p><strong>Desteklenen formatlar:</strong> JPG, PNG, GIF</p>
        <p><strong>Maksimum dosya boyutu:</strong> 5MB</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload; 