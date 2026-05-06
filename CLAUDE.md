# Mixtape — guide for Claude (and other agents)

This file gives Claude (or any AI tool) the context it needs to work in this repo.

## What this is

Mixtape is a **music-sharing & meetup app**. The core idea is:

- Users share their **top 5s** across categories (albums, artists, genres, songs, live performances they've been to).
- Top 5s come in two layers: **identity** (all-time) and **mood** (refreshed monthly).
- Users keep a **wishlist** of upcoming shows; others can ask to tag along.
- Users can host **meetups** tagged with the taste they're for, so the right people find them.

We deliberately **avoid streaming-service integrations** (too restrictive). For canonical track/album/artist data we use **MusicBrainz** + Cover Art Archive — both free, public, no API key.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-variable themed, class-based dark mode) |
| Animations | Framer Motion |
| ORM / DB | Prisma 6 → Neon Postgres |
| Auth | NextAuth.js v5 (Auth.js) with Prisma adapter |
| Music data | MusicBrainz API (no key) + Cover Art Archive |
| Hosting | Vercel |
| Package manager | npm (`legacy-peer-deps=true` in `.npmrc`) |

## Repo layout

```
src/
  app/
    layout.tsx            # root layout: nav, footer, theme init script, analytics
    page.tsx              # landing page
    globals.css           # Tailwind v4 + theme tokens (light/dark)
    me/page.tsx           # full profile editor — avatar (cropped), bio, top 5s, insights, public preview
    u/[username]/page.tsx # public read-only profile (header + insights + showcase)
    wishlist/page.tsx     # user's wishlisted upcoming shows
    meetups/page.tsx      # browse meetups
    signin/page.tsx       # auth entry
    api/
      auth/[...nextauth]/route.ts   # NextAuth handlers
      music/search/route.ts         # MusicBrainz proxy (album/artist/song)
  auth.ts                 # NextAuth config (Prisma adapter, providers)
  auth-handlers.ts        # GET/POST handlers re-exported
  components/
    Navbar.tsx, Footer.tsx, Hero.tsx
    ThemeToggle.tsx       # light/dark toggle + pre-hydration init script
    AvatarUploader.tsx    # file picker + circle-crop (react-image-crop) -> data URL
    ProfileHeader.tsx     # editable + read-only header (avatar, name, bio, location)
    TasteTypeahead.tsx    # generic MB-backed search dropdown w/ thumbnails
    TopFiveCategory.tsx   # 5-slot input grid for one category
    TasteShowcase.tsx     # server-renderable visual layout of top 5s (grids, tier, list)
    TasteInsights.tsx     # completeness ring, vibe blurb, recurring-name crossovers
    MeProfileEditor.tsx   # client editor that composes everything for /me
    WishlistEditor.tsx    # form + list for /wishlist
  lib/
    prisma.ts             # singleton Prisma client
    music-search.ts       # client + types for /api/music/search
    taste.ts              # TasteEntry types, category metadata
    wishlist.ts           # WishlistShow types
    profile.ts            # Profile type + storage key
    genres.ts             # curated genre list (used by GenreSelect)
    insights.ts           # pure functions to derive insights from entries
    local-store.ts        # localStorage shim — replace with server actions later
prisma/
  schema.prisma           # User/Account/Session + TasteEntry/MoodEntry/WishlistShow/Meetup/Attendee
```

## Domain model (Prisma)

- **User** — auth-bound. Adds `username`, `bio`, `location` for public profiles.
- **TasteEntry** — `(userId, category, position 1..5)` unique. `category` is `ALBUM | ARTIST | GENRE | SONG | LIVE_SHOW`. Identity layer.
- **MoodEntry** — same shape, scoped to a `monthKey` (e.g. `"2026-05"`).
- **WishlistShow** — future shows the user wants to go to. Public.
- **Meetup** — has `tasteFilters: String[]` for matching to users.
- **Attendee** — many-to-many between users and meetups.

## Local development

```bash
npm install              # legacy-peer-deps via .npmrc; runs prisma generate
cp .env.example .env     # fill DATABASE_URL/DIRECT_URL/AUTH_SECRET
npm run db:push          # sync schema to Neon
npm run dev              # http://localhost:3000
```

Useful scripts: `dev`, `build`, `typecheck`, `lint`, `db:push`, `db:studio`.

## Auth status (right now)

NextAuth is wired in (`src/auth.ts`) with the Prisma adapter. **Google sign-in is gated on env vars** — if `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` are missing, the providers list is empty (no crash). This lets us deploy and iterate before auth is fully provisioned.

## Persistence status (right now)

Until auth + DB are connected, the **taste editor and wishlist persist to `localStorage`** (see `src/lib/local-store.ts`). When wiring up the real backend:

1. Replace `loadJSON`/`saveJSON` calls in `TasteEditor.tsx` / `WishlistEditor.tsx` with server actions.
2. Server actions read `auth()` for the user and write through `prisma.tasteEntry.upsert(...)` / `prisma.wishlistShow.create(...)`.
3. `/u/[username]/page.tsx` should swap its `SAMPLE_PROFILES` map for `prisma.user.findUnique({ where: { username }, include: { taste: true } })`.

## MusicBrainz integration

- Endpoint: `GET /api/music/search?q=<q>&kind=album|artist|song`
- Server-side proxy with `User-Agent: Mixtape/0.1 (...)` — required by MB.
- Responses cached for 1 hour via `next: { revalidate: 3600 }`.
- Cover art via `https://coverartarchive.org/release-group/{mbid}/front-250` (uses `<img>` since the URL 307-redirects to archive.org subdomains we can't allowlist for `next/image`).
- Genres are NOT from MB — they come from a curated list in `lib/genres.ts` so matching works.
- Live performances (favorite past shows) are **freeform** for now: artist + venue/year string. We can upgrade to MB-backed setlists later (Setlist.fm has a free API).

## Conventions

- TypeScript strict. `tsc --noEmit` on every PR (CI runs this).
- Path alias `@/*` → `src/*`.
- Server components by default; mark `"use client"` only when needed (state, effects, browser APIs).
- Theme tokens are CSS variables (`--color-foreground`, etc.). Use `[color:var(--color-foreground)]` or `bg-[color:var(--color-card)]` instead of hard-coded colors so light/dark works.
- Avoid hard-coded brand colors except in gradients (those are fine).
- No comments unless they explain *why* something non-obvious is the way it is.

## Commands you'll commonly run

```bash
npm run typecheck     # tsc --noEmit
npm run lint          # next lint
npm run build         # prisma generate + next build
npm run db:studio     # open Prisma Studio
```

## Things to avoid

- **Don't add Spotify/Apple Music/etc. integrations** — restrictive and not the point.
- **Don't introduce a heavy UI library** (shadcn etc.) without asking — the design is bespoke.
- **Don't break the localStorage shim path** without also swapping in real persistence — you'll lose the demo flow.
- **Don't push directly to `main`.** Develop on a feature branch and open a PR.
