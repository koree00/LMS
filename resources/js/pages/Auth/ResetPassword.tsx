import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <>
            <Head title="Set new password — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
                
                {/* Balanced Accessible Card Layout with Muted Lilac Border */}
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-7 sm:p-9 border border-[#E6DEF8]">
                    
                    {/* Institutional Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-lg shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base sm:text-lg leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-[#2C323B] mb-1">Set new password</h1>
                    <p className="text-xs sm:text-sm text-[#2C323B] font-medium mb-6">Enter your new password below to secure your account.</p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <input type="hidden" name="token" value={data.token} />
                        <input type="hidden" name="email" value={data.email} />

                        {/* New Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-sm font-bold text-[#2C323B] mb-2" htmlFor="password-input">New password</label>
                            <div className="relative">
                                <input 
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'} 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`w-full px-4 py-3 pr-11 rounded-xl border-2 ${
                                        errors.password ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]-100' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                    } focus:ring-2 focus:outline-none text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`}
                                    placeholder="At least 8 characters" 
                                    aria-label="New password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2C323B] focus:outline-none cursor-pointer p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye Slash (Hide)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.156-3.444M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        // Eye Open (Show)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs sm:text-sm text-[#D9534F] font-semibold mt-1.5">{errors.password}</p>}
                        </div>

                        {/* Confirm Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-sm font-bold text-[#2C323B] mb-2" htmlFor="password-confirmation-input">Confirm password</label>
                            <div className="relative">
                                <input 
                                    id="password-confirmation-input"
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className={`w-full px-4 py-3 pr-11 rounded-xl border-2 ${
                                        errors.password_confirmation ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0]/100 focus:border-[#7C66B0]-100'
                                    } focus:ring-2 focus:outline-none text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`}
                                    placeholder="Enter it again" 
                                    aria-label="Confirm password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#2C323B] focus:outline-none cursor-pointer p-1"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        // Eye Slash (Hide)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.156-3.444M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        // Eye Open (Show)
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-xs sm:text-sm text-[#D9534F] font-semibold mt-1.5">{errors.password_confirmation}</p>}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                aria-label="Reset password"
                                className="w-full min-h-[48px] py-3 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-[0.99] cursor-pointer disabled:opacity-70">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resetting password...
                                    </>
                                ) : (
                                    'Reset password'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Back Link */}
                    <div className="mt-6 pt-5 border-t border-[#E6DEF8] text-center">
                        <Link href="/login" className="text-sm font-semibold text-[#7C66B0] hover:underline inline-block">
                            ← Back to sign in
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}