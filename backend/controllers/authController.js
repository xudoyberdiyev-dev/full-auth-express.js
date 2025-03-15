import bcrypt from 'bcryptjs';  // 🔹 Parolni hash qilish va tekshirish uchun 'bcryptjs' moduli chaqirilmoqda
import jwt from 'jsonwebtoken';  // 🔹 Foydalanuvchini autentifikatsiya qilish uchun JWT token yaratish va tekshirish uchun modul
import userModel from '../model/userModel.js';  // 🔹 Mongoose orqali foydalanuvchi modeli chaqirilmoqda
import transporter from '../config/nodemailer.js';


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

        res.cookie('token', token, {  // 🔹 JWT tokenni cookie sifatida yuborish
            httpOnly: true,  // 🔹 Cookie faqat HTTP orqali o‘qilishi mumkin (JavaScript orqali emas)
            secure: process.env.NODE_ENV === "production",  // 🔹 Agar production bo‘lsa, cookie faqat HTTPS orqali yuboriladi
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',  
            maxAge: 7 * 24 * 60 * 60 * 1000  // 🔹 Cookie 7 kun davomida saqlanadi
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to GreatStack',
            text: `Welcome to greatstack website. Your account has been created with email id: ${email}`
        }
        
        await transporter.sendMail(mailOptions)

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




export const sendVerifyOtp=async(req,res)=>{
    try{

        const {userId} =req.body;

        const user =await userModel.findById(userId)

        if(user.isAccountVerified){
            return res.json({success:false,message:"Account alradiy nmadurla"})
        }

        const opt =String(Math.floor(100000+Math.random()*900000))

        user.verifyOtp=opt;
        user.verifyOtpExpireAt=Date.now()+24*60*60*1000

        await user.save()

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Hush kelibsiz oka",
            text:`Your OTP is ${opt} Verify account using this OTP`
        }

        await transporter.sendMail(mailOptions)

        res.json({success:true,message:"Verifiy OPT sen email oka"})


    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const verifyEmail=async(req,res)=>{
    const {useriId,otp}=req.body

    if(!useriId||!otp){
        return res.json({success:false,message:'missing dateild'})
    }
    try{
        const user =await userModel.findById(useriId)
        
        if(!user){
            return res.json({success:false,message:'user not found'})
        }
        
        if(user.verifyOtp===""||user.verifyOtp!==otp){
            return res.json({success:false,message:'invalid otp'})
        }

        if(user.verifyOtpExpireAt<Data.now()){
            return res.json({success:false,message:'OTP expired'})
        }


        user.isAccountVerified=true;
        user.verifyOtp='',
        user.verifyOtpExpireAt=0;

        await user.save()
        return res.json({success:true,message:'email verify success'})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const isAuthenticated=async(req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}
export const sendResetOtp=async(req,res)=>{
    const {email}=req.body

    if(!email){
        return res.json({success:false,message:'email is readed'})
    }

    try{
        
        const user =await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'user not found'})
        }

        const opt =String(Math.floor(100000+Math.random()*900000))

        user.resetOtp=opt;
        user.resetOtpExpireAt=Date.now()+15*60*1000

        await user.save()

        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Hush kelibsiz oka",
            text:`Parolni unutgan boseng parol:${opt}`
        }

        await transporter.sendMail(mailOptions)

        return res.json({success:true,message:'OTp  send to your  email'})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const resetPassword=async(req,res)=>{
    const {email,otp,newPassword}=req.body

    if(!email || !otp || !newPassword){
        return res.json({success:false,message:'iltimos malumotni tolliq kiriting'})
    }

    try{

        const user =await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:'user not fount'})
        }

        if(user.resetOtp===""||user.resetOtp!==otp){
            return res.json({success:false,message:'invalit otp'})
        }

        if(user.resetOtpExpireAt<Date.now()){
            return res.json({success:false,message:'otp expire'})
        }

        const hashedPassword=await bcrypt.hash(newPassword,10)

        user.password=hashedPassword
        user.resetOtp=''
        user.resetOtpExpireAt=0;

        await user.save()

        return res.json({success:true,message:'paswword amlashtrildi'})

    }catch(error){
        res.json({success:false,message:error.message})
    }
}
export const getUserData =async(req,res)=>{
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId); 

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified,
            },
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}