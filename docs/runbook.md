# Runbook: Deutsch Core CI/CD

How the pipelines work, which secrets they use, and what to do when something breaks.
Secret **names** only. Values live in GitHub and Vercel, never in this repo.

## 1. Pipelines

| Workflow | File | Runs when | What it does |
|---|---|---|---|
| **CI** | `.github/workflows/ci.yml` | every pull request, every push to `main` | Backend: Jest against a Postgres service container, then `tsc` build. Frontend: lint, Vitest, build. Docker: build both images, start the compose stack, smoke-test through nginx. |
| **Deploy live** | `.github/workflows/deploy-live.yml` | after **CI succeeds for a push to `main`**, or by hand | Supabase migrations → Vercel (backend) → Firebase Hosting (frontend) → smoke test of the live URLs. |

Normal flow: branch → PR (CI runs) → merge → CI on `main` → Deploy live (~4 min end to end).

## 2. Live environment

| Part | Where | URL |
|---|---|---|
| Frontend | Firebase Hosting, project `deutsch-core` | https://deutsch-core.web.app |
| Backend | Vercel, project `deutsch-core-backend` | https://deutsch-core-backend.vercel.app |
| Database | Supabase Postgres (session pooler, `eu-west-1`) | n/a |

Vercel Git auto-deploy is **off** and there is no Firebase GitHub integration: GitHub Actions is the only thing that deploys.

## 3. Secrets

### GitHub: environment `production`

Settings → Environments → `production`. Only the `main` branch may use this environment, so PR workflows cannot read these secrets.

| Secret | Used for | Where it comes from |
|---|---|---|
| `VERCEL_TOKEN` | Vercel CLI deploy | vercel.com → Account Settings → Tokens (`github-actions-deutsch-core`) |
| `VERCEL_ORG_ID` | Which Vercel team | `backend/.vercel/project.json` → `orgId` |
| `VERCEL_PROJECT_ID` | Which Vercel project | `backend/.vercel/project.json` → `projectId` |
| `SUPABASE_DIRECT_URL` | `prisma migrate deploy` | Supabase → Connect → **Session pooler** (`…pooler.supabase.com:5432`) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Hosting deploy | Google Cloud → IAM → Service accounts → `github-actions-hosting` (role *Firebase Hosting Admin*) → JSON key |

Set or replace a secret (prompts for the value, keeps it out of shell history):

```bash
gh secret set VERCEL_TOKEN --env production
gh secret set FIREBASE_SERVICE_ACCOUNT --env production < key.json && rm key.json
gh secret list --env production
```

### Vercel: project environment variables (runtime)

The backend reads these at runtime. They are set in Vercel → `deutsch-core-backend` → Settings → Environment Variables (Production), **not** in GitHub.

| Variable | Notes |
|---|---|
| `DATABASE_URL`, `DIRECT_URL` | Supabase connection strings |
| `JWT_SECRET` | Long random string; changing it logs every user out |
| `ALLOWED_ORIGINS` | `https://deutsch-core.web.app` (comma-separated if more). Missing → CORS errors, nobody can log in |

Changing a Vercel variable only takes effect on the **next deploy**: run *Deploy live* by hand afterwards.

### Why the Supabase *session pooler*

| Connection | Works from GitHub Actions? |
|---|---|
| Direct (`db.<ref>.supabase.co:5432`) | No: IPv6 only, GitHub runners have no IPv6 |
| Transaction pooler (`:6543`) | No: Prisma migrations need a session |
| **Session pooler (`:5432`)** | **Yes** |

## 4. Common tasks

### Redeploy the current `main`

GitHub → Actions → **Deploy live** → *Run workflow*, or:

```bash
gh workflow run deploy-live.yml --ref main
gh run watch
```

### Roll back a bad release

1. **Preferred:** revert the commit on `main` (`git revert <sha>`, PR, merge). The pipeline tests and deploys the reverted code.
2. **Fast, while the revert goes through CI:**
   - Backend: Vercel → Deployments → previous production deployment → *Instant Rollback*.
   - Frontend: Firebase console → Hosting → release history → previous release → *Rollback*.

Migrations are **not** rolled back automatically. Keep them backwards-compatible (add columns/tables first, remove old ones in a later release) so the previous code still runs on the new schema.

### Rotate a token or key

| What | Steps |
|---|---|
| `VERCEL_TOKEN` (expired or leaked) | Create a new token → `gh secret set VERCEL_TOKEN --env production` → delete the old token in Vercel |
| Firebase key | Add a new JSON key on `github-actions-hosting` → `gh secret set FIREBASE_SERVICE_ACCOUNT …` → delete the old key in Google Cloud |
| Supabase password | Reset in Supabase → update `SUPABASE_DIRECT_URL` in GitHub **and** `DATABASE_URL`/`DIRECT_URL` in Vercel → run *Deploy live* |

## 5. Troubleshooting

| Failing step | Typical cause | Fix |
|---|---|---|
| CI → Backend → Run tests | Test needs the `X-Requested-With` header or `accessToken` (session auth) | Match `src/tests/auth.test.ts` |
| CI → Frontend → Lint | New ESLint error | `cd frontend && npm run lint` locally |
| CI → Docker → Start stack | A container is unhealthy | Read the *Container logs* step; reproduce with `docker compose up --build` |
| Deploy → Apply migrations | `P1001 Can't reach database` | `SUPABASE_DIRECT_URL` is not the session pooler, or the password is wrong |
| Deploy → Vercel | `login_required` / `invalid token` | `VERCEL_TOKEN` expired: rotate it (section 4) |
| Deploy → Firebase | `403` / permission denied | Service account lacks *Firebase Hosting Admin*, or the key was deleted |
| Deploy → Smoke test → CORS | No `access-control-allow-origin` for the live origin | `ALLOWED_ORIGINS` missing on Vercel; set it, then redeploy |
| Deploy didn't start at all | CI failed, or the push was not to `main` | Deploy only follows a **successful** CI run for a push to `main` |

## 6. Known limitations

- **Logged out on reload in Safari and Chrome Incognito.** The frontend (`web.app`) and the API (`vercel.app`) are different sites, so the refresh-token cookie is a third-party cookie. Browsers that block third-party cookies drop it; login works, but a page reload logs the user out. Normal Chrome, Firefox and Edge are fine.
  *Fix:* serve both from one domain (e.g. `app.example.com` on Firebase, `api.example.com` on Vercel) and switch the cookie to `sameSite: 'lax'`. Accepted for now (decision 2026-11-16).
