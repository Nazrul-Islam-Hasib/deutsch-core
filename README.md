# Deutsch Core 🇩🇪

[![CI](https://github.com/Nazrul-Islam-Hasib/deutsch-core/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Nazrul-Islam-Hasib/deutsch-core/actions/workflows/ci.yml)

Deutsch Core is a comprehensive language learning application designed to help users master German vocabulary through structured word management, interactive flashcards, and quizzes.

## 🔗 Live Link

The application is live here: [https://deutsch-core.web.app/](https://deutsch-core.web.app/)

## 📸 Preview

![App Screenshot](assets/screenshots/Screenshot%202026-05-04%20at%2013.06.58.png)

*Explore more screenshots in the `assets/screenshots` directory.*

## 🚀 Features

- **Advanced Authentication**: Secure Login and Signup with session-based authentication, JWT access tokens, and secure HTTP-only refresh token cookies.
- **Token Rotation & Security**: Automatic refresh token rotation on each use with consumed token tracking to detect and prevent token reuse attacks.
- **Idle Timeout Protection**: 30-minute inactivity timeout with 2-minute warning modal before automatic logout to ensure security.
- **CSRF Protection**: State-changing requests protected with custom security headers (X-Requested-With) and CORS whitelist validation.
- **Personalized Archive**: Each user maintains their own private collection of German words.
- **Word Management**: Add, edit, and organize German words with their articles, translations, and types.
- **Flashcard System**: Track your learning progress with a dedicated flashcard review system.
- **Interactive Quizzes**: Test your knowledge with dynamically generated quizzes based on your own vocabulary.
- **Progress Tracking**: Keep tabs on which words you've mastered and which ones need more practice.
- **Modern UI**: A clean, "Synthwave/Cyberpunk" responsive interface built with Tailwind CSS and DaisyUI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **API Client**: Centralized HTTP client with automatic token refresh, CSRF headers, and secure cookie handling
- **Session Management**: IdleTimer component with 30-min inactivity detection and user warning modal
- **Testing**: [Vitest](https://vitest.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Supabase)
- **Authentication**: [JWT](https://jwt.io/) with session-based token management, [Bcryptjs](https://github.com/dcodeIO/bcrypt.js), & HTTP-only cookies
- **Security**: CSRF protection, Refresh token rotation, Token reuse detection, Idle timeout enforcement
- **Validation**: [Zod](https://zod.dev/)
- **Cookie Parsing**: [cookie-parser](https://github.com/expressjs/cookie-parser)
- **Testing**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## 📁 Project Structure

```text
Deutsch_Core/
├── backend/            # Express API with Prisma ORM
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/ # Auth & Validation middlewares
│   │   ├── routes/
│   │   ├── services/    # Business logic
│   │   └── tests/       # Jest tests
│   ├── prisma/         # Database schema & migrations
│   └── Dockerfile      # Multi-stage: build, migrate job, runtime
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── config/     # Centralized API config
│   │   ├── pages/
│   │   ├── store/      # Zustand store (Auth & Words)
│   │   ├── services/   # API services
│   │   └── test/       # Vitest tests
│   ├── Dockerfile      # Vite build served by nginx
│   └── nginx.conf      # SPA fallback + /api proxy to the backend
├── .github/workflows/  # CI (ci.yml) and live deploy (deploy-live.yml)
├── docs/               # Runbook: pipelines, secrets, rollback, troubleshooting
├── docker-compose.yml  # Local stack: db, migrate, backend, frontend
├── .env.example        # Variables for docker compose (copy to .env)
├── assets/             # Project assets (screenshots, etc.)
└── Project_Guidelines/ # Development guidelines (local only)
```

## ⚙️ Getting Started

### 🐳 Run with Docker (quickest)

Requires only [Docker Desktop](https://www.docker.com/products/docker-desktop/). This starts Postgres, applies the migrations, and runs the backend and the frontend:

```bash
cp .env.example .env      # local dev values; change JWT_SECRET if you like
docker compose up --build
```

Open **http://localhost:8080**. nginx serves the React app and proxies `/api/*` to the backend, so the browser only talks to one origin.

```text
browser → frontend (nginx :8080) → /api → backend (Express :3000) → db (Postgres :5432)
```

| Command | What it does |
|---|---|
| `docker compose down` | Stop the stack (keeps the database) |
| `docker compose down -v` | Stop and delete the database volume |
| `docker compose up db` | Only Postgres, for hot-reload development with `npm run dev` |

### Manual setup

#### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL database (e.g., Supabase)

#### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (create a `.env` file):
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/deutsch_core"
   DIRECT_URL="postgresql://user:password@localhost:5432/deutsch_core" # For migrations
   JWT_SECRET="your_secure_random_string"
   NODE_ENV="development" # or "production"
   ALLOWED_ORIGINS="http://localhost:5173,https://deutsch-core.web.app" # Comma-separated list
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

#### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (optional, defaults are set in `src/config/api.ts`):
   ```env
   VITE_API_URL="http://localhost:3000"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🔄 CI/CD

GitHub Actions tests every pull request (backend tests against Postgres, frontend lint/tests/build, Docker smoke test). After a merge to `main` passes CI, the live app is deployed automatically: Supabase migrations → Vercel (backend) → Firebase Hosting (frontend) → smoke test.
Secrets, redeploys, rollback and troubleshooting: see the [runbook](docs/runbook.md).

## ⚠️ Known Limitations

- **Safari and Chrome Incognito log you out on page reload.** The frontend (`web.app`) and API (`vercel.app`) are on different domains, so these browsers block the refresh-token cookie as a third-party cookie. Logging in and using the app works normally; Chrome, Firefox and Edge stay logged in. The fix is to serve both from one domain ([details](docs/runbook.md#6-known-limitations)).

## 📄 License

This project is licensed under the ISC License.
