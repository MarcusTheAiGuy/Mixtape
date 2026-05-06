# Contributing

Hey! This is a quick orientation for collaborating on Mixtape.

## TL;DR

1. Pull the latest `main`.
2. Make a branch.
3. Commit your changes there.
4. Push the branch and open a Pull Request.
5. Wait for CI (typecheck + lint) to go green, then merge.

## Setting up locally

```bash
git clone https://github.com/MarcusTheAiGuy/Mixtape.git
cd Mixtape
npm install
cp .env.example .env  # ask Marcus for the dev values
npm run dev           # http://localhost:3000
```

## Branches

- `main` is the deployable branch. Vercel auto-deploys it.
- For any change, create a new branch off `main`. Use a short, descriptive name:
  - `feature/wishlist-sharing`
  - `fix/typeahead-flicker`
  - `docs/readme-deploy-steps`
- Don't push to `main` directly. Always go through a Pull Request.

```bash
git checkout main
git pull
git checkout -b feature/your-thing
# ...edit files...
git add -A
git commit -m "feat: describe what this changes"
git push -u origin feature/your-thing
```

Then open a PR on GitHub.

## Commits

Plain English is fine. A good commit message says **what changed and why**, not just what files moved. Examples:

- ✅ `Add taste filters to meetup cards so users can scan for fit`
- ❌ `Update meetups page`

If you want, follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`) — handy if we ever want auto-generated changelogs.

## Pull requests

- One feature per PR. Smaller is better — easier to review, easier to roll back.
- The PR description should answer:
  - What does this change?
  - Why?
  - Anything reviewers should look at carefully?
- CI runs `npm run typecheck` and `npm run lint`. Both have to pass before merging.
- If your change touches the database schema (`prisma/schema.prisma`), call it out in the PR — it'll need `npm run db:push` after merging.

## Code style

- TypeScript strict mode is on. Don't use `any`; if you really must, leave a comment explaining why.
- Use the path alias `@/...` instead of long relative paths.
- Use the theme tokens (CSS variables like `--color-foreground`) so things look right in both light and dark mode.
- See `CLAUDE.md` for the full architecture rundown — it's the source of truth for how the codebase is organised.

## When you're stuck

- Check `CLAUDE.md` first — it's a tour of the codebase.
- Run `npm run typecheck` to catch most issues early.
- If something feels weirder than it should, just ping in the group chat.
