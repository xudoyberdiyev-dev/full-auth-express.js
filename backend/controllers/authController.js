import bcrypt from 'bcryptjs';  // 🔹 Parolni hash qilish va tekshirish uchun 'bcryptjs' moduli chaqirilmoqda
import jwt from 'jsonwebtoken';  // 🔹 Foydalanuvchini autentifikatsiya qilish uchun JWT token yaratish va tekshirish uchun modul
import userModel from '../model/userModel.js';  // 🔹 Mongoose orqali foydalanuvchi modeli chaqirilmoqda

// ========================== Foydalanuvchini ro‘yxatdan o‘tkazish ==========================
export const register = async (req, res) => {  // 🔹 "register" funksiyasi e'lon qilinmoqda (async - asinxron)
    const { name, email, password } = req.body;  // 🔹 Foydalanuvchidan kelgan ma'lumotlar olinmoqda

    // 🔹 Agar foydalanuvchi barcha maydonlarni to‘ldirmagan bo‘lsa, xatolik qaytariladi
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Iltimos, maʼlumotni to‘liq kiriting' });
    }

    try {
        const existEmail = await userModel.findOne({ email });  // 🔹 Berilgan email oldindan mavjudligini tekshirish

        if (existEmail) {  // 🔹 Agar email allaqachon ro‘yxatdan o‘tgan bo‘lsa, xatolik chiqariladi
            return res.json({ success: false, message: "Bunday email avvaldan mavjud" });
        }

        const hashPassword = await bcrypt.hash(password, 10);  // 🔹 Parolni 10 ta iteratsiya bilan shifrlash

        const user = new userModel({ name, email, password: hashPassword });  // 🔹 Yangi foydalanuvchi obyektini yaratish
        await user.save();  // 🔹 Foydalanuvchini MongoDB'ga saqlash

        // 🔹 JWT token yaratish (ID orqali), 7 kun amal qiladi
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 🔹 Tokenni cookie orqali yuborish
        res.cookie('token', token, {
            httpOnly: true,  // 🔹 Cookie faqat HTTP orqali o‘qilishi mumkin (JavaScript orqali emas)
            secure: process.env.NODE_ENV === "production",  // 🔹 Agar production bo‘lsa, cookie faqat HTTPS orqali yuboriladi
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000  // 🔹 Cookie 7 kun davomida saqlanadi
        });

        res.json({ success: true, message: "Ro‘yxatdan o‘tish muvaffaqiyatli" });  // 🔹 Javob qaytarish

    } catch (error) {
        res.status(500).json({ success: false, message: "Registerda xatolik" });  
    }
};

// ========================== Foydalanuvchini tizimga kirish (login) ==========================
export const login = async (req, res) => {
    const { email, password } = req.body;

    // 🔹 Agar foydalanuvchi barcha maydonlarni to‘ldirmagan bo‘lsa, xatolik qaytariladi
    if (!email || !password) {
        return res.json({ success: false, message: 'Iltimos, maʼlumotni to‘liq kiriting' });
    }

    try {
        const user = await userModel.findOne({ email });  // 🔹 Email bo‘yicha foydalanuvchini qidirish

        if (!user) {  // 🔹 Agar foydalanuvchi mavjud bo‘lmasa, xatolik chiqariladi
            return res.json({ success: false, message: "Mavjud bo‘lmagan email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);  // 🔹 Kiritilgan parolni tekshirish

        if (!isMatch) {  // 🔹 Agar parol noto‘g‘ri bo‘lsa, xatolik chiqariladi
            return res.json({ success: false, message: "Mavjud bo‘lmagan parol" });
        }

        // 🔹 JWT token yaratish (ID orqali), 7 kun amal qiladi
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // 🔹 Tokenni cookie orqali yuborish
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ success: true, message: "Xisobga kirish muvaffaqiyatli" });  // 🔹 Javob qaytarish

    } catch (error) {
        res.status(500).json({ success: false, message: "Loginda xatolik" });  
    }
};

// ========================== Foydalanuvchini tizimdan chiqish (logout) ==========================
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {  // 🔹 Tokenni o‘chirib tashlash
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
        });

        res.json({ success: true, message: "Xisobdan chiqdingiz" });  // 🔹 Javob qaytarish

    } catch (error) {
        res.status(500).json({ success: false, message: "Logoutda xatolik" });   
    }
};
