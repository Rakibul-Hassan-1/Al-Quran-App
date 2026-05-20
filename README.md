# Quran Web Application

A full-stack Quran web application with enhanced features.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript |
| Backend | Node.js / Hono + Bun |
| Frontend | Next.js 14 (SSG) |
| Styling | Tailwind CSS |
| Database | Quran JSON (from GitHub) |
| Audio | Al-Quran Cloud API (free) |

## Features

- 📖 All 114 Surahs with Arabic text + English translation
- 🔊 Per-ayah audio playback (Al-Quran Cloud CDN)
- 🔍 Search by Arabic or English translation
- 🎨 Font settings (2+ Arabic fonts, size sliders)
- 🌙 Dark theme matching QuranMazid
- 📱 Fully responsive (mobile + desktop)
- 💾 Settings persist via localStorage

## Project Structure

```
quran-app/
├── backend/          # Hono + Bun API server
│   └── src/
│       ├── routes/   # API route handlers
│       ├── data/     # Quran JSON data
│       └── index.ts  # Entry point
└── frontend/         # Next.js app
    └── src/
        ├── app/      # App Router pages
        ├── components/
        ├── hooks/
        ├── lib/
        ├── store/    # Zustand state
        └── types/
```

## Setup & Installation

### Backend

```bash
cd backend
bun install
bun run dev        # Development
bun run start      # Production
```

### Frontend

```bash
cd frontend
npm install
npm run dev        # Development
npm run build      # Production build
npm run start      # Production
```

## Environment Variables

### Backend (`backend/.env`)
```
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Deployment

### Backend → Railway/Render
1. Connect GitHub repo
2. Set root directory to `backend/`
3. Set start command: `bun run start`
4. Add env vars

### Frontend → Vercel
1. Connect GitHub repo
2. Set root directory to `frontend/`
3. Add `NEXT_PUBLIC_API_URL` env var pointing to backend URL

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/surahs` | List all 114 surahs |
| GET | `/api/surahs/:id` | Get surah with all ayahs |
| GET | `/api/ayahs/:surahId/:ayahNumber` | Single ayah |
| GET | `/api/search?q=query` | Search ayahs |

## Audio Source

Uses [Al-Quran Cloud](https://alquran.cloud/api) CDN:
```
https://cdn.islamic.network/quran/audio/128/ar.alafasy/{globalAyahNumber}.mp3
```
# Al-Quran-App
