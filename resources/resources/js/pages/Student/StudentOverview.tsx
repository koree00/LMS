import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FoxMascot, SubjectIllustration, PastelStar, PastelCoin } from '@/Components/StudentVisuals';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface StudentOverviewProps {
    notifications?: NotificationItem[];
    studentName?: string;
    totalStars?: number;
    totalBadges?: number;
    totalCoins?: number;
}

export default function StudentOverview({ 
    notifications = [], 
    studentName = 'Ronardo R. Cra', 
    totalStars = 48, 
    totalBadges = 5, 
    totalCoins = 120 
}: StudentOverviewProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
    const [safeMode, setSafeMode] = useState<boolean>(true);
    const [isBreakActive, setIsBreakActive] = useState<boolean>(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifOpen]);

    const [notifList, setNotifList] = useState<NotificationItem[]>(notifications.length > 0 ? notifications : [
        { id: 1, text: 'Teacher Ana unlocked a new Math level for you!', time: '10m ago', unread: true, link: '/student/activities' }
    ]);

    const unreadCount = notifList.length;

    const subjects = [
        { id: 'math', name: 'Mathematics', color: 'bg-[#EEF5F0] border-slate-200', desc: 'Counting & Patterns' },
        { id: 'reading', name: 'Reading and Literacy', color: 'bg-[#EEF4F8] border-slate-200', desc: 'Phonemes & Sight Words' },
        { id: 'language', name: 'Language', color: 'bg-[#FBF6EC] border-slate-200', desc: 'Oral Communication' },
        { id: 'gmrc', name: 'GMRC', color: 'bg-[#FAF0EE] border-slate-200', desc: 'Values & Family' },
        { id: 'makabansa', name: 'Makabansa', color: 'bg-[#F5F3FA] border-slate-200', desc: 'Community & School' },
    ];

    return (
        <>
            <Head title="EduQuestAI Student Hub · San Mateo Elementary"/>
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
                                <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] text-[#35634C] border border-slate-200 flex items-center justify-center font-bold text-xs shrink-0">EQ</div>
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
                                <Link href="/student/overview" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-slate-200 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/student/activities" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Gamified Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Gamified Activities</span>}
                                </Link>
                                <Link href="/student/grades" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Grades">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-２a２ ２ ０ ０１-２ -２z"/></svg>
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
                                <Link href="/student/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Settings">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    {sidebarOpen && <span>User Settings</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50/60 text-slate-700 font-medium text-xs border border-transparent hover:border-rose-200/70 transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Sign out">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/80 w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / Welcome Hub</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <button 
                                onClick={() => setIsBreakActive(true)}
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FBF6EC] hover:bg-[#F4EBD9] text-[#6E5630] font-semibold text-xs transition-colors cursor-pointer border border-[#EBDEC4]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                <span>Sensory Pause</span>
                            </button>

                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setNotifOpen(!notifOpen)} 
                                    className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors border border-slate-200 cursor-pointer"
                                    title="Notifications"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#4B8B6B] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-md z-50 overflow-hidden text-xs">
                                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-800">
                                            <span>Updates</span>
                                            {unreadCount > 0 && (
                                                <button onClick={() => setNotifList([])} className="text-[11px] text-[#4B8B6B] hover:underline cursor-pointer">Clear all</button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {notifList.length === 0 ? (
                                                <div className="p-6 text-center text-slate-400">No new updates</div>
                                            ) : (
                                                notifList.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => router.visit(n.link)}
                                                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-[#4B8B6B] mt-1.5 shrink-0"></span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-slate-800 font-medium leading-snug">{n.text}</p>
                                                            <span className="text-[10px] text-slate-400">{n.time}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {isBreakActive && (
                        <div className="bg-[#FBF6EC] border border-[#EBDEC4] text-[#5C4726] p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <FoxMascot className="w-12 h-12 shrink-0" />
                                <div>
                                    <h2 className="text-sm font-bold">Quiet Break Mode Active</h2>
                                    <p className="text-xs text-[#6E5630] mt-0.5">Take a slow, deep breath. Rest your eyes and resume whenever you feel ready.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsBreakActive(false)}
                                className="px-4 py-2.5 bg-[#4B8B6B] text-white font-semibold text-xs rounded-xl hover:bg-[#3D7257] cursor-pointer transition-colors shrink-0"
                            >
                                Resume Learning
                            </button>
                        </div>
                    )}

                    {/* Welcome Banner with Custom Fox Mascot */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <FoxMascot className="w-16 h-16 shrink-0" hat="hat-1" />
                            <div className="space-y-1.5">
                                <span className="inline-block text-[11px] font-semibold text-[#2B523F] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full border border-slate-200">
                                    Grade 1 — Section 1
                                </span>
                                <h1 className="text-lg font-bold text-slate-900">Hello, {studentName}!</h1>
                                <p className="text-xs text-slate-500">Ready for today’s visual lessons and games at San Mateo Elementary?</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                            <div className="bg-[#FBF6EC] border border-slate-200 px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[88px]">
                                <PastelStar className="w-6 h-6 mx-auto mb-1" />
                                <span className="font-bold text-slate-900 text-sm block">{totalStars}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Stars</span>
                            </div>
                            <div className="bg-[#EEF4F8] border border-slate-200 px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[88px]">
                                <svg viewBox="0 0 28 28" className="w-6 h-6 mx-auto mb-1" fill="none">
                                    <path d="M14 3L23 7V14C23 19.5 19.1 24.4 14 26C8.9 24.4 5 19.5 5 14V7L14 3Z" fill="#9BC3DC" stroke="#4D7C9E" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M10.5 14.5L13 17L18 11.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="font-bold text-slate-900 text-sm block">{totalBadges}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Badges</span>
                            </div>
                            <div className="bg-[#EEF5F0] border border-slate-200 px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[88px]">
                                <PastelCoin className="w-6 h-6 mx-auto mb-1" />
                                <span className="font-bold text-slate-900 text-sm block">{totalCoins}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wide">Coins</span>
                            </div>
                        </div>
                    </div>

                    {/* Comfort & Sensory Controls */}
                    <div className="bg-white border border-slate-200/80 p-5 rounded-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Comfort & Sensory Controls</h2>
                            <span className="text-[11px] font-medium text-slate-500">Tap to adjust</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">Voice Read-Aloud</span>
                                <button 
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                                        audioEnabled ? 'bg-[#EEF5F0] text-[#2B523F] border-slate-200' : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                                >
                                    {audioEnabled ? 'On' : 'Off'}
                                </button>
                            </div>

                            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">Calm Pastel View</span>
                                <button 
                                    onClick={() => setSafeMode(!safeMode)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                                        safeMode ? 'bg-[#EEF5F0] text-[#2B523F] border-slate-200' : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                                >
                                    {safeMode ? 'Active' : 'Standard'}
                                </button>
                            </div>

                            <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/70 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-700">Need a Rest?</span>
                                <button 
                                    onClick={() => setIsBreakActive(true)}
                                    className="px-3.5 py-1.5 bg-[#FBF6EC] hover:bg-[#F4EBD9] text-[#6E5630] border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                                >
                                    Take a Break
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Next Lesson + Illustrated Subject Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-1 bg-[#EEF5F0] text-[#2B523F] border border-slate-200 font-semibold text-[11px] rounded-full">
                                        Up Next
                                    </span>
                                    <span className="text-[11px] font-medium text-slate-400">Mathematics · Level 3</span>
                                </div>
                                <div className="p-4 rounded-xl bg-[#EEF5F0]/60 border border-slate-200 flex items-center gap-3.5">
                                    <SubjectIllustration id="math" className="w-11 h-11 shrink-0" />
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">Simple Addition</h3>
                                        <p className="text-[11px] text-slate-600 mt-0.5">Count visual picture cards with voice guidance.</p>
                                    </div>
                                </div>
                            </div>

                            <Link 
                                href="/student/activities"
                                className="w-full py-3 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold text-xs rounded-xl text-center transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span>Start Next Lesson</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </Link>
                        </div>

                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Choose a Subject</h2>
                                <Link href="/student/activities" className="text-xs font-semibold text-[#4B8B6B] hover:underline">
                                    View All Activities
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {subjects.map(subj => (
                                    <div 
                                        key={subj.id}
                                        onClick={() => router.visit('/student/activities')}
                                        className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-600 transition-colors cursor-pointer flex items-center gap-3.5 group"
                                    >
                                        <div className={`w-13 h-13 p-2.5 rounded-xl flex items-center justify-center shrink-0 border ${subj.color}`}>
                                            <SubjectIllustration id={subj.id} className="w-8 h-8" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#35634C] transition-colors truncate">{subj.name}</h3>
                                            <p className="text-xs text-slate-500 truncate mt-0.5">{subj.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}