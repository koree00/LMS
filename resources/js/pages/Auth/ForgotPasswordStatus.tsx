import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ForgotPasswordStatus() {
    return (
        <>
            <Head title="Check your email — EduQuest AI" />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center py-8 px-4 sm:px-6">
                
                {/* Slightly Wider Status Card with Muted Lilac Border */}
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 sm:p-10 border border-[#E6DEF8]">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[#E6DEF8] flex items-center justify-center text-[#7C66B0] font-extrabold text-lg shrink-0 shadow-sm border border-slate-100">
                            EQ
                        </div>
                        <div>
                            <span className="font-extrabold text-[#2C323B] block text-base sm:text-lg leading-tight">EduQuest AI</span>
                            <span className="text-xs sm:text-sm text-[#2C323B]/70 font-semibold mt-0.5 block">SMES Inclusive LMS & SNED Portal</span>
                        </div>
                    </div>

                    {/* Status Message */}
                    <div className="mb-8">
                        <h1 className="text-xl font-bold text-[#2C323B] mb-2">Check your email</h1>
                        <p className="text-sm sm:text-base text-[#2C323B] font-medium leading-relaxed">
                            We have sent a secure password reset link to your school email address.
                        </p>
                    </div>

                    {/* Back to sign in button using Dusty Amethyst */}
                    <div>
                        <Link 
                            href="/login"
                            aria-label="Back to sign in"
                            className="w-full min-h-[48px] py-3 px-4 bg-[#7C66B0] hover:bg-[#68529C] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-base text-center active:scale-[0.99] cursor-pointer">
                            Back to sign in
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}