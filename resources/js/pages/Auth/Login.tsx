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
            <Head title="Sign in to your workspace — San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-start py-8 sm:py-6 px-4 sm:px-6 lg:px-8">
                
                {/* Single-Card Centered Layout */}
                <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 sm:p-10 border border-slate-200/70">
                    
                    {/* Header */}
                    <div className="flex items-center gap-3.5 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-sm shrink-0">
                            EQ
                        </div>
                        <div>
                            <span className="font-bold text-slate-900 block text-lg leading-tight">San Mateo Elementary School</span>
                            <span className="text-xs text-slate-500 font-medium">Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <p className="text-sm text-slate-500 mb-8">Sign in to your school workspace.</p>

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="email-input">Email</label>
                            <input 
                                id="email-input"
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 focus:outline-none text-sm bg-white transition-all" 
                                placeholder="name@gmail.com" 
                                aria-label="School email address"
                                required
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        {/* Password Input with Eye Toggle */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="password-input">Password</label>
                            <div className="relative">
                                <input 
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'} 
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full px-4 py-3 pr-10 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 focus:outline-none text-sm bg-white transition-all" 
                                    placeholder="Enter your password" 
                                    aria-label="Account password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        // Eye Slash (Hide)
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.156-3.444M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        // Eye Open (Show)
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            disabled={processing}
                            aria-label="Sign in to workspace"
                            className="w-full min-h-[46px] py-3 px-4 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer">
                            Sign in
                        </button>
                    </form>

                    {/* Sub-links */}
                    <div className="flex items-center justify-between mt-5 text-xs font-medium">
                        <Link href="/forgot-password" className="text-[#4B8B6B] hover:underline">Forgot password?</Link>
                        <Link href="/activate-account" className="text-[#4B8B6B] hover:underline">Activate invited account</Link>
                    </div>

                    {/* Role Preview Bar */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                            <span className="font-medium text-slate-600">Access by assigned role</span>
                            <span className="text-slate-400">Choose a workspace to preview</span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                            <Link href="/student/dashboard" className="py-2.5 px-1 rounded-lg bg-rose-50/70 border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">Student</span>
                            </Link>

                            <Link href="/teacher/overview" className="py-2.5 px-1 rounded-lg bg-[#EAF2F8] border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">Teacher</span>
                            </Link>
                            
                            <Link href="/sned-coordinator/overview" className="py-2.5 px-1 rounded-lg bg-[#E6F4EA] border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">Specialist</span>
                            </Link>

                            <Link href="/admin/overview" className="py-2.5 px-1 rounded-lg bg-[#FEF7E0] border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">Principal</span>
                            </Link>

                            <Link href="/it/overview" className="py-2.5 px-1 rounded-lg bg-[#F3E8FD] border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">ICT</span>
                            </Link>

                            <Link href="/parent/overview" className="py-2.5 px-1 rounded-lg bg-[#FFF2E5] border border-slate-200 text-center cursor-pointer transition-all hover:border-emerald-400 block">
                                <span className="block text-[11px] font-semibold text-slate-700">Parent</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}