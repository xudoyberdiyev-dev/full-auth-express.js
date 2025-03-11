import bcrypt from 'bcryptjs'  // 🔹 Parolni hash qilish uchun 'bcryptjs' moduli chaqirilmoqda
import jwt from 'jsonwebtoken' // 🔹 Foydalanuvchini autentifikatsiya qilish uchun JWT token moduli
import userModel from '../model/userModel.js' // 🔹 Mongoose orqali foydalanuvchi modeli chaqirilmoqda

export const register = async (req, res) => {  // 🔹 "register" funksiyasi e'lon qilinmoqda (async - asinxron)
    const { name, email, password } = req.body  // 🔹 Foydalanuvchidan kelgan ma'lumotlar olinmoqda

    if (!name || !email || !password) {  // 🔹 Agar foydalanuvchi barcha maydonlarni to‘ldirmagan bo‘lsa
        return res.json({ success: false, message: 'Iltimos, maʼlumotni to‘liq kiriting' })  // 🔹 Xatolik qaytariladi
    }

    try {
        const existEmail = await userModel.findOne({ email })  // 🔹 Email oldindan mavjudligini tekshirish

        if (existEmail) {  // 🔹 Agar email allaqachon ro‘yxatdan o‘tgan bo‘lsa
            return res.json({ success: false, message: "Bunday email avvaldan mavjud" })  // 🔹 Xatolik qaytariladi
        }

        const hashPassword = await bcrypt.hash(password, 10)  // 🔹 Parolni 10 ta hash iteratsiya bilan shifrlash

        const user = new userModel({ name, email, password: hashPassword })  // 🔹 Yangi foydalanuvchi obyektini yaratish
        await user.save()  // 🔹 Foydalanuvchini MongoDB'ga saqlash

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })  
        // 🔹 Foydalanuvchi ID orqali JWT token yaratish, 7 kun amal qiladi

        res.cookie('token', token, {  // 🔹 JWT tokenni cookie sifatida yuborish
            httpOnly: true,  // 🔹 Cookie faqat HTTP orqali o‘qilishi mumkin (JavaScript orqali emas)
            secure: process.env.NODE_ENV === "production",  // 🔹 Agar production bo‘lsa, cookie faqat HTTPS orqali yuboriladi
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',  
            // 🔹 Production bo‘lsa 'none', aks holda 'strict' (CSRF hujumlarga qarshi himoya)
            maxAge: 7 * 24 * 60 * 60 * 1000  // 🔹 Cookie 7 kun davomida saqlanadi
        })

        res.json({ success: true, message: "Ro‘yxatdan o‘tish muvaffaqiyatli" })  // 🔹 Foydalanuvchiga javob qaytarish kerak

    } catch (error) {
        res.status(500).json({ success: false, message: "Registerda xatolik" })  
        // 🔹 Xatolik bo‘lsa, 500 status kodi bilan javob berish
    }
}

//login
export const login =async(req,res)=>{
    const {email, password } = req.body 
    
    if (!email || !password) {  // 🔹 Agar foydalanuvchi barcha maydonlarni to‘ldirmagan bo‘lsa
        return res.json({ success: false, message: 'Iltimos, maʼlumotni to‘liq kiriting' })  // 🔹 Xatolik qaytariladi
    }
    try{
        const user =await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"Mavjud bolmagan email"})
        }

        const isMatch =await bcrypt.compare(password,user.password)

        if(!isMatch){
            return res.json({success:false,message:"Mavjud bolmagan password"})
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })  
        // 🔹 Foydalanuvchi ID orqali JWT token yaratish, 7 kun amal qiladi

        res.cookie('token', token, {  // 🔹 JWT tokenni cookie sifatida yuborish
            httpOnly: true,  // 🔹 Cookie faqat HTTP orqali o‘qilishi mumkin (JavaScript orqali emas)
            secure: process.env.NODE_ENV === "production",  // 🔹 Agar production bo‘lsa, cookie faqat HTTPS orqali yuboriladi
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',  
            // 🔹 Production bo‘lsa 'none', aks holda 'strict' (CSRF hujumlarga qarshi himoya)
            maxAge: 7 * 24 * 60 * 60 * 1000  // 🔹 Cookie 7 kun davomida saqlanadi
        })

        res.json({ success: true, message: "Xisobga kirish muvaffaqiyatli" })  // 🔹 Foydalanuvchiga javob qaytarish kerak

    } catch (error) {
        res.status(500).json({ success: false, message: "Loginda xatolik" })  
        // 🔹 Xatolik bo‘lsa, 500 status kodi bilan javob berish
    }
}

//log out
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {  // 🔹 Faqat cookie nomi berilishi kerak
            httpOnly: true,  
            secure: process.env.NODE_ENV === "production",  
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',  
        });

        res.json({ success: true, message: "Xisobdan chiqdingiz" });  // 🔹 Javob qaytarish

    } catch (error) {
        res.status(500).json({ success: false, message: "Logoutda xatolik" });   
    }
};

