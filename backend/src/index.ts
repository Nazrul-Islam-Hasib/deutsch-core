import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { csrfProtection } from './middlewares/csrfMiddleware';
import wordRoutes from './routes/wordRoutes';
import quizRoutes from './routes/quizRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:5173'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));
app.use(express.json());
app.use(cookieParser());
app.use(csrfProtection);

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
