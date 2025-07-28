import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import quizRoutes from './routes/quiz.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Cyber Game backend!');
});

// NOTE: Set GEMINI_API_KEY in your .env file for Gemini API access

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
