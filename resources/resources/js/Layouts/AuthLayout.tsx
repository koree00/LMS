import React from 'react';
import { Head } from '@inertiajs/react';

export default function AuthLayout({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[#F8F6F0] flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10">
                <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-9 border border-[#E6DEF8]">
                    {children}
                </div>
            </div>
        </>
    );
}