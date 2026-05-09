# 🚗 Korea Car Import Platform

> Koreadan Markaziy Osiyo va Dubayga avtomobil import platformasi

## Tech Stack

| Layer | Texnologiya |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Backend API | NestJS 11, TypeScript, Prisma |
| Batch Service | NestJS 11, Claude AI, Cron Jobs |
| Database | PostgreSQL 16 (Supabase) |
| Cache | Redis 7 |
| Media | AWS S3 |
| Real-time | Socket.io (WebSocket) |
| Auth | JWT + Google OAuth |

## Monorepo Structure

```
korea-car-import/
├── apps/
│   ├── api/          # NestJS REST API + WebSocket
│   ├── web/          # Next.js Frontend
│   └── batch/        # NestJS Cron Jobs (AI batch)
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── utils/        # Shared utility functions
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Quick Start

### 1. Database va Redis (Docker)

```bash
docker-compose up -d
```

### 2. Environment variables

```bash
cp apps/api/.env.example apps/api/.env
# .env faylni to'ldiring
```

### 3. Database setup

```bash
npm run db:push         # Schema push
npm run db:seed         # Seed data
npm run db:studio       # Prisma Studio (GUI)
```

### 4. Development

```bash
# Barcha app'larni bir vaqtda ishga tushirish
npm run dev

# Alohida ishga tushirish
npm run dev:api         # API: http://localhost:4000
npm run dev:web         # Web: http://localhost:3000
npm run dev:batch       # Batch: http://localhost:4001
```

### 5. API Docs

Swagger: http://localhost:4000/api/docs

## Scripts

| Script | Tavsif |
|---|---|
| `npm run dev` | Barcha app'larni ishga tushirish |
| `npm run build` | Production build |
| `npm run db:generate` | Prisma client generate |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to DB |
| `npm run db:studio` | Open Prisma Studio |
