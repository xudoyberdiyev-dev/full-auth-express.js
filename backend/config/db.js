import mongoose from 'mongoose';  // 🔹 MongoDB bilan bog‘lanish uchun mongoose kutubxonasi chaqirilmoqda
import dotenv from 'dotenv';  // 🔹 .env fayldagi o‘zgaruvchilarni yuklash uchun dotenv kutubxonasi chaqirilmoqda

dotenv.config();  // 🔹 .env faylni yuklab, undagi o‘zgaruvchilarni process.env ga qo‘shadi

const connectDB = async () => {  // 🔹 Asinxron (async) funksiyani yaratamiz, u MongoDB bilan bog‘lanadi
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {  // 🔹 MongoDB'ga ulanish
      useNewUrlParser: true,  // 🔹 Yangi URL parserdan foydalanish (eskirgan metodlarni oldini oladi)
      useUnifiedTopology: true  // 🔹 Yangi topologiya dvijokidan foydalanish (stabil bog‘lanish uchun)
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);  // 🔹 Ulanish muvaffaqiyatli bo‘lsa, server manzili konsolga chiqadi
  } catch (error) {  // 🔹 Agar ulanishda xatolik bo‘lsa
    console.error(`Error: ${error.message}`);  // 🔹 Xatolik haqida xabar chiqariladi
    process.exit(1);  // 🔹 Xatolik bo‘lsa, kod 1 bilan chiqib ketadi (nodeni to‘xtatadi)
  }
};

export default connectDB;  // 🔹 Funksiyani boshqa fayllarda ishlatish uchun eksport qilamiz
