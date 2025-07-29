import React, { useState, useRef } from 'react';
import { userService } from '../../services/Profile/userService';
import './ProfilePhotoUpload.css';

const ProfilePhotoUpload = ({ user, userProfile, onPhotoUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

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

    setError('');
    
    // Önizleme için URL oluştur
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files[0]) {
      setError('Lütfen bir dosya seçin.');
      return;
    }

    if (!user?.userId) {
      setError('Kullanıcı bilgileri bulunamadı.');
      return;
    }

    const file = fileInputRef.current.files[0];
    
    try {
      setIsUploading(true);
      setError('');
      
      console.log('Profil fotoğrafı yükleniyor...', { userId: user.userId, fileName: file.name });
      
      const response = await userService.uploadProfilePhoto(user.userId, file);
      
      console.log('Upload response:', response);
      
      // Backend'den ProfileImageUrl olarak geliyor
      if (response.data && response.data.profileImageUrl) {
        console.log('Fotoğraf başarıyla yüklendi:', response.data.profileImageUrl);
        
        // Başarılı yükleme sonrası callback
        if (onPhotoUpdate) {
          onPhotoUpdate(response.data.profileImageUrl);
        }
        
        // Formu temizle
        setPreviewUrl(null);
        fileInputRef.current.value = '';
        
        alert('Profil fotoğrafı başarıyla yüklendi!');
      } else {
        console.error('Response data eksik:', response.data);
        setError('Fotoğraf yüklenirken bir hata oluştu. Response data eksik.');
      }
    } catch (error) {
      console.error('Fotoğraf yükleme hatası:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Fotoğraf yüklenirken bir hata oluştu. Lütfen tekrar deneyin.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="profile-photo-upload">
      <h3>Profil Fotoğrafı Yükle</h3>
      
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

      {error && <div className="error-message">{error}</div>}

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

      <div className="upload-info">
        <p><strong>Desteklenen formatlar:</strong> JPG, PNG, GIF</p>
        <p><strong>Maksimum dosya boyutu:</strong> 5MB</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload; 