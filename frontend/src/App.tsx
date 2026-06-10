import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Layout from './components/Layout';
import WordListPage from './pages/WordListPage';
import AddWordPage from './pages/AddWordPage';
import EditWordPage from './pages/EditWordPage';
import WordDetailsPage from './pages/WordDetailsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initAuth = useAuthStore((state) => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<WordListPage />} />
            <Route path="add" element={<AddWordPage />} />
            <Route path="edit/:id" element={<EditWordPage />} />
            <Route path="words/:id" element={<WordDetailsPage />} />
            <Route path="flashcards" element={<FlashcardsPage />} />
            <Route path="quiz" element={<QuizPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
