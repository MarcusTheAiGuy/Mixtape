# Architecture

A walking tour of how Mixtape is wired up. Read this before any non-trivial change to a shared piece of plumbing — it'll save you guessing.

## The shape of the app

Three core domains:

1. **Profile + taste** — who someone is and what they're into (`/me`, `/u/[username]`)
2. **Discovery** — surfacing other people based on taste overlap (`/discover`)
3. **Events** — wishlist (future shows) + meetups (curated gatherings)

Everything else (mood diary, theming, onboarding) is a layer on top of these.

## Data flow

```
            ┌──────────────────────────────┐
            │     Server Components        │  src/app/**/page.tsx
            │  (Next.js App Router)        │
            └──────────────┬───────────────┘
                           │ reads
                           ▼
            ┌──────────────────────────────┐
            │    Data layer                │  src/lib/data/
            │  if hasDb()  → prisma.X      │
            │  else        → SAMPLE_USERS  │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │   Postgres (Neon) via Prisma │  prisma/schema.prisma
            └──────────────────────────────┘

            ┌──────────────────────────────┐
            │    Client Components         │  src/components/
            │  (taste editor, typeahead,   │
            │   showcase, discover list)   │
            └──────────────┬───────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
   ┌──────────────────┐      ┌──────────────────┐
   │ Server Actions   │      │ localStorage     │
   │ src/app/_actions │      │ src/lib/         │
   │  (signed-in)     │      │  local-store.ts  │
   └──────────────────┘      └──────────────────┘
```

Two persistence paths exist on purpose. **Until auth and Neon are connected**, the app runs in "demo mode": the client reads/writes localStorage and the server pages fall back to `SAMPLE_USERS`. This keeps the whole product flow demoable without infrastructure.

Once `DATABASE_URL` is set + a user signs in:
- `/api/me/whoami` reports `{ authenticated: true, hasDb: true }`
- `SyncStatus` flips to "saving to your account"
- Client components call **server actions** in `src/app/_actions/*` instead of localStorage
- `getUserByUsername` and `listDiscoverableUsers` start hitting Prisma

## What happens when a user fills in their top 5s

1. User types into a `TasteTypeahead` component (client).
2. The component fetches `/api/music/search?q=...&kind=album` (server route).
3. The route hits MusicBrainz with a polite User-Agent + 1-hour cache and shapes results.
4. User picks one; the `TopFiveCategory` parent slots it into the right position.
5. `MeProfileEditor` writes the new `entries[]`:
   - **Demo mode**: `saveJSON(STORAGE_KEYS.identity, entries)`
   - **Authed + DB**: `replaceTaste(entries)` server action → wipes + re-inserts in a transaction
6. The "Insights" card recomputes immediately (pure function over `entries`).
7. The "Public preview" card re-renders with the new `<TasteShowcase>`.
8. Anywhere else this user appears (Discover, `/u/[username]`) gets updated next request — server actions call `revalidatePath`.

## What happens on someone else's profile

1. `/u/[username]/page.tsx` (server) calls `getUserByUsername(username)`.
2. Data layer returns either a Prisma row or a sample user.
3. The page renders `<ProfileTheme>` (CSS var override) → `<ProfileHeader>` → `<MatchInCommon>` → `<TasteInsights>` → `<TasteShowcase>`.
4. `<MatchInCommon>` is a **client island**: it reads the *viewer's* taste from localStorage and computes overlap against the page's `targetTaste` prop using `lib/match.ts`.

## Pure functions worth knowing

The brains of the app are intentionally pure (zero side effects, fully unit-tested in `src/lib/__tests__`):

- `computeMatch(a, b)` (`lib/match.ts`) — weighted Jaccard across 5 lanes
- `computeMeetupFit(entries, filters)` (`lib/meetup-fit.ts`) — substring fit with category weights
- `computeInsights(entries)` (`lib/insights.ts`) — completeness, vibe blurb, crossovers

Tweak with the test file open — these are the easiest places to break product feel.

## Conventions

- **Server vs client**: server by default, `"use client"` only when needed (state, effects, browser APIs). Most page components are server; data passes down as props.
- **CSS vars > hardcoded colors**: every theme token (`--color-foreground`, `--color-accent`, etc.) is declared on `:root` and `.dark`. Use `[color:var(--color-foreground)]` or `bg-[color:var(--color-card)]/40` instead of `text-zinc-100`.
- **UI primitives**: prefer `<Button>`, `<Card>`, `<Chip>`, `<Field>`, `<SectionLabel>` from `src/components/ui/`. They centralise the rounded-2xl / pill / eyebrow patterns.
- **Length limits**: every string field has a numeric cap in `lib/profile.ts` (`PROFILE_LIMITS`). Use `maxLength` on inputs *and* slice in the onChange handler — don't trust either alone.

## When to reach for what

- New page → `src/app/<route>/page.tsx` (server). Keep it thin; pull data from `lib/data/*`.
- New persisted thing → schema change → a server action in `src/app/_actions/*` and a localStorage shim for demo mode → a client component that prefers the action when `hasDb && authenticated`.
- New external API → server route handler in `src/app/api/...` with a typed shape returned. Cache responses where possible.
- New surface (button, label, etc.) → check `src/components/ui/` first; extract a primitive if it's used 2+ places.

## What's intentionally not here

- No Spotify / Apple Music / etc. integrations. We use MusicBrainz as the canonical music DB so we never have to deal with proprietary auth flows.
- No follower graph yet. Profiles are public. We may add follows once the social weight is heavy enough to warrant it.
- No streaming-service-style image upload. Avatar is cropped client-side and stored as a 512×512 JPEG data URL for now; swap to Vercel Blob when you outgrow localStorage.
