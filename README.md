# MindMetric 🧠

Professional Brain Performance Testing Platform - Test your cognitive abilities and discover your brain age!

## 🚀 Features

- **Reaction Time Test** - Measure your response speed
- **Sequence Memory** - Test your memory capacity
- **Verbal Memory** - Challenge your word recognition
- **Brain Age Calculation** - Get your cognitive age based on test results
- **Global Leaderboard** - Compare with users worldwide
- **User Profiles** - Track your progress over time
- **Premium Features** - Unlock advanced tests and detailed analytics

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **PostgreSQL** - Database
- **JWT** - Authentication
- **ClickPayme** - Payment integration

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching

## 📁 Project Structure

```
MindMetric/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── test/     # Test module (games)
│   │   ├── stats/    # Statistics & leaderboard
│   │   └── wallet/   # Payment integration
│   └── ...
├── frontend/         # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── ...
└── ...
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd MindMetric
```

2. Install dependencies
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

3. Set up environment variables
```bash
# Backend .env
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# Frontend .env
cp frontend/.env.example frontend/.env
```

4. Run database migrations
```bash
cd backend
npm run migration:run
```

5. Start development servers
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

## 🧪 Tests

- Reaction Time: Measures response speed in milliseconds
- Sequence Memory: Tests working memory capacity
- Verbal Memory: Challenges word recognition and recall

## 🧮 Brain Age Formula

Brain Age is calculated using a weighted average of performance factors from all tests:

```
Brain Age = (ReactionTime_Factor + MemoryScore_Factor + Verbal_Factor) / 3
```

## 📝 License

MIT
