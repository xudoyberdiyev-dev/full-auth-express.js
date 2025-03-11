import mongoose from "mongoose";  // 🔹 MongoDB bilan ishlash uchun 'mongoose' kutubxonasi import qilinmoqda

// 🔹 Foydalanuvchilar uchun Mongoose sxemasi yaratish
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },  // 🔹 Foydalanuvchi ismi (majburiy)
    email: { type: String, required: true, unique: true },  // 🔹 Email (majburiy va unikallik talab qilinadi)
    password: { type: String, required: true },  // 🔹 Parol (majburiy)

    verifyOtp: { type: String, default: '' },  // 🔹 Ro‘yxatdan o‘tish tasdiqlash kodi (OTP)
    verifyOtpExpireAt: { type: Number, default: 0 },  // 🔹 Tasdiqlash kodining amal qilish muddati

    isAccountVerified: { type: Boolean, default: false },  // 🔹 Foydalanuvchi akkaunti tasdiqlanganligini tekshirish

    resetOtp: { type: String, default: '' },  // 🔹 Parolni tiklash uchun OTP kodi
    resetOtpExpireAt: { type: Number, default: 0 }  // 🔹 Parol tiklash kodining amal qilish muddati
});

// 🔹 Agar model allaqachon mavjud bo‘lsa, uni ishlatish, aks holda yangisini yaratish
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;  // 🔹 Modelni eksport qilish
