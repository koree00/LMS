import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ActivateAccount() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/activate-account');
    };

    return (
        <>
            <Head title="Activate your invited account — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-4 px-4 sm:px-6">
                
                {/* Compact, Viewport-Fitting Card Layout with Muted Lilac Border */}
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-[#E6DEF8]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3.5 mb-5">
                        <div className="w-11 h-11 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-base shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <h1 className="text-lg font-bold text-[#2C323B] mb-1">Activate your invited account</h1>
                    <p className="text-xs sm:text-sm text-[#2C323B] font-medium mb-5">Enter your invited school email to set up your workspace password.</p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#2C323B] mb-1.5" htmlFor="email-input">School email</label>
                            <input 
                                id="email-input"
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl border-2 ${
                                    errors.email ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                } focus:ring-2 focus:outline-none text-sm sm:text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`}
                                placeholder="name@school.gmail.com"
                                aria-label="School email address"
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-[#D9534F] font-semibold mt-1 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Create Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#2C323B] mb-1.5" htmlFor="password-input">Create password</label>
                            <div className="relative">
                                <input 
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'} 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-12 rounded-xl border-2 ${
                                        errors.password ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                    } focus:ring-2 focus:outline-none text-sm sm:text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`}
                                    placeholder="At least 8 characters" 
                                    aria-label="Create password"
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
                            {errors.password && (
                                <p className="text-xs text-[#D9534F] font-semibold mt-1 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-xs sm:text-sm font-bold text-[#2C323B] mb-1.5" htmlFor="password-confirmation-input">Confirm password</label>
                            <div className="relative">
                                <input 
                                    id="password-confirmation-input"
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    className={`w-full px-4 py-2.5 pr-12 rounded-xl border-2 ${
                                        errors.password_confirmation ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                    } focus:ring-2 focus:outline-none text-sm sm:text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`}
                                    placeholder="Enter your password again" 
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
                            {errors.password_confirmation && (
                                <p className="text-xs text-[#D9534F] font-semibold mt-1 flex items-center gap-1">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="pt-1">
                            <button 
                                type="submit" 
                                disabled={processing}
                                aria-label="Activate account"
                                className="w-full min-h-[44px] py-2.5 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm sm:text-base active:scale-[0.99] cursor-pointer disabled:opacity-70">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying invitation...
                                    </>
                                ) : (
                                    'Activate account'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Back Link */}
                    <div className="mt-4 pt-4 border-t border-[#E6DEF8] text-center">
                        <Link href="/login" className="text-xs sm:text-sm font-semibold text-[#7C66B0] hover:underline inline-block">
                            ← Back to sign in
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}