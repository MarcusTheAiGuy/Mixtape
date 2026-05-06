# Mixtape

Share music, find your people. A music-sharing & meetup app built with Next.js, Prisma, Neon, and NextAuth.

## Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Database**: Postgres on [Neon](https://neon.tech)
- **ORM**: Prisma 6
- **Auth**: NextAuth.js v5 (Auth.js) with Prisma adapter
- **Hosting**: Vercel
- **Analytics**: `@vercel/analytics`

## Local development

```bash
# 1. Install
npm install

# 2. Set up env
cp .env.example .env
# Fill in DATABASE_URL, DIRECT_URL, AUTH_SECRET (and Google creds if you want sign-in)

# 3. Push the Prisma schema to your database
npm run db:push

# 4. Run
npm run dev
```

App boots at http://localhost:3000.

### Useful scripts

- `npm run dev` — local dev server
- `npm run build` — `prisma generate` + production build
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` — `next lint`
- `npm run db:push` — sync Prisma schema to the database
- `npm run db:studio` — open Prisma Studio

## Deploy to Vercel + Neon

### 1. Provision Neon

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Grab two connection strings from **Connection Details**:
   - **Pooled connection** → set as `DATABASE_URL` (used by the app at runtime).
   - **Direct connection** → set as `DIRECT_URL` (used by Prisma migrations).

### 2. Push to Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: **Next.js**. Build command: `npm run build` (default). Install: `npm install`.
3. In **Settings → Environment Variables**, add:
   - `DATABASE_URL` (pooled Neon URL)
   - `DIRECT_URL` (direct Neon URL)
   - `AUTH_SECRET` (`openssl rand -base64 32`)
   - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (optional)
4. Deploy.

The `postinstall` and `build` scripts both run `prisma generate`, so the client is always fresh on Vercel.

### 3. Run the first migration

From your local machine, with `DIRECT_URL` set in `.env`:

```bash
npm run db:push
```

(or run `npx prisma migrate deploy` once you start managing migrations.)

## Project layout

```
src/
  app/
    layout.tsx          # root layout: Navbar, Footer, Analytics
    page.tsx            # landing page
    globals.css         # Tailwind v4 + theme tokens
    mixtapes/page.tsx   # browse mixtapes
    meetups/page.tsx    # browse meetups
    signin/page.tsx     # auth entry
    api/auth/[...nextauth]/route.ts
  auth.ts               # NextAuth config (Prisma adapter, providers)
  auth-handlers.ts      # GET/POST handlers re-exported for the route file
  lib/prisma.ts         # singleton Prisma client
  components/           # Navbar, Footer, Hero, ...
prisma/
  schema.prisma         # User/Account/Session + Mixtape/Track/Meetup/Attendee
```

## Domain model (starter)

- **User** — auth-bound profile.
- **Mixtape** — a curated playlist with `tracks[]`, owned by a user.
- **Track** — title, artist, optional URL, ordered by `position`.
- **Meetup** — venue/time/host event.
- **Attendee** — many-to-many between users and meetups.

Extend in `prisma/schema.prisma`, then `npm run db:push`.
