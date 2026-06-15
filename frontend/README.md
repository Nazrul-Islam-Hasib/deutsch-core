# Deutsch Core - Frontend

This is the frontend of the Deutsch Core application, built with React 19, TypeScript, and Vite.

## 🚀 Features

- **Synthwave UI**: A unique cyberpunk-inspired interface.
- **State Management**: Uses Zustand for managing authentication and vocabulary data.
- **Secure Routing**: Protected routes ensure only authenticated users can access the app.
- **API Centralization**: All API calls are managed through a centralized configuration in `src/config/api.ts`.
- **Responsive Design**: Built with Tailwind CSS and DaisyUI for a seamless experience on mobile and desktop.

## 🛠️ Tech Stack

- **React 19**
- **Vite**
- **TypeScript**
- **Tailwind CSS** & **DaisyUI**
- **Zustand**
- **Vitest** (for unit testing)

## ⚙️ Development

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
The application uses the following environment variables:
- `VITE_API_URL`: The URL of the backend API (default: `https://deutsch-core-backend.vercel.app`).

### Testing
To run the frontend tests:
```bash
npm test
```
