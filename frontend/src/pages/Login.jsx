import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';

const Login = () => {
    const navigate = useNavigate();
    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true;

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });

                if (data.success) {
                    setIsLoggedin(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/auth/login`, { email, password });

                if (data.success) {
                    setIsLoggedin(true);
                    getUserData();
                    navigate('/');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
            <img 
                onClick={() => navigate('/')} 
                src={assets.logo} 
                alt="Logo" 
                className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' 
            />

            <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-semibold text-white text-center mb-3'>
                    {state === 'Sign Up' ? 'Create Account' : 'Login'}
                </h2>

                <p className='text-center text-sm mb-6'>
                    {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
                </p>

                <form onSubmit={onSubmitHandler}>
                    {state === "Sign Up" && (
                        <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                            <img src={assets.person_icon} alt="Person Icon" />
                            <input 
                                className='bg-transparent outline-none' 
                                type="text" 
                                placeholder="Full Name" 
                                required 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                            />
                        </div>
                    )}

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.mail_icon} alt="Mail Icon" />
                        <input 
                            className='bg-transparent outline-none' 
                            type="email" 
                            placeholder="Email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                        />
                    </div>

                    <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                        <img src={assets.lock_icon} alt="Lock Icon" />
                        <input 
                            className='bg-transparent outline-none' 
                            type="password" 
                            placeholder="Password" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                        />
                    </div>

                    <p 
                        onClick={() => navigate('/reset-password')} 
                        className='mb-4 text-indigo-500 cursor-pointer'>
                        Forgot password?
                    </p>

                    <button 
                        type="submit"
                        className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>
                        {state}
                    </button>
                </form>

                {state === "Sign Up" ? (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                        Already have an account?{' '}
                        <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Login')}>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className='text-gray-400 text-center text-xs mt-4'>
                        Don't have an account?{' '}
                        <span className='text-blue-400 cursor-pointer underline' onClick={() => setState('Sign Up')}>
                            Sign up
                        </span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Login;
