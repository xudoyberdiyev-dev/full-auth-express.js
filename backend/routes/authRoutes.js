import express from 'express';  // 🔹 Express.js kutubxonasini import qilish (API yo‘llarini yaratish uchun)
import { login, logout, register } from '../controllers/authController.js';  
// 🔹 Foydalanuvchini ro‘yxatdan o‘tkazish, login qilish va logout qilish funksiyalarini import qilish

const authRoutes = express.Router();  // 🔹 Express Router obyektini yaratish (marshrutlarni boshqarish uchun)

// 🔹 Ro‘yxatdan o‘tish uchun POST so‘rovi
authRoutes.post('/register', register);

// 🔹 Hisobga kirish uchun POST so‘rovi
authRoutes.post("/login", login);

// 🔹 Hisobdan chiqish uchun POST so‘rovi
authRoutes.post('/logout', logout);

export default authRoutes;  // 🔹 Routerni eksport qilish (boshqa joyda ishlatish uchun)
