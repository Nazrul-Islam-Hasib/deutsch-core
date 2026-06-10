import express, { Request, Response } from 'express';
import cors from 'cors';
import wordRoutes from './routes/wordRoutes';
import quizRoutes from './routes/quizRoutes';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: { status: 'OK' },
    error: null,
  });
});

app.use('/auth', authRoutes);
app.use('/words', wordRoutes);
app.use('/quiz', quizRoutes);

// Avoid app.listen when testing
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
