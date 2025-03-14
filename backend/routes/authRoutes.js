import express from 'express';  // 🔹 Express.js kutubxonasini import qilish (API yo‘llarini yaratish uchun)
import { getUserData, isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';  
import userAuth from '../middleware/userAuth.js';
// 🔹 Foydalanuvchini ro‘yxatdan o‘tkazish, login qilish va logout qilish funksiyalarini import qilish

const authRoutes = express.Router();  // 🔹 Express Router obyektini yaratish (marshrutlarni boshqarish uchun)

// 🔹 Ro‘yxatdan o‘tish uchun POST so‘rovi
authRoutes.post('/register', register);

// 🔹 Hisobga kirish uchun POST so‘rovi
authRoutes.post("/login", login);

// 🔹 Hisobdan chiqish uchun POST so‘rovi
authRoutes.post('/logout', logout);

authRoutes.post('/send-verify-otp',userAuth,sendVerifyOtp)

authRoutes.post('/verify-account',userAuth,verifyEmail)

authRoutes.post('/is-auth',userAuth,isAuthenticated)

authRoutes.post("/send-reset-otp",sendResetOtp)

authRoutes.post('/reset-password',resetPassword)
authRoutes.get('/data',userAuth,getUserData)


export default authRoutes;  // 🔹 Routerni eksport qilish (boshqa joyda ishlatish uchun)
