# MindMetric - Quick Start Guide

## ⚡ Tezkor Boshlash (5 daqiqa)

### 1. Database ishga tushirish

Docker orqali (tavsiya etiladi):
```bash
docker-compose up -d
```

Yoki PostgreSQL'ni o'zingiz o'rnating va database yarating.

### 2. Environment Variables

```bash
# Backend
cd backend
cp .env.example .env
# .env faylini tahrirlang

# Frontend  
cd ../frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Dependencies

```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Ishga tushirish

**Terminal 1:**
```bash
cd backend
npm run start:dev
```

**Terminal 2:**
```bash
cd frontend
npm run dev
```

### 5. Brauzerda ochish

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 🎯 Birinchi Qadamlar

1. **Register** - Yangi account yarating
2. **Login** - Tizimga kiring
3. **Test boshlash** - Biron bir testni boshlang
4. **Natijalarni ko'rish** - Stats sahifasida natijalarni ko'ring

## 📝 Muhim Eslatmalar

- Development rejimida TypeORM avtomatik database yaratadi
- JWT_SECRET minimal 32 belgi bo'lishi kerak
- ClickPayme integratsiyasi test uchun sozlanmagan bo'lishi mumkin

## 🆘 Muammo bo'lsa?

`SETUP.md` faylida batafsil ko'rsatmalar bor.
