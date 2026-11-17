import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Sign in to your workspace — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
                
                {/* Clean Accessible Card Layout with Muted Lilac Border */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 sm:p-9 border border-[#E6DEF8]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        {/* Logo Badge in Dusty Amethyst */}
                        <div className="w-12 h-12 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-lg shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base sm:text-lg leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <p className="text-sm text-[#2C323B] font-medium mb-6">Sign in to your school workspace.</p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-[#2C323B] mb-2" htmlFor="email-input">Email address</label>
                            <input 
                                id="email-input"
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100 focus:outline-none text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs" 
                                placeholder="name@gmail.com" 
                                aria-label="School email address"
                                required
                            />
                            {errors.email && <p className="text-xs sm:text-sm text-[#D9534F] font-semibold mt-1.5 flex items-center gap-1.5"><span aria-hidden="true"></span> {errors.email}</p>}
                        </div>

                        {/* Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-sm font-bold text-[#2C323B] mb-2" htmlFor="password-input">Password</label>
                            <div className="relative">
                                <input 
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'} 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 pr-11 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100 focus:outline-none text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs" 
                                    placeholder="Enter your password" 
                                    aria-label="Account password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2C323B] focus:outline-none cursor-pointer p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.156-3.444M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs sm:text-sm text-[#D9534F] font-semibold mt-1.5 flex items-center gap-1.5"><span aria-hidden="true"></span> {errors.password}</p>}
                        </div>

                        {/* Sign in button using Dusty Amethyst */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                aria-label="Sign in to workspace"
                                className="w-full min-h-[48px] py-3 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-[0.99] cursor-pointer">
                                Sign in
                            </button>
                        </div>
                    </form>

                    {/* Sub-links using Dusty Amethyst */}
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-[#E6DEF8] text-sm font-semibold">
                        <Link href="/forgot-password" className="text-[#7C66B0] hover:underline">Forgot password?</Link>
                        <Link href="/activate-account" className="text-[#7C66B0] hover:underline">Activate invited account</Link>
                    </div>

                </div>
            </div>
        </>
    );
}