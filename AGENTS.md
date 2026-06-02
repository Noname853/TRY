# AGENTS.md — Habit AI

Panduan untuk AI coding agent yang bekerja di project Next.js 16 ini.

## Stack

- **Next.js 16** App Router + Turbopack (default)
- **React 19** Server Components + `use()` + Server Actions
- **Tailwind CSS v4** — CSS-first config via `@theme` block di `app/globals.css` (tidak ada `tailwind.config.js`)
- **TypeScript 5** strict mode
- **Supabase** untuk auth, DB (PostgreSQL 17), realtime
- **Anthropic Claude API** (`claude-sonnet-4-6` utama, `claude-haiku-4-5` untuk notifikasi)
- **Zod** untuk validasi I/O (semua API routes)
- **Zustand v5** untuk client state (chat, habits)
- **pnpm** rekomendasi (npm juga jalan)

## Arsitektur folder

```
app/
  (auth)            login, register, onboarding
  (dashboard)       dashboard, checkin, goals, reflection, habits/[id], memory, settings
  api/              REST API Routes
  actions/          Server Actions ("use server")
lib/
  supabase/         client (browser), server (RSC), admin (service role), middleware
  claude.ts         Single Anthropic client + prompt caching
  prompts.ts        Semua prompt templates dari PRD section 4
  validations.ts    Zod schemas (loginSchema, habitCreateSchema, dll)
  date.ts           Util tanggal Asia/Jakarta
  streak.ts         Hitung streak + completion rate
  push.ts           web-push helper
  api.ts            withAuth, parseBody, error helpers
store/              Zustand stores
db/schema.sql       Skema DB lengkap (jalankan di Supabase SQL Editor)
components/         UI reusable
public/sw.js        Service Worker untuk push
middleware.ts       Auth guard (Supabase SSR)
vercel.json         Cron jobs notifikasi
```

## Aturan main saat menulis kode

1. **Server Components by default.** Tandai `"use client"` hanya jika butuh state/effect/event handler.
2. **Auth selalu di server side.** Gunakan `getSessionUser()` dari `lib/supabase/server.ts`, JANGAN trust user ID dari client.
3. **RLS aktif di semua tabel.** Query Supabase otomatis ter-filter oleh RLS. Jangan pakai admin client kecuali untuk cron/scheduled jobs.
4. **Validasi semua input dengan Zod.** API routes gunakan `parseBody()`, Server Actions gunakan `.parse()` atau `.safeParse()`.
5. **Claude API selalu lewat `lib/claude.ts`** — supaya prompt caching konsisten. Jangan instansiasi Anthropic SDK di tempat lain.
6. **Prompt templates di `lib/prompts.ts`**, jangan inline di route handler.
7. **Tailwind v4:** tambah token di `@theme` block, bukan config file. Gunakan utility `var(--color-…)` atau syntax `bg-[--color-bg-card]`.
8. **Tipe data dari `lib/supabase/types.ts`** — jangan tulis ulang.
9. **Date di-anchor ke Asia/Jakarta.** Pakai `todayISO()` dari `lib/date.ts`.

## Command

```bash
pnpm install
pnpm dev      # Turbopack — http://localhost:3000
pnpm build
pnpm start
```

## Env variables

Lihat `.env.example`. Wajib ada untuk dev:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server only)
- `ANTHROPIC_API_KEY` (server only)
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` (untuk push) — generate dengan `npx web-push generate-vapid-keys`
- `CRON_SECRET` untuk proteksi endpoint cron

## Setup Supabase

1. Buat project baru di Supabase
2. SQL Editor → tempel isi `db/schema.sql` → Run
3. Auth → Providers → enable Email
4. Copy URL + anon key + service role key ke `.env.local`

## Konvensi prompt Claude

- System prompt selalu pakai persona dari `systemPrompt()` di `lib/prompts.ts`
- `cache_control: { type: "ephemeral" }` di system → ~90% hemat input token
- Batasi history percakapan ke 10 pesan terakhir (sudah otomatis di `callClaude`)
- Pakai `MODEL_HAIKU` untuk notifikasi singkat (volume tinggi, biaya rendah)
- Pakai `MODEL_SONNET` untuk respon natural / analisis / JSON breakdown
