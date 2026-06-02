# Habit AI

Asisten AI berbasis web untuk habit tracking — implementasi UI sesuai mockup dan Technical PRD v2.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS v4** (CSS-first config via `@theme`)
- **TypeScript 5**

> Backend integration (Supabase, Claude API, Server Actions) menyusul pada milestone berikutnya — saat ini repo berisi UI scaffold 6 layar utama yang sesuai mockup.

## Menjalankan

```bash
pnpm install   # atau: npm install
pnpm dev       # http://localhost:3000
```

## Layar yang sudah dibuat

| Route           | Halaman              |
| --------------- | -------------------- |
| `/`             | Index — semua layar  |
| `/login`        | Login / Sign in      |
| `/onboarding`   | Onboarding 4-step    |
| `/dashboard`    | Dashboard utama      |
| `/checkin`      | Daily Check-in (chat)|
| `/goals`        | Tujuan & milestone   |
| `/reflection`   | Weekly Reflection    |

## Struktur

```
app/
  layout.tsx          # Root layout + Google Fonts
  globals.css         # Tailwind v4 + design tokens
  page.tsx            # Index showcase
  login/
  onboarding/
  dashboard/
  checkin/
  goals/
  reflection/
components/
  phone/
    PhoneShell.tsx    # Mobile frame shell
    BottomNav.tsx     # Bottom navigation
```

## Selanjutnya (sesuai PRD)

- [ ] Integrasi Supabase Auth (login/register/session)
- [ ] Tabel `users`, `habits`, `habit_logs`, `checkins`, `goals`, `ai_memory`
- [ ] API Routes `/api/habits`, `/api/checkin`, `/api/goals`, `/api/reflection`
- [ ] Claude API client (`lib/claude.ts`) + prompt templates (`lib/prompts.ts`)
- [ ] Zod validation schemas
- [ ] Zustand store untuk chat & habits client state
- [ ] PWA Web Push (Service Worker + VAPID)
