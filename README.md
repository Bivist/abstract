# Abstract — Bilimi Kaydırarak Keşfet

Akademik makaleleri kaydırarak keşfet, beğen, klasörle, PDF olarak çıktı al ve **bağlantıyla paylaş**.
Makale verisi [OpenAlex](https://openalex.org) açık API'sinden gelir. Beğeniler, klasörler ve ayarlar varsayılan olarak yalnızca kullanıcının tarayıcısında (localStorage) saklanır. İsteğe bağlı olarak **Google veya e-posta ile giriş** yapılırsa bu veriler [Supabase](https://supabase.com) üzerinde hesaba yedeklenir ve cihazlar arasında eşitlenir (aşağıya bak). Supabase anahtarları tanımlı değilse uygulama eskisi gibi hesapsız çalışır.

## Çalıştırma

```bash
npm install --legacy-peer-deps
npm run dev      # http://localhost:3000
npm run lint     # tip kontrolü
npm run build    # dist/ klasörüne üretim derlemesi
```

Node 20.19+ veya 22.12+ gerekir.

## Hesap ve giriş (Supabase)

1. [supabase.com](https://supabase.com)'da proje oluştur. **SQL Editor**'de `supabase/schema.sql` dosyasını çalıştır (tablo + satır düzeyi güvenlik kuralları).
2. **Project Settings → API**'den `Project URL` ve `Publishable key` (eski adıyla anon) anahtarını al. Yerelde `.env` dosyasına (`.env.example`'a bak), Netlify'da **Site settings → Environment variables**'a, GitHub Pages için **Settings → Secrets and variables → Actions** altına `VITE_SUPABASE_URL` ve `VITE_SUPABASE_PUBLISHABLE_KEY` olarak ekle.
3. **Authentication → URL Configuration**: *Site URL* = `https://rastgel.netlify.app`; *Redirect URLs*'e `https://rastgel.netlify.app/**` ve yerel geliştirme için `http://localhost:3000/**` ekle.
4. **Authentication → Providers → Email**: açık olsun ("Confirm email" önerilir).
5. **Authentication → Providers → Google**: Google Cloud Console'da OAuth istemcisi (Web) oluştur. *Authorized redirect URI* olarak Supabase'in Google sağlayıcı sayfasında gösterilen `https://<proje>.supabase.co/auth/v1/callback` adresini ver; Client ID ve Secret'ı Supabase'e yapıştır.

Çalışma mantığı: giriş isteğe bağlıdır. İlk girişte cihazdaki (misafir) veriler hesaptakilerle birleştirilir; sonrasında değişiklikler ~1,5 sn gecikmeyle `user_data` tablosuna yazılır. Çıkış yapınca bu cihazdaki kişisel veri silinir (hesapta durur). Her kullanıcı yalnızca kendi satırını okuyup yazabilir (RLS). `anon` anahtarı herkese açık olacak şekilde tasarlanmıştır; `service_role` anahtarını asla uygulamaya koyma.

## Makale paylaşma

Detay ekranında, Akış modunda, klasik kartlarda ve Beğenilenler listesinde **Paylaş** düğmesi vardır.

- Bağlantı biçimi: `https://rastgel.netlify.app/?makale=W2741809807` (`W…` OpenAlex makale kimliğidir).
- Telefonda sistemin paylaşım menüsü açılır (WhatsApp, Mesajlar vb.); desteklenmiyorsa bağlantı panoya kopyalanır.
- Bağlantıyı açan kişi, uygulamada doğrudan o makalenin detay ekranına düşer; makaleyi beğenebilir veya kaynağında açabilir. Makale açıldıktan sonra parametre adresten silinir.
- Kimlik `W` + rakam biçiminde doğrulanır; geçersiz değerler yok sayılır. Bağlantıda kişisel veri yoktur.

## PDF / yazdırma çıktısı

"Çıktı al" yeni bir pencerede yazdırma görünümü açar. Logo dosyanın içine gömülüdür (indirilen HTML'de de görünür). Baskıda sabit konumlu, saydam veya döndürülmüş katman kullanılmaz; eski sürümdeki siyah alanların nedeni bunlardı. Açılır pencere engellenirse yazdırma gizli bir iframe ile yapılır.

## Yayınlama

- **Netlify:** `netlify.toml` hazır (build: `npm run build`, publish: `dist`). `public/_headers` güvenlik başlıklarını (CSP, X-Frame-Options, Referrer-Policy vb.) ekler.
- **GitHub Pages:** `.github/workflows/static.yml` `main` dalına her push'ta derleyip yayınlar. `vite.config.ts` içinde `base: './'` olduğundan alt dizinde de çalışır.

`public/_headers` içindeki CSP yalnızca şu dış adreslere izin verir: OpenAlex API, Google Translate (çeviri özelliği), Google Fonts, Supabase (`*.supabase.co`). Yeni bir dış servis eklersen buraya da eklemelisin.

## Logo ve ikonlar

Ana logo `public/assets/logo.png` (+ hafif `logo.webp`). Favicon, ana ekran ikonu (`apple-touch-icon.png`, `icon-192/512.png`), bağlantı önizleme görseli (`og-image.png`) ve PDF için küçük logo (`src/assets/logo-print.png`) bu dosyadan üretildi. Logoyu değiştirirsen bunları da yenile.

## Yapı

```
src/
  App.tsx              ana durum, paylaşım bağlantısı akışı
  components/          ekranlar ve sheet'ler
  utils/openalex.ts    API sorguları, makale dönüştürme, fetchWorkById
  utils/share.ts       bağlantı üretme/okuma, paylaşma
  utils/export.ts      PDF / yazdırma çıktısı
  utils/storage.ts     doğrulamalı localStorage okuma
  utils/auth.ts        giriş / kayıt / şifre sıfırlama (Supabase Auth)
  utils/cloudSync.ts   buluta yazma, çekme, birleştirme
  hooks/useAuth.ts     oturum durumu
  lib/supabase.ts      Supabase istemcisi (anahtar yoksa null)
supabase/schema.sql    tablo + RLS kuralları
```

© 2026 Binali. Her hakkı saklıdır.
