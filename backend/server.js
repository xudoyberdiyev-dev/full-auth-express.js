import express from 'express';  // 🔹 Express.js kutubxonasini import qilish (server yaratish uchun)
import cors from 'cors';  // 🔹 CORS middleware (frontend va backend o‘rtasida ma’lumot almashish uchun)
import dotenv from 'dotenv';  // 🔹 .env fayldan konfiguratsiyani yuklash
import cookieParser from 'cookie-parser';  // 🔹 Cookie'larni o‘qish va boshqarish uchun middleware
import connectDB from './config/db.js';  // 🔹 MongoDB bazasiga ulanish funksiyasini import qilish
import authRoutes from './routes/authRoutes.js';  // 🔹 Autentifikatsiya yo‘llarini import qilish
// import userRouter from './routes/userRoutes.js';

// 🔹 .env fayldagi konfiguratsiyalarni yuklash
dotenv.config();

// 🔹 MongoDB bazasiga ulanish
connectDB();
const allowedOrigins=['http://localhost:5173']

const app = express();  // 🔹 Express ilovasini yaratish
const port = process.env.PORT || 4000;  // 🔹 Portni .env fayldan olish yoki standart 4000 portni ishlatish

// 🔹 Middleware'lar (ma’lumotlarni qayta ishlash vositalari)
app.use(express.json());  // 🔹 JSON formatdagi ma’lumotlarni qabul qilish uchun
app.use(cookieParser());  // 🔹 Cookie'larni o‘qish va ishlatish uchun
app.use(cors({origin:allowedOrigins, credentials: true }));  // 🔹 CORS (frontend va backend ulanishi uchun)

// 🔹 Serverning asosiy endpointi (test qilish uchun)
app.get('/', (req, res) => {
  res.send('Server is running...');  // 🔹 Brauzer yoki Postman orqali tekshirish uchun
});

// 🔹 Autentifikatsiya marshrutlarini (yo‘llarini) qo‘shish
app.use("/api/auth", authRoutes);
// app.use('/api/user',userRouter)

// 🔹 Serverni ishga tushirish va konsolga xabar chiqarish
app.listen(port, () => {
  console.log(`Server running on port ${port}`);  // 🔹 Server qaysi portda ishga tushganini ko‘rsatish
});
