# Deutsch Core 🇩🇪

Deutsch Core is a comprehensive language learning application designed to help users master German vocabulary through structured word management, interactive flashcards, and quizzes.

## 📸 Preview

![App Screenshot](assets/screenshots/Screenshot%202026-05-04%20at%2013.06.58.png)

*Explore more screenshots in the `assets/screenshots` directory.*

## 🚀 Features

- **Word Management**: Add, edit, and organize German words with their articles, translations, and types.
- **Flashcard System**: Track your learning progress with a dedicated flashcard review system.
- **Interactive Quizzes**: Test your knowledge with dynamically generated quizzes.
- **Progress Tracking**: Keep tabs on which words you've mastered and which ones need more practice.
- **Modern UI**: A clean, responsive, and intuitive interface built with Tailwind CSS and DaisyUI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Icons**: [FontAwesome](https://fontawesome.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Testing**: [Jest](https://jestjs.io/) & [Supertest](https://github.com/ladjs/supertest)

## 📁 Project Structure

```text
Deutsch_Core/
├── backend/            # Express API with Prisma ORM
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── prisma/         # Database schema
├── frontend/           # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/      # Zustand store
│   │   └── services/   # API services
├── assets/             # Project assets (screenshots, etc.)
└── Project_Guidelines/ # Development guidelines (local only)
```

## ⚙️ Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL database

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
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📄 License

This project is licensed under the ISC License.
