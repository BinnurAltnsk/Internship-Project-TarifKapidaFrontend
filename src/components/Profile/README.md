# Profile Bileşenleri

Bu klasör, kullanıcı profili ile ilgili tüm bileşenleri içerir.

## Bileşenler

### ProfilePage.jsx
- Ana profil sayfası bileşeni
- Kullanıcı bilgilerini gösterir
- Profil düzenleme modalını açar
- Favori tarifleri ve yorumları listeler

### ProfileEditModal.jsx
- Profil düzenleme modalı
- Farklı profil ayarları için menü sistemi
- Profil fotoğrafı yükleme, şifre değiştirme vb.

### ProfilePhotoUpload.jsx
- Profil fotoğrafı yükleme bileşeni
- Dosya seçimi ve önizleme
- Backend API ile entegrasyon

## CSS Dosyaları

- `ProfilePage.css` - Ana profil sayfası stilleri
- `ProfileEditModal.css` - Modal stilleri
- `ProfilePhotoUpload.css` - Fotoğraf yükleme stilleri

## Kullanım

```javascript
import { ProfilePage, ProfileEditModal, ProfilePhotoUpload } from './components/Profile';
```

## API Entegrasyonu

Bu bileşenler `src/services/Profile/userService.js` ile backend API'sine bağlanır. 