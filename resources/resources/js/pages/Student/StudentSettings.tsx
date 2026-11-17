import React, { useState, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, PastelStar, SubjectIllustration } from '@/Components/StudentVisuals';

interface StudentSettingsProps {
    student?: {
        fullName: string;
        nickname: string;
        section: string;
        avatarUrl?: string | null;
        presetBadge?: 'fox' | 'star' | 'book';
    };
}

export default function StudentSettings({
    student = {
        fullName: 'Ronardo R. Cra',
        nickname: 'Leo',
        section: 'Grade 1 — Section 1',
        avatarUrl: null,
        presetBadge: 'fox',
    },
}: StudentSettingsProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    // Display Photo & Profile State
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [nickname, setNickname] = useState<string>(student.nickname);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(student.avatarUrl || null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [presetBadge, setPresetBadge] = useState<'fox' | 'star' | 'book'>(student.presetBadge || 'fox');

    // Regular Password Update State
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPasswords, setShowPasswords] = useState<boolean>(false);

    // Visual Sensory Preferences
    const [voiceReadAloud, setVoiceReadAloud] = useState<boolean>(true);
    const [calmPastelMode, setCalmPastelMode] = useState<boolean>(true);
    const [textSize, setTextSize] = useState<'standard' | 'large'>('large');
    const [gentleChimes, setGentleChimes] = useState<boolean>(true);
    const [stepHints, setStepHints] = useState<boolean>(true);

    // Feedback Banner State
    const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'warning'; text: string } | null>(null);

    const isProfileChanged =
        nickname.trim() !== student.nickname ||
        avatarFile !== null ||
        (avatarPreview === null && student.avatarUrl !== null) ||
        presetBadge !== (student.presetBadge || 'fox');

    const speakText = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
    };

    const handleRemovePhoto = () => {
        setAvatarFile(null);
        setAvatarPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isProfileChanged) return;

        setStatusBanner({
            type: 'success',
            text: 'Your display photo and profile name have been saved!',
        });
        speakText('Your display photo and profile name have been saved!');
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentPassword || !newPassword) {
            setStatusBanner({
                type: 'warning',
                text: 'Please fill in your current password and new password.',
            });
            speakText('Please fill in your current password and new password.');
            return;
        }
        if (newPassword.length < 8) {
            setStatusBanner({
                type: 'warning',
                text: 'Your new password must be at least 8 characters long.',
            });
            speakText('Your new password must be at least 8 characters long.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setStatusBanner({
                type: 'warning',
                text: 'The new password and confirm password do not match. Please try again.',
            });
            speakText('The new password and confirm password do not match. Please try again.');
            return;
        }

        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setStatusBanner({
            type: 'success',
            text: 'Your password has been updated!',
        });
        speakText('Your password has been updated!');
    };

    return (
        <>
            <Head title="EduQuestAI User Settings · San Mateo Elementary" />
            <div className="min-h-screen bg-[#F8FAFC] flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/15 z-40 md:hidden transition-opacity" />
                )}

                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/80 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] text-[#35634C] border border-[#D5E6DC] flex items-center justify-center font-bold text-xs shrink-0">EQ</div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                        <div>
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Student Hub</div>}
                            <nav className="space-y-1.5">
                                <Link href="/student/overview" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/student/activities" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Gamified Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Gamified Activities</span>}
                                </Link>
                                <Link href="/student/grades" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Grades">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                                                    {sidebarOpen && <span>My Grades</span>}
                                                                </Link>
                                <Link href="/student/daily-games" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Daily Games">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Daily Games</span>}
                                </Link>
                                <Link href="/student/avatar" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Avatar & Shop">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    {sidebarOpen && <span>My Avatar & Shop</span>}
                                </Link>
                                <Link href="/student/rewards" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Rewards & Badges">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                                    {sidebarOpen && <span>Rewards & Badges</span>}
                                </Link>
                                <Link href="/student/feedback" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Teacher Feedback">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                                    {sidebarOpen && <span>Teacher Feedback</span>}
                                </Link>
                                <Link href="/student/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Settings">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {sidebarOpen && <span>User Settings</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50/60 text-slate font-medium text-xs border border-transparent hover:border-rose-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Sign out">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/80 w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / My Profile & Settings</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <button
                                onClick={() => speakText('Welcome to your Profile and Settings page. Here you can change your display photo, update your nickname, or update your password.')}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] font-semibold text-xs transition-colors cursor-pointer border border-[#D5E6DC]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                <span>Audio Help</span>
                            </button>
                            <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Home</span>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Status Banner */}
                    {statusBanner && (
                        <div className={`px-4 py-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                            statusBanner.type === 'success'
                                ? 'bg-[#EEF5F0] border-[#D5E6DC] text-[#2B523F]'
                                : 'bg-[#FBF6EC] border-[#EBDEC4] text-[#6E5630]'
                        }`}>
                            <div className="flex items-center gap-2.5">
                                <PastelStar className="w-5 h-5 shrink-0" filled={statusBanner.type === 'success'} />
                                <span>{statusBanner.text}</span>
                            </div>
                            <button onClick={() => setStatusBanner(null)} className="underline cursor-pointer">Dismiss</button>
                        </div>
                    )}

                    {/* Top Row: Left = Profile Card (2 cols), Right = Compact Change Password Card (1 col) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        
                        {/* Profile Card (2 spans) */}
                        <form onSubmit={handleSaveProfile} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-5">
                            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative shrink-0">
                                    {avatarPreview ? (
                                        <img
                                            src={avatarPreview}
                                            alt="Student Display"
                                            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#4B8B6B] bg-white"
                                        />
                                    ) : presetBadge === 'star' ? (
                                        <div className="w-24 h-24 rounded-2xl bg-[#FBF6EC] border-2 border-[#E0C799] flex items-center justify-center">
                                            <PastelStar className="w-14 h-14" filled />
                                        </div>
                                    ) : presetBadge === 'book' ? (
                                        <div className="w-24 h-24 rounded-2xl bg-[#EEF4F8] border-2 border-[#C3D8E8] flex items-center justify-center">
                                            <SubjectIllustration id="reading" className="w-14 h-14" />
                                        </div>
                                    ) : (
                                        <FoxMascot className="w-24 h-24" hat="hat-1" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-3.5 text-center sm:text-left w-full">
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">Display Photo or Picture Badge</span>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Upload a picture or tap one of the calm badges below.</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                            <span>Upload Photo</span>
                                        </button>

                                        {avatarPreview && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="px-3.5 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                                            >
                                                Use Picture Badge Instead
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
                                        {[
                                            { id: 'fox' as const, label: 'Fox Friend' },
                                            { id: 'star' as const, label: 'Gold Star' },
                                            { id: 'book' as const, label: 'Story Book' },
                                        ].map(badge => {
                                            const selected = !avatarPreview && presetBadge === badge.id;
                                            return (
                                                <button
                                                    key={badge.id}
                                                    type="button"
                                                    onClick={() => {
                                                        handleRemovePhoto();
                                                        setPresetBadge(badge.id);
                                                    }}
                                                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-colors cursor-pointer ${
                                                        selected
                                                            ? 'bg-[#EEF5F0] text-[#2B523F] border-[#4B8B6B]'
                                                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#4B8B6B]'
                                                    }`}
                                                >
                                                    {badge.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Single Row: Nickname, Full Student Name, and Grade & Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-800 block">Classroom Nickname</label>
                                    <input
                                        type="text"
                                        value={nickname}
                                        onChange={e => setNickname(e.target.value)}
                                        placeholder="Enter nickname"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4B8B6B]"
                                    />
                                    <span className="text-[11px] text-slate-400 block">Shown on welcome greeting.</span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-800 block">Full Student Name</label>
                                    <input
                                        type="text"
                                        value={student.fullName}
                                        disabled
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-medium text-slate-500 cursor-not-allowed"
                                    />
                                    <span className="text-[11px] text-slate-400 block">Managed by Teacher Ana.</span>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-800 block">Grade & Section</label>
                                    <input
                                        type="text"
                                        value={student.section}
                                        disabled
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50 text-xs font-medium text-slate-500 cursor-not-allowed"
                                    />
                                    <span className="text-[11px] text-slate-400 block">San Mateo Elementary.</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                                <button
                                    type="submit"
                                    disabled={!isProfileChanged}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                        isProfileChanged
                                            ? 'bg-[#4B8B6B] hover:bg-[#3D7257] text-white cursor-pointer'
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    Save Profile Changes
                                </button>
                            </div>
                        </form>

                        {/* Compact Change Password Card (1 span) */}
                        <form onSubmit={handleUpdatePassword} className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="pb-3 border-b border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords(!showPasswords)}
                                        className="text-[11px] font-semibold text-[#4B8B6B] hover:underline cursor-pointer"
                                    >
                                        {showPasswords ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">Ask a parent or teacher to help update your password.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800 block">Current Password</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={currentPassword}
                                        onChange={e => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4B8B6B]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800 block">New Password</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="At least 8 characters"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4B8B6B]"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-800 block">Confirm New Password</label>
                                    <input
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4B8B6B]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>

                    {/* Full-Width Extended Comfort & Sensory Preferences Card */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Comfort & Sensory Preferences</h2>
                                <p className="text-xs text-slate-500 mt-0.5">Tap any picture card to adjust how lessons look, sound, and guide you.</p>
                            </div>
                            <span className="px-2.5 py-1 bg-[#EEF5F0] text-[#2B523F] border border-[#D5E6DC] rounded-full text-[11px] font-semibold w-fit">
                                SNED Classroom Comfort
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* 1. Voice Read-Aloud */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-xl bg-[#EEF5F0] border border-[#D5E6DC] flex items-center justify-center shrink-0 text-[#35634C]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setVoiceReadAloud(!voiceReadAloud)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                            voiceReadAloud
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {voiceReadAloud ? 'On' : 'Off'}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Voice Read-Aloud</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Reads lesson prompts out loud gently.</p>
                                </div>
                            </div>

                            {/* 2. Calm Pastel Colors */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-xl bg-[#FBF6EC] border border-[#EBDEC4] flex items-center justify-center shrink-0">
                                        <PastelStar className="w-6 h-6" filled />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCalmPastelMode(!calmPastelMode)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                            calmPastelMode
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {calmPastelMode ? 'On' : 'Off'}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Calm Pastel View</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Soft, low-glare colors for relaxed focus.</p>
                                </div>
                            </div>

                            {/* 3. Letter Size */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-xl bg-[#EEF4F8] border border-[#D5E3EE] flex items-center justify-center shrink-0 font-extrabold text-sm text-[#365973]">
                                        Aa
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setTextSize(textSize === 'large' ? 'standard' : 'large')}
                                        className="px-3 py-1.5 rounded-xl text-xs font-semibold border bg-[#EEF5F0] text-[#2B523F] border-[#D5E6DC] transition-colors cursor-pointer"
                                    >
                                        {textSize === 'large' ? 'Big' : 'Regular'}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Letter Size</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Large, clear spacing for early readers.</p>
                                </div>
                            </div>

                            {/* 4. Gentle Reward Chimes */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-xl bg-[#F5F3FA] border border-[#DFDAEC] flex items-center justify-center shrink-0 text-[#5C4B75]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setGentleChimes(!gentleChimes)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                            gentleChimes
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {gentleChimes ? 'On' : 'Off'}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Gentle Chimes</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Soft bell sounds when earning stars.</p>
                                </div>
                            </div>

                            {/* 5. Visual Step Hints */}
                            <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="w-11 h-11 rounded-xl bg-[#FAF0EE] border border-[#EBD5D0] flex items-center justify-center shrink-0 text-[#8F4B3E]">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setStepHints(!stepHints)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                                            stepHints
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                                : 'bg-white text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {stepHints ? 'On' : 'Off'}
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900">Visual Step Hints</h3>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Shows helpful picture clues on tasks.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}