# Tarif Kapıda

Modern ve kullanıcı dostu bir tarif paylaşım uygulaması. Kullanıcılar tarifleri keşfedebilir, favorilere ekleyebilir ve yorum yapabilir.

## Özellikler

- 🍳 **Tarif Keşfi**: Kategorilere göre tarifleri filtreleme
- 🔍 **Arama**: Tarif adı ve kategorilere göre arama
- 🛒 **Malzeme Filtreleme**: Elinizdeki malzemelere göre tarif önerisi
- ❤️ **Favoriler**: Beğendiğiniz tarifleri favorilere ekleme
- ⭐ **Değerlendirme**: Tariflere puan verme ve yorum yapma
- 🌙 **Tema Desteği**: Açık/koyu tema seçeneği
- 👤 **Kullanıcı Profili**: Kişisel profil sayfası

## Teknolojiler

- **Frontend**: React.js
- **Routing**: React Router
- **Styling**: CSS3 (CSS Variables ile tema desteği)
- **State Management**: React Hooks

## Kurulum

1. Projeyi klonlayın:
```bash
git clone <repository-url>
cd tarif-kapida
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Uygulamayı başlatın:
```bash
npm start
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## Kullanım

### Tarif Keşfi
- Ana sayfada tüm tarifleri görüntüleyebilirsiniz
- Kategori filtrelerini kullanarak tarifleri filtreleyebilirsiniz
- Arama çubuğunu kullanarak tarif arayabilirsiniz

### Malzeme Filtreleme
- "Elinizdeki Malzemeler" bölümüne malzemelerinizi ekleyin
- "Sadece Yapabileceğim Tarifler" butonuna tıklayarak filtrelenmiş sonuçları görün

### Kullanıcı İşlemleri
- Giriş yapın veya üye olun (demo modunda herhangi bir bilgi ile giriş yapabilirsiniz)
- Tarifleri favorilere ekleyin
- Tariflere puan verin ve yorum yapın
- Profil sayfanızdan favori tariflerinizi görüntüleyin

## Proje Yapısı

```
src/
├── components/          # React bileşenleri
│   ├── Navbar.jsx      # Navigasyon çubuğu
│   ├── RecipeCard.jsx  # Tarif kartı
│   ├── RecipeDetailModal.jsx  # Tarif detay modalı
│   ├── RecipeReviewForm.jsx   # Yorum formu
│   └── StarRating.jsx  # Yıldız derecelendirme
├── App.js              # Ana uygulama bileşeni
├── ProfilePage.jsx     # Kullanıcı profil sayfası
└── index.js            # Uygulama giriş noktası
```

## Demo Veriler

Uygulama şu anda statik demo verilerle çalışmaktadır:
- 5 örnek tarif
- Demo kullanıcı girişi
- Örnek yorumlar ve değerlendirmeler

## Geliştirme

### Yeni Tarif Ekleme
`src/App.js` dosyasındaki `staticRecipes` dizisine yeni tarifler ekleyebilirsiniz:

```javascript
{
  recipeId: 6,
  recipeName: "Yeni Tarif",
  recipeImageUrl: "https://example.com/image.jpg",
  recipeIngredients: "Malzeme 1, Malzeme 2, Malzeme 3",
  recipeInstructions: "1. Adım 1\n2. Adım 2\n3. Adım 3",
  category: "Kategori"
}
```

### Tema Özelleştirme
CSS değişkenlerini kullanarak tema renklerini özelleştirebilirsiniz. `src/index.css` dosyasında tema değişkenlerini bulabilirsiniz.

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
