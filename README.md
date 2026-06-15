# Deutsch Core 🇩🇪

Deutsch Core is a comprehensive language learning application designed to help users master German vocabulary through structured word management, interactive flashcards, and quizzes.

## 🔗 Live Link

The application is live here: [https://deutsch-core.web.app/](https://deutsch-core.web.app/)

## 📸 Preview

![App Screenshot](assets/screenshots/Screenshot%202026-05-04%20at%2013.06.58.png)

*Explore more screenshots in the `assets/screenshots` directory.*

## 🚀 Features

- **Authentication**: Secure Login and Signup system using JWT.
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
- **Testing**: [Vitest](https://vitest.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Supabase)
- **Authentication**: [JWT](https://jwt.io/) & [Bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Validation**: [Zod](https://zod.dev/)
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
│   └── prisma/         # Database schema & migrations
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── config/     # Centralized API config
│   │   ├── pages/
│   │   ├── store/      # Zustand store (Auth & Words)
│   │   ├── services/   # API services
│   │   └── test/       # Vitest tests
├── assets/             # Project assets (screenshots, etc.)
└── Project_Guidelines/ # Development guidelines (local only)
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL database (e.g., Supabase)

### Backend Setup
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
   ```
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
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

## 📄 License

This project is licensed under the ISC License.
