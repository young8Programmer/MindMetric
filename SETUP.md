# MindMetric - Setup Guide

Bu qo'llanma MindMetric loyihasini o'rnatish va ishga tushirish uchun to'liq ko'rsatmalarni o'z ichiga oladi.

## 📋 Talablar

- Node.js 18+ 
- PostgreSQL 14+
- npm yoki yarn
- Git

## 🚀 O'rnatish

### 1. Loyihani klonlash

```bash
git clone <repository-url>
cd MindMetric
```

### 2. Dependencies o'rnatish

```bash
# Root directory
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Database sozlash

PostgreSQL'ni o'rnating va yangi database yarating:

```sql
CREATE DATABASE mindmetric;
CREATE USER mindmetric_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE mindmetric TO mindmetric_user;
```

### 4. Environment variables

#### Backend (.env)

`backend/.env` faylini yarating:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=mindmetric_user
DB_PASSWORD=your_password
DB_DATABASE=mindmetric

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# ClickPayme (Payment Gateway)
CLICKPAYME_MERCHANT_ID=your_merchant_id
CLICKPAYME_SECRET_KEY=your_secret_key
CLICKPAYME_SERVICE_ID=your_service_id

# CORS
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env.local)

`frontend/.env.local` faylini yarating:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 5. Database migrations

```bash
cd backend
npm run migration:run
```

Yoki development rejimida TypeORM avtomatik ravishda jadvallarni yaratadi (`synchronize: true`).

### 6. Serverlarni ishga tushirish

#### Terminal 1 - Backend

```bash
cd backend
npm run start:dev
```

Backend `http://localhost:3001` da ishga tushadi.

#### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:3000` da ishga tushadi.

## 🎮 Foydalanish

1. Brauzerda `http://localhost:3000` ni oching
2. Yangi account yarating (Register)
3. Login qiling
4. Testlarni boshlang:
   - **Reaction Time** - Tezlik testi
   - **Sequence Memory** - Xotira testi
   - **Verbal Memory** - So'z xotirasi testi
5. Natijalarni Stats sahifasida ko'ring
6. Leaderboard'da o'z o'rningizni ko'ring

## 🧠 Brain Age Calculation

Miyya yoshi quyidagi formula bo'yicha hisoblanadi:

```
Brain Age = 20 + (80 - 20) * (1 - (ReactionFactor + MemoryFactor + VerbalFactor) / 300)
```

Har bir test uchun:
- **Reaction Time**: 200ms = 100 ball, 600ms = 0 ball
- **Sequence Memory**: Level 10 = 100 ball, Level 0 = 0 ball
- **Verbal Memory**: 50 so'z = 100 ball, 0 = 0 ball

## 💳 Payment Integration

ClickPayme integratsiyasi uchun:

1. ClickPayme'da account oching
2. Merchant ID, Secret Key va Service ID oling
3. `backend/.env` faylida sozlang
4. Test to'lovlarini amalga oshiring

## 📁 Project Structure

```
MindMetric/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── test/          # Test module (games)
│   │   ├── stats/         # Statistics & leaderboard
│   │   ├── wallet/        # Payment integration
│   │   └── entities/      # Database entities
│   └── ...
├── frontend/
│   ├── app/               # Next.js app router
│   │   ├── test/          # Test pages
│   │   ├── stats/         # Statistics page
│   │   └── ...
│   ├── components/        # React components
│   └── lib/               # Utilities & API
└── ...
```

## 🐛 Troubleshooting

### Database connection error

- PostgreSQL ishlayotganini tekshiring
- `.env` faylidagi database credentials to'g'riligini tekshiring
- Database va user mavjudligini tekshiring

### CORS error

- `backend/.env` faylida `FRONTEND_URL` to'g'ri sozlanganini tekshiring
- Backend va frontend portlari to'g'ri ishlayotganini tekshiring

### JWT error

- `JWT_SECRET` minimal 32 belgidan iborat bo'lishi kerak
- Token muddati tugagan bo'lishi mumkin (logout qilib qayta login qiling)

## 🚀 Production Deployment

### Backend

1. Environment variables'ni production qiymatlariga o'zgartiring
2. `NODE_ENV=production` qilib sozlang
3. Database migration'larni ishga tushiring
4. PM2 yoki Docker orqali deploy qiling

### Frontend

1. `NEXT_PUBLIC_API_URL` ni production API URL'iga o'zgartiring
2. Build qiling: `npm run build`
3. Start qiling: `npm start`
4. Vercel, Netlify yoki boshqa platformaga deploy qiling

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Ro'yxatdan o'tish
- `POST /auth/login` - Login
- `GET /auth/profile` - Profil ma'lumotlari

### Tests
- `POST /test/submit` - Test natijasini yuborish
- `GET /test/history` - Test tarixi
- `GET /test/best-score` - Eng yaxshi natija
- `GET /test/verbal/words` - Verbal test so'zlari

### Statistics
- `GET /stats/leaderboard` - Global reyting
- `GET /stats/me` - Foydalanuvchi statistikasi
- `GET /stats/progress` - Progress grafigi
- `GET /stats/global` - Global statistika

### Wallet
- `POST /wallet/payment` - To'lov yaratish
- `GET /wallet/balance` - Balans
- `GET /wallet/transactions` - Tranzaksiyalar
- `POST /wallet/premium/purchase` - Premium sotib olish

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. Commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request yarating

## 📄 License

MIT License
