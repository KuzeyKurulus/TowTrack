# 🚛 TowTrack — Oto Kurtarma ve Çekici Yönetim Sistemi

TowTrack, bir oto kurtarma / çekici işletmesinin günlük operasyonlarını (müşteriler, araçlar, çekiciler, sürücüler, işler, ödemeler ve raporlar) tek bir panelden yönetmesini sağlayan full-stack bir web uygulamasıdır.

Bu proje bir **öğrenci portföy projesi** olarak, gerçek hayatta kullanılabilecek düzeyde temiz bir mimari, katmanlı backend, tip güvenli bir frontend ve otomatik testlerle geliştirilmiştir.

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Ekran Görüntüleri](#-ekran-görüntüleri)
- [Kurulum](#-kurulum)
- [Kullanım](#-kullanım)
- [Docker ile Çalıştırma](#-docker-ile-çalıştırma)
- [API](#-api)
- [Test](#-test)
- [Proje Yapısı](#-proje-yapısı)
- [Gelecek Geliştirmeler](#-gelecek-geliştirmeler)
- [Lisans](#-lisans)

---

## 📖 Proje Hakkında

TowTrack üzerinden bir çekici işletmesi:

- Müşteri kayıtlarını ve araçlarını,
- Kendi çekici filosunu ve sürücülerini,
- Kurtarma/çekici işlerini uçtan uca (talep → atama → tamamlanma),
- Ödeme durumlarını ve gelirlerini,
- Günlük / haftalık / aylık istatistiklerini

tek bir yönetim panelinden takip edebilir. Arayüz tamamen Türkçedir; kod tabanındaki sınıf, metod ve değişken isimleri ise İngilizcedir.

## ✨ Özellikler

- 📊 Gerçek zamanlı verilerle beslenen **Dashboard** (toplam iş, gelir, aktif çekici, aylık gelir grafiği, iş durumu dağılımı)
- 👥 **Müşteri yönetimi** — CRUD, arama, müşteri detayında araç ve iş geçmişi
- 🚗 **Araç yönetimi** — CRUD, plaka benzersizliği, müşteriye göre filtreleme
- 🛻 **Çekici yönetimi** — CRUD, durum değiştirme (Müsait / Görevde / Bakımda / Pasif)
- 🧑‍✈️ **Sürücü yönetimi** — CRUD, duruma göre filtreleme
- 🧾 **İş yönetimi** — otomatik iş numarası (`TT-2026-00001` formatında), gelişmiş filtreleme, durum ve ödeme takibi, yazdırılabilir iş formu
- 📈 **Raporlar** — tarih aralığına göre gelir, iş tipi/ödeme dağılımı, çekici ve sürücü performansı
- 🔔 Toast bildirimleri, silme onayı modalları, form doğrulama, loading/empty/error durumları
- 📱 Responsive tasarım (mobil, tablet, masaüstü)
- 🧪 xUnit + EF Core InMemory ile servis katmanı testleri
- 🐳 Docker ve docker-compose ile tek komutla ayağa kalkan ortam

## 🛠 Teknolojiler

**Backend**
- C# / ASP.NET Core 8 Web API
- Entity Framework Core 8 + SQLite
- FluentValidation
- Swagger / OpenAPI

**Frontend**
- React 18 + TypeScript
- Vite
- Bootstrap 5
- Axios, React Router, Recharts

**Test**
- xUnit
- EF Core InMemory

**Diğer**
- Docker / docker-compose
- Git / GitHub

## 🖼 Ekran Görüntüleri

> Uygulamayı çalıştırdıktan sonra bu bölüme kendi ekran görüntülerinizi ekleyebilirsiniz.
> Örnek: `docs/screenshots/dashboard.png` şeklinde bir klasöre görselleri koyup aşağıdaki gibi referans verebilirsiniz.

```md
![Dashboard](docs/screenshots/dashboard.png)
![İşler](docs/screenshots/jobs.png)
![İş Detayı](docs/screenshots/job-detail.png)
```

## 🚀 Kurulum

### Gereksinimler

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/) ve npm
- Git

### 1. Depoyu klonlayın

```bash
git clone <github.com/KuzeyKurulus/TowTrack>
cd TowTrack
```

### 2. Backend'i çalıştırın

```bash
cd backend/TowTrack.Api
dotnet restore
dotnet build
dotnet run
```

Backend varsayılan olarak `http://localhost:5080` adresinde çalışır. İlk çalıştırmada SQLite veritabanı otomatik oluşturulur ve gerçekçi demo verileriyle (8 müşteri, 10 araç, 4 çekici, 5 sürücü, 20 iş) doldurulur (seed script'i tekrar çalıştırıldığında duplicate veri oluşturmaz).

Swagger arayüzüne `http://localhost:5080/swagger` adresinden ulaşabilirsiniz.

### 3. Frontend'i çalıştırın

Yeni bir terminalde:

```bash
cd frontend
npm install
npm run dev
```

Frontend varsayılan olarak `http://localhost:5173` adresinde çalışır ve backend API'sine `http://localhost:5080/api` üzerinden bağlanır (bkz. `frontend/.env.example`).

## 🖱 Kullanım

1. Backend ve frontend'i yukarıdaki adımlarla başlatın.
2. Tarayıcıda `http://localhost:5173` adresini açın.
3. Sol menüden Dashboard, İşler, Müşteriler, Araçlar, Çekiciler, Sürücüler ve Raporlar sayfaları arasında gezinebilirsiniz.
4. "Yeni İş" butonuyla müşteri, araç, çekici ve sürücü seçerek yeni bir iş kaydı oluşturabilir; iş detay sayfasından durumunu güncelleyebilir, düzenleyebilir veya profesyonel bir servis formu olarak yazdırabilirsiniz.

## 🐳 Docker ile Çalıştırma

Proje kök dizininde:

```bash
docker-compose up --build
```

Bu komut sonrasında:

- Backend: `http://localhost:5080`
- Frontend: `http://localhost:5173`

adreslerinden erişilebilir hale gelir. Veritabanı, konteyner yeniden oluşturulsa bile kalıcı olması için bir Docker volume'unda (`towtrack-data`) tutulur.

Servisleri durdurmak için:

```bash
docker-compose down
```

## 🔌 API

RESTful API, aşağıdaki ana kaynaklar üzerinde standart CRUD uçları sunar:

```
GET    /api/customers
POST   /api/customers
GET    /api/customers/{id}
PUT    /api/customers/{id}
DELETE /api/customers/{id}

GET    /api/vehicles
POST   /api/vehicles
GET    /api/vehicles/{id}
PUT    /api/vehicles/{id}
DELETE /api/vehicles/{id}

GET    /api/towtrucks
POST   /api/towtrucks
GET    /api/towtrucks/{id}
PUT    /api/towtrucks/{id}
PATCH  /api/towtrucks/{id}/status
DELETE /api/towtrucks/{id}

GET    /api/drivers
POST   /api/drivers
GET    /api/drivers/{id}
PUT    /api/drivers/{id}
DELETE /api/drivers/{id}

GET    /api/jobs
POST   /api/jobs
GET    /api/jobs/{id}
PUT    /api/jobs/{id}
PATCH  /api/jobs/{id}/status
DELETE /api/jobs/{id}

GET    /api/dashboard
GET    /api/reports
```

Tüm uçlar ve şemaları için backend çalışırken `http://localhost:5080/swagger` adresini ziyaret edin.

## 🧪 Test

Backend testlerini çalıştırmak için:

```bash
cd backend/TowTrack.Tests
dotnet test
```

Test kapsamı:
- Müşteri CRUD işlemleri ve arama
- İş oluşturma ve otomatik iş numarası üretimi
- İş listeleme ve sayfalama
- FluentValidation kuralları
- Dashboard gelir/iş sayısı hesaplamaları

## 📁 Proje Yapısı

```
TowTrack/
├── backend/
│   ├── TowTrack.Api/
│   │   ├── Controllers/       # API controller'ları
│   │   ├── Data/              # DbContext ve seed data
│   │   ├── DTOs/              # Request/response modelleri
│   │   ├── Entities/          # EF Core entity'leri
│   │   ├── Helpers/           # Enum dönüşümü, özel exception'lar
│   │   ├── Middleware/        # Global exception handling
│   │   ├── Services/          # İş mantığı katmanı
│   │   ├── Validators/        # FluentValidation kuralları
│   │   ├── Properties/
│   │   ├── Program.cs
│   │   └── appsettings.json
│   ├── TowTrack.Tests/        # xUnit test projesi
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Ortak UI bileşenleri
│   │   ├── pages/             # Sayfa bileşenleri
│   │   ├── services/          # Axios API servisleri
│   │   ├── types/             # TypeScript tip tanımları
│   │   ├── hooks/             # useToast vb. custom hook'lar
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
│
├── docker-compose.yml
├── README.md
├── .gitignore
└── .env.example
```

## 🔭 Gelecek Geliştirmeler

Aşağıdaki özellikler bu sürümde **kasıtlı olarak** uygulanmamıştır ve ileride eklenebilir:

- JWT Authentication
- Role-based authorization (yönetici / operatör / sürücü rolleri)
- SMS bildirimi
- WhatsApp entegrasyonu
- Google Maps ile canlı konum takibi
- Online ödeme entegrasyonu
- PDF fatura oluşturma
- Mobil uygulama (React Native)
- Çoklu işletme / çoklu şube desteği

## 📄 Lisans

Bu proje, portföy ve açık kaynak topluluğuna katkı amacıyla **[GNU General Public License v3.0 (GPLv3)](https://www.gnu.org/licenses/gpl-3.0.html)** kapsamında lisanslanmıştır. 

Bu lisans doğrultusunda:
- Kodları inceleyebilir, çalıştırabilir ve üzerinde geliştirmeler yapabilirsiniz.
- Projeden türetilen veya kodlarını kullanan çalışmalar da aynı şekilde **açık kaynak (GPLv3)** olarak paylaşılmak zorundadır; kodlar kapalı kaynaklı ticari ürünlere dönüştürülemez.

Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

---
