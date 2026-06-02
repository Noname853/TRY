# Habit AI — Full Stack

Asisten AI berbasis web untuk habit tracking. Implementasi lengkap **Technical PRD v2.0** (Juni 2026).

## Stack

- **Next.js 16.2** (App Router, Turbopack, Server Actions)
- **React 19** (Server Components, `use()` hook)
- **Tailwind CSS v4.3** (CSS-first via `@theme`)
- **TypeScript 5** strict
- **Supabase** (PostgreSQL 17 + Auth + RLS)
- **Anthropic Claude API** (Sonnet 4.6 + Haiku 4.5, prompt caching)
- **Zod** validasi · **Zustand** state · **PWA Push** via web-push

## Setup cepat

```bash
# 1. Install deps
pnpm install   # atau: npm install

# 2. Setup Supabase
#    a. Buat project di https://supabase.com
#    b. SQL Editor → paste db/schema.sql → Run
#    c. Auth → Providers → enable Email

# 3. Setup env
cp .env.example .env.local
# isi nilai dari Supabase + Anthropic + VAPID keys

# 4. Generate VAPID keys (untuk PWA push)
npx web-push generate-vapid-keys

# 5. Jalankan
pnpm dev       # http://localhost:3000
```

## Yang sudah dibuat

### Frontend (UI)
- `/` Landing
- `/login`, `/register` Autentikasi via Server Actions
- `/onboarding` 4-step (nama, AI name, kategori)
- `/dashboard` Stats real-time (streak, completion rate, habits today)
- `/checkin` Chat AI dengan streaming reply, mood/energy picker
- `/goals` AI goal breakdown → milestones + auto-create habits
- `/reflection` Weekly chart + per-habit performance
- `/habits/[id]` Kalender 35 hari + catatan
- `/memory` Daftar AI memory + hapus
- `/settings` Profil, jam notifikasi, push toggle, logout

### Backend (API Routes)
```
/api/auth/{register,login,logout,me}
/api/habits                  GET POST
/api/habits/[id]             PATCH DELETE
/api/habits/[id]/logs        GET POST
/api/checkin                 POST   ← AI conversation
/api/checkin/today           GET
/api/checkin/history         GET
/api/goals                   GET POST  ← AI breakdown
/api/goals/[id]              PATCH DELETE
/api/reflection/weekly       GET    ← AI summary
/api/memory                  GET
/api/memory/[id]             DELETE
/api/notifications/subscribe POST DELETE
/api/notifications/send      POST   ← cron-protected
/api/cron/{morning,evening,streak-warning}
```

### Server Actions
- `loginAction`, `registerAction`, `logoutAction`
- `createHabit`, `toggleHabitLog`, `deleteHabit`
- `completeOnboarding`

### Library
- `lib/claude.ts` — single Anthropic client + prompt caching (`cache_control: ephemeral`, ~90% hemat input token)
- `lib/prompts.ts` — semua 6 prompt templates dari PRD (system, check-in, goal breakdown, weekly reflection, pattern detection, milestone)
- `lib/validations.ts` — Zod schemas
- `lib/supabase/` — browser, server, admin (service role), middleware
- `lib/streak.ts`, `lib/date.ts` — util domain
- `middleware.ts` — auth guard

### Database
- `db/schema.sql` — 6 tabel (users, habits, habit_logs, checkins, goals, ai_memory) lengkap dengan RLS policies + trigger auto-create profile

### PWA & Cron
- `public/sw.js` + `public/manifest.json`
- `vercel.json` — 3 cron jobs (pagi 07:00, malam 21:00, streak warning 22:00 WIB)

## Deploy ke Vercel

```bash
# Push ke GitHub → import di Vercel
# Tambahkan semua env variables dari .env.example
# Cron jobs otomatis aktif (lihat vercel.json)
```

## Catatan biaya AI

Dengan prompt caching aktif:

| Pengguna | Token/bulan | Biaya/bulan |
| -------- | ----------- | ----------- |
| 100      | ~2.9M       | ~$3         |
| 1.000    | ~29M        | ~$30        |
| 10.000   | ~290M       | ~$300       |

## Lihat juga

- [`AGENTS.md`](./AGENTS.md) — panduan untuk AI coding agent
- [`db/schema.sql`](./db/schema.sql) — skema DB siap-tempel
- [`.env.example`](./.env.example) — daftar env vars
