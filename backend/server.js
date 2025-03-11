import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'
// .env faylni yuklash
dotenv.config();

// MongoDB ulanishi
connectDB();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

app.get('/', (req, res) => {
  res.send('Server is running...');
});
app.use("/api/auth",authRoutes)



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

