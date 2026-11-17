import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Reset password — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
                
                {/* Wider, Comfortable Card Layout with Muted Lilac Border */}
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-[#E6DEF8]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-lg shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base sm:text-lg leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    <h1 className="text-lg sm:text-xl font-bold text-[#2C323B] mb-1">Reset your password</h1>
                    <p className="text-sm text-[#2C323B] font-medium mb-6">Enter your invited school email to receive a secure reset link.</p>

                    {status && (
                        <div className="mb-5 text-sm font-semibold text-[#2C323B] bg-[#D4E2D4]/40 p-3.5 rounded-xl border border-[#D4E2D4]">
                            {status}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-bold text-[#2C323B] mb-2" htmlFor="email-input">School email</label>
                            <input 
                                id="email-input"
                                type="email" 
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 ${
                                    errors.email ? 'border-[#D9534F] focus:ring-[#D9534F]/40 focus:border-[#D9534F]' : 'border-slate-200 focus:ring-[#7C66B0] focus:border-[#7C66B0]-100'
                                } focus:ring-2 focus:outline-none text-base bg-white text-[#2C323B] font-medium transition-all shadow-2xs`} 
                                placeholder="name@school.gmail.com" 
                                aria-label="School email address"
                                required
                            />
                            {errors.email && (
                                <p className="text-xs sm:text-sm text-[#D9534F] font-semibold mt-1.5 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={processing}
                                aria-label="Send reset link"
                                className="w-full min-h-[48px] py-3 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base active:scale-[0.99] cursor-pointer disabled:opacity-70">
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Verifying email...
                                    </>
                                ) : (
                                    'Send reset link'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Footer Links */}
                    <div className="mt-6 pt-5 border-t border-[#E6DEF8] flex items-center justify-between text-xs sm:text-sm font-semibold">
                        <Link href="/login" className="text-[#7C66B0] hover:underline">
                            ← Back to sign in
                        </Link>
                        <Link href="/activate-account" className="text-[#7C66B0] hover:underline">
                            Activate Invited Account
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}