import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import WordListPage from './pages/WordListPage';
import AddWordPage from './pages/AddWordPage';
import EditWordPage from './pages/EditWordPage';
import WordDetailsPage from './pages/WordDetailsPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WordListPage />} />
          <Route path="add" element={<AddWordPage />} />
          <Route path="edit/:id" element={<EditWordPage />} />
          <Route path="words/:id" element={<WordDetailsPage />} />
          <Route path="flashcards" element={<FlashcardsPage />} />
          <Route path="quiz" element={<QuizPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
