# Setup checklist (Marcus)

A running list of things you (and only you) need to do once you're back at your computer. Tick them off as you go. Items higher up unblock more.

## 1. Get the code running locally

- [ ] **Clone the repo**
      ```bash
      git clone https://github.com/MarcusTheAiGuy/Mixtape.git
      cd Mixtape
      ```
- [ ] **Switch to the working branch**
      ```bash
      git fetch origin
      git checkout claude/setup-music-app-base-EAdx1
      ```
- [ ] **Install dependencies**
      ```bash
      npm install
      ```
      (This auto-runs `prisma generate`. The `.npmrc` already sets `legacy-peer-deps=true` for the NextAuth peer-range issue.)
- [ ] **Boot the dev server (no DB needed yet)**
      ```bash
      npm run dev
      ```
      Open http://localhost:3000 and click around: `/`, `/me`, `/wishlist`, `/meetups`, `/u/marcus`. Top 5s + wishlist + avatar all save to localStorage so you can fully try the UX before any DB work.

## 2. Provision the database (Neon)

- [ ] Create a free account at https://console.neon.tech
- [ ] Create a project named `mixtape` (region close to where you'll deploy)
- [ ] Open **Connection Details** and copy two connection strings:
  - **Pooled connection** (the one with `-pooler` in the host) → `DATABASE_URL`
  - **Direct connection** (no `-pooler`) → `DIRECT_URL`
- [ ] Create `.env` from the template and fill the URLs:
      ```bash
      cp .env.example .env
      ```
- [ ] Generate a NextAuth secret and paste it into `.env` as `AUTH_SECRET`:
      ```bash
      openssl rand -base64 32
      ```
- [ ] Push the schema to Neon (creates all tables):
      ```bash
      npm run db:push
      ```
- [ ] (Optional) Open Prisma Studio to browse the empty tables:
      ```bash
      npm run db:studio
      ```

## 3. Set up auth (Google sign-in, optional but useful)

- [ ] Go to https://console.cloud.google.com/apis/credentials
- [ ] Create a new project (e.g. "Mixtape")
- [ ] Configure the OAuth consent screen (External, Testing mode is fine)
- [ ] Create credentials → **OAuth client ID** → Web application
  - Authorized JavaScript origins: `http://localhost:3000`, `https://your-vercel-domain.vercel.app`
  - Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`, `https://your-vercel-domain.vercel.app/api/auth/callback/google`
- [ ] Paste the resulting client ID + secret into `.env` as `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
- [ ] Restart `npm run dev` and visit `/signin` — you should see "Continue with Google"

## 4. Deploy to Vercel

- [ ] Push your local changes (or merge the working branch to `main`)
- [ ] Go to https://vercel.com/new and import the repo
- [ ] Framework preset: **Next.js** (Vercel detects it). Build command: leave default (`npm run build`).
- [ ] In **Project Settings → Environment Variables**, add (for Production + Preview):
  - `DATABASE_URL` (pooled Neon URL)
  - `DIRECT_URL` (direct Neon URL)
  - `AUTH_SECRET`
  - `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (if you set up Google)
- [ ] Deploy. Vercel runs `prisma generate` via the `postinstall`/`build` scripts so the client is fresh.
- [ ] After it goes live, update Google OAuth's authorized origins/redirects to include the Vercel domain.

## 5. Make the local-storage data sync to your account

The app currently saves your profile + top 5s + wishlist in `localStorage` so the demo flow works before auth is connected. Once Neon + Google are wired up:

- [ ] In `src/components/MeProfileEditor.tsx`: replace the `loadJSON`/`saveJSON` calls with server actions that read `auth()` and write through `prisma.user.update(...)` and `prisma.tasteEntry.upsert(...)`.
- [ ] In `src/components/WishlistEditor.tsx`: same swap, but for `prisma.wishlistShow.create/delete`.
- [ ] In `src/app/u/[username]/page.tsx`: replace the `SAMPLE_PROFILES` map with `prisma.user.findUnique({ where: { username }, include: { taste: true } })`.
- [ ] (Optional) Add a Vercel Blob bucket for avatar uploads, then change `AvatarUploader` to upload the cropped JPEG instead of saving a data URL.

> Tell Claude "wire up the real persistence" once env vars are in place — it can do most of this in one pass.

## 6. Decide a few things (no rush)

- [ ] **Monthly mood prompt placement.** Banner on `/me`, dedicated `/me/mood` route, or first-of-month modal? Schema (`MoodEntry`) is already there; we just need the UI.
- [ ] **Avatar storage.** Stick with data URLs (capped at ~1MB localStorage)? Or set up Vercel Blob? (Blob is free up to a generous limit and we already crop down to 512×512.)
- [ ] **Friend/social model.** Public-only is the current default. Add a follow graph eventually? Mutual-friends only? Up to you.

## 7. Things to look at on the live site

Once deployed, walk through these to make sure everything feels right:

- [ ] `/` — landing page (hero animation, feature cards)
- [ ] `/me` — fill in your real top 5s, upload an avatar, tweak bio
- [ ] `/u/<your-username>` — public preview of yourself
- [ ] `/wishlist` — add an upcoming gig
- [ ] `/meetups` — the sample list (empty state will replace this once we have real data)
- [ ] Theme toggle (top-right of nav) — light + dark
- [ ] Test on mobile — most layouts are mobile-first but worth a sanity check

## Maintenance tips

- The CI workflow (`.github/workflows/ci.yml`) runs typecheck + lint on every PR. If it goes red, the PR shouldn't be merged until it's fixed.
- `CLAUDE.md` is the source of truth for codebase architecture — read it (or have Claude read it) before bigger changes.
- `CONTRIBUTING.md` is a gentle git/PR guide for you and your collaborator.
- Don't push to `main` directly — always go via a feature branch + PR.
