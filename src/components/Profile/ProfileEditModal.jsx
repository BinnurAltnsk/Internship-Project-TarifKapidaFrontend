import React, { useState, useEffect } from 'react';
import ProfilePhotoUpload from './ProfilePhotoUpload';
import './ProfileEditModal.css';

const ProfileEditModal = ({ user, userProfile, isOpen, onClose, onPhotoUpdate }) => {
  const [activeSection, setActiveSection] = useState('photo');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
                    window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();
    
    // Listen for theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(checkDarkMode);
    
    // Listen for data-theme attribute changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => {
      mediaQuery.removeListener(checkDarkMode);
      observer.disconnect();
    };
  }, []);

  if (!isOpen) return null;

  const menuItems = [
    { 
      key: 'photo', 
      label: 'Profil Fotoğrafı', 
      icon: isDarkMode ? '📸' : '📷',
      description: 'Profil fotoğrafınızı güncelleyin'
    },
    { 
      key: 'password', 
      label: 'Şifre Değiştir', 
      icon: '🔐',
      description: 'Hesap güvenliğinizi artırın'
    },
    { 
      key: 'email', 
      label: 'E-posta Değiştir', 
      icon: '✉️',
      description: 'E-posta adresinizi güncelleyin'
    },
    { 
      key: 'username', 
      label: 'Kullanıcı Adı Değiştir', 
      icon: '👤',
      description: 'Kullanıcı adınızı değiştirin'
    },
    { 
      key: 'account', 
      label: 'Hesap Ayarları', 
      icon: '⚙️',
      description: 'Hesap tercihlerinizi yönetin'
    },
    { 
      key: 'social', 
      label: 'Sosyal Hesaplar', 
      icon: '🔗',
      description: 'Sosyal medya hesaplarınızı bağlayın'
    },
    { 
      key: 'contact', 
      label: 'İletişim Bilgileri', 
      icon: '📞',
      description: 'İletişim bilgilerinizi güncelleyin'
    },
    { 
      key: 'notifications', 
      label: 'Bildirim Ayarları', 
      icon: '🔔',
      description: 'Bildirim tercihlerinizi ayarlayın'
    },
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
            <h3>🔐 Şifre Değiştir</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">🚀</div>
              <h4>Yakında Geliyor!</h4>
              <p>Bu özellik çok yakında kullanıma açılacak. Güvenli şifre değiştirme işlemi için hazırlıklarımız devam ediyor.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🔒</span>
                  <span>Güvenli şifre politikası</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📧</span>
                  <span>E-posta doğrulama</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span>Anında güncelleme</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="section-content">
            <h3>✉️ E-posta Değiştir</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">📬</div>
              <h4>Yakında Geliyor!</h4>
              <p>E-posta adresinizi güvenli bir şekilde değiştirmek için gerekli altyapı hazırlanıyor.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">✅</span>
                  <span>E-posta doğrulama</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔐</span>
                  <span>Güvenli değişim</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📱</span>
                  <span>Anlık bildirim</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'username':
        return (
          <div className="section-content">
            <h3>👤 Kullanıcı Adı Değiştir</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">🎯</div>
              <h4>Yakında Geliyor!</h4>
              <p>Kullanıcı adınızı istediğiniz zaman değiştirebileceksiniz. Benzersiz kullanıcı adları için sistem hazırlanıyor.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🎨</span>
                  <span>Özelleştirilebilir</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔍</span>
                  <span>Müsaitlik kontrolü</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">⚡</span>
                  <span>Anında güncelleme</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'account':
        return (
          <div className="section-content">
            <h3>⚙️ Hesap Ayarları</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">🎛️</div>
              <h4>Yakında Geliyor!</h4>
              <p>Hesap ayarlarınızı detaylı bir şekilde yönetebileceğiniz kapsamlı bir panel hazırlanıyor.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">🌍</span>
                  <span>Dil ayarları</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🎨</span>
                  <span>Tema seçenekleri</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔒</span>
                  <span>Güvenlik ayarları</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'social':
        return (
          <div className="section-content">
            <h3>🔗 Sosyal Hesaplar</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">🌐</div>
              <h4>Yakında Geliyor!</h4>
              <p>Sosyal medya hesaplarınızı TarifKapıda hesabınızla bağlayarak daha hızlı giriş yapabileceksiniz.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">📱</span>
                  <span>Hızlı giriş</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔄</span>
                  <span>Kolay senkronizasyon</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">🔐</span>
                  <span>Güvenli bağlantı</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="section-content">
            <h3>📞 İletişim Bilgileri</h3>
            <div className="feature-coming-soon">
              <div className="coming-soon-icon">📋</div>
              <h4>Yakında Geliyor!</h4>
              <p>İletişim bilgilerinizi güncelleyerek arkadaşlarınızın sizi daha kolay bulmasını sağlayın.</p>
              <div className="feature-benefits">
                <div className="benefit-item">
                  <span className="benefit-icon">📧</span>
                  <span>E-posta yönetimi</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📱</span>
                  <span>Telefon numarası</span>
                </div>
                <div className="benefit-item">
                  <span className="benefit-icon">📍</span>
                  <span>Konum bilgisi</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="section-content">
            <h3>🔔 Bildirim Ayarları</h3>
            <div className="notification-subsections">
              <div className="subsection">
                <h4>📱 Masaüstü Bildirim Ayarları</h4>
                <div className="feature-coming-soon">
                  <div className="coming-soon-icon">💻</div>
                  <h5>Yakında Geliyor!</h5>
                  <p>Masaüstü bildirimlerinizi özelleştirerek önemli güncellemeleri kaçırmayın.</p>
                </div>
              </div>
              <div className="subsection">
                <h4>📧 E-posta Bildirim Ayarları</h4>
                <div className="feature-coming-soon">
                  <div className="coming-soon-icon">📬</div>
                  <h5>Yakında Geliyor!</h5>
                  <p>E-posta bildirimlerinizi yöneterek istediğiniz içerikleri alın.</p>
                </div>
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
          <h2>PROFİLİNİ DÜZENLE</h2>
          <button className="close-btn" onClick={onClose} aria-label="Kapat">×</button>
        </div>
        
        <div className="modal-content">
          <div className="menu-sidebar">
            {menuItems.map((item) => (
              <button
                key={item.key}
                className={`menu-item ${activeSection === item.key ? 'active' : ''}`}
                onClick={() => setActiveSection(item.key)}
                title={item.description}
              >
                <span className="menu-icon">{item.icon}</span>
                <div className="menu-item-content">
                  <span className="menu-label">{item.label}</span>
                  <span className="menu-description">{item.description}</span>
                </div>
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