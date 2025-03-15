import React, { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";

const EmailVerify = () => {
    axios.defaults.withCredentials = true;

    // Contextdan ma'lumotlarni olish
    const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent);
    const navigate = useNavigate();
    const inputRefs = useRef([]);

    // OTP kiritishda keyingi inputga o'tish
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // Backspace bosilganda oldingi inputga o'tish
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    // OTP ni paste qilish
    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text");
        const pasteArray = paste.split("");

        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char;
            }
        });
    };

    // OTP ni tasdiqlash
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const otpArray = inputRefs.current.map((e) => e.value);
            const otp = otpArray.join("");

            const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

            if (data.success) {
                toast.success(data.message);
                getUserData();
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Foydalanuvchi allaqachon tasdiqlangan bo‘lsa, uni bosh sahifaga yuborish
    useEffect(() => {
        if (isLoggedin && userData?.isAccountVerified) {
            navigate("/");
        }
    }, [isLoggedin, userData]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            {/* Logo */}
            <img
                onClick={() => navigate("/")}
                src={assets.logo}
                alt="Logo"
                className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
            />

            {/* OTP Kiritish formasi */}
            <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
                <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify OTP</h1>
                <p className="text-center mb-6 text-indigo-300">
                    Enter the 6-digit code sent to your email id.
                </p>

                {/* OTP Inputlar */}
                <div className="flex justify-between mb-8" onPaste={handlePaste}>
                    {Array(6)
                        .fill(0)
                        .map((_, index) => (
                            <input
                                type="text"
                                maxLength="1"
                                key={index}
                                required
                                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                                ref={(e) => (inputRefs.current[index] = e)}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />
                        ))}
                </div>

                {/* Verify Button */}
                <button className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full">
                    Verify Email
                </button>
            </form>
        </div>
    );
};

export default EmailVerify;
