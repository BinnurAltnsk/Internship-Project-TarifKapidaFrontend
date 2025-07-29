import React, { useState } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import './ProfileEditModal.css';

const ProfileEditModal = ({ user, userProfile, isOpen, onClose, onPhotoUpdate }) => {
  const [activeSection, setActiveSection] = useState('photo');

  if (!isOpen) return null;

  const menuItems = [
    { key: 'photo', label: 'Profil Fotoğrafı', icon: '📷' },
    { key: 'password', label: 'Şifre Değiştir', icon: '🔒' },
    { key: 'email', label: 'E-posta Değiştir', icon: '📧' },
    { key: 'username', label: 'Kullanıcı Adı Değiştir', icon: '👤' },
    { key: 'account', label: 'Hesap Ayarları', icon: '⚙️' },
    { key: 'social', label: 'Sosyal Hesaplar', icon: '🔗' },
    { key: 'contact', label: 'İletişim Bilgileri', icon: '📞' },
    { key: 'notifications', label: 'Bildirim Ayarları', icon: '🔔' },
  ];

  const renderContent = () => {
    switch (activeSection) {
             case 'photo':
         return (
           <ProfilePhotoUpload 
             user={user}
             userProfile={userProfile}
             onPhotoUpdate={onPhotoUpdate}
           />
         );
      case 'password':
        return (
          <div className="section-content">
            <h3>Şifre Değiştir</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'email':
        return (
          <div className="section-content">
            <h3>E-posta Değiştir</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'username':
        return (
          <div className="section-content">
            <h3>Kullanıcı Adı Değiştir</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'account':
        return (
          <div className="section-content">
            <h3>Hesap Ayarları</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'social':
        return (
          <div className="section-content">
            <h3>Sosyal Hesaplar</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'contact':
        return (
          <div className="section-content">
            <h3>İletişim Bilgileri</h3>
            <p>Bu özellik yakında eklenecek.</p>
          </div>
        );
      case 'notifications':
        return (
          <div className="section-content">
            <h3>Bildirim Ayarları</h3>
            <div className="notification-subsections">
              <div className="subsection">
                <h4>Masaüstü Bildirim Ayarları</h4>
                <p>Bu özellik yakında eklenecek.</p>
              </div>
              <div className="subsection">
                <h4>E-posta Bildirim Ayarları</h4>
                <p>Bu özellik yakında eklenecek.</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-edit-modal-overlay" onClick={onClose}>
      <div className="profile-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 PROFİLİNİ DÜZENLE</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="menu-sidebar">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`menu-item ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => setActiveSection(item.key)}
              >
                <span className="menu-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="content-area">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal; 