# Profile Servisleri

Bu klasör, kullanıcı profili ile ilgili tüm API servislerini içerir.

## Servisler

### userService.js
Kullanıcı profili ile ilgili tüm API çağrılarını içerir:

#### Temel Kullanıcı İşlemleri
- `login(credentials)` - Kullanıcı girişi
- `register(userData)` - Kullanıcı kaydı
- `getUserById(userId)` - ID ile kullanıcı getir
- `getUserByEmail(email)` - Email ile kullanıcı getir
- `getUsers()` - Tüm kullanıcıları getir
- `updateUser(userData)` - Kullanıcı güncelle
- `deleteUser(userId)` - Kullanıcı sil

#### Profil İşlemleri
- `getUserProfile(userId)` - Kullanıcı profilini getir
- `updateUserProfile(userProfileData)` - Profili güncelle
- `createUserProfile(userProfileData)` - Yeni profil oluştur
- `profileExists(userId)` - Profil var mı kontrol et

#### Profil Fotoğrafı İşlemleri
- `uploadProfilePhoto(userId, file)` - Profil fotoğrafı yükle
- `getProfilePhoto(userId)` - Profil fotoğrafını getir
- `deleteProfilePhoto(userId)` - Profil fotoğrafını sil

#### Bildirim ve Sosyal Hesap İşlemleri
- `updateNotificationSettings(settings)` - Bildirim ayarlarını güncelle
- `getNotificationSettings(userId)` - Bildirim ayarlarını getir
- `linkSocialAccount(userId, provider, accessToken)` - Sosyal hesap bağla
- `getLinkedSocialAccounts(userId)` - Bağlı sosyal hesapları getir

## Kullanım

```javascript
import { userService } from './services/Profile/userService';

// Profil fotoğrafı yükle
const response = await userService.uploadProfilePhoto(userId, file);

// Profil bilgilerini getir
const profile = await userService.getUserProfile(userId);
```

## Backend API Entegrasyonu

Bu servisler `http://localhost:7175` adresindeki backend API'sine bağlanır ve UserProfile controller'ını kullanır. 