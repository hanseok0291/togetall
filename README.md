# Togetall

## Deploy on Vercel

1. **Root Directory:** set to **`web`** (Project → Settings → Build and Deployment). This is required so Vercel reads `web/package.json` (where `next` is declared) and runs `npm install` / `next build` in the right folder.
2. **Install Command** and **Build Command:** leave **empty** (defaults). Optional `web/vercel.json` sets `framework: nextjs` only.
3. **Env vars:** see `web/.env.example` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.).

Do **not** keep a repo-root `vercel.json` with `npm install --prefix web` while Root Directory is `web` — that can break installs (`web/web`).

**Local:** `npm install && npm install --prefix web` from repo root, then `npm run dev` / `npm run build`.

### Still seeing the April 7 (or old) site?

Production stays on the **last successful** deployment. If every Git build **Error**s, Vercel never promotes a new version. After fixing settings above, open **Deployments**, confirm a build for the latest `main` commit is **Ready**, then hard-refresh the site. Use **Redeploy** → enable **Clear build cache** once if needed.

### “No Next.js version detected”

Usually means Root Directory was **empty** while Vercel only looked at the repo root `package.json` (no `next` there). Setting Root Directory to **`web`** fixes it.
