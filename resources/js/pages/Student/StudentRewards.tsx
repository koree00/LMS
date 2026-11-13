import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, PastelStar, PastelCoin, SubjectIllustration } from '@/Components/StudentVisuals';

interface BadgeItem {
    id: string;
    title: string;
    subject: string;
    description: string;
    unlocked: boolean;
    dateEarned?: string;
    accentBg: string;
    accentBorder: string;
    shieldFill: string;
    shieldStroke: string;
}

export default function StudentRewards({
    totalStars = 48,
    totalCoins = 120,
}: {
    totalStars?: number;
    totalCoins?: number;
}) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const badges: BadgeItem[] = [
        {
            id: 'math-explorer',
            title: 'Number Explorer',
            subject: 'Mathematics',
            description: 'Completed 3 counting activities with stars.',
            unlocked: true,
            dateEarned: 'Nov 10, 2026',
            accentBg: 'bg-[#EEF5F0]',
            accentBorder: 'border-[#D5E6DC]',
            shieldFill: '#88B89E',
            shieldStroke: '#4B8B6B',
        },
        {
            id: 'reading-star',
            title: 'Phonics Listener',
            subject: 'Reading and Literacy',
            description: 'Matched letter sounds A to E accurately.',
            unlocked: true,
            dateEarned: 'Nov 11, 2026',
            accentBg: 'bg-[#EEF4F8]',
            accentBorder: 'border-[#D5E3EE]',
            shieldFill: '#9BC3DC',
            shieldStroke: '#4D7C9E',
        },
        {
            id: 'polite-speaker',
            title: 'Magalang Star',
            subject: 'Language',
            description: 'Practiced polite everyday greetings.',
            unlocked: true,
            dateEarned: 'Nov 12, 2026',
            accentBg: 'bg-[#FBF6EC]',
            accentBorder: 'border-[#EBDEC4]',
            shieldFill: '#F2D398',
            shieldStroke: '#B88E35',
        },
        {
            id: 'kind-helper',
            title: 'Kind Family Helper',
            subject: 'GMRC',
            description: 'Finished the family values visual story.',
            unlocked: true,
            dateEarned: 'Nov 12, 2026',
            accentBg: 'bg-[#FAF0EE]',
            accentBorder: 'border-[#EBD5D0]',
            shieldFill: '#E8A598',
            shieldStroke: '#B86B5D',
        },
        {
            id: 'school-scout',
            title: 'School Explorer',
            subject: 'Makabansa',
            description: 'Identified parts of San Mateo Elementary.',
            unlocked: true,
            dateEarned: 'Nov 13, 2026',
            accentBg: 'bg-[#F5F3FA]',
            accentBorder: 'border-[#DFDAEC]',
            shieldFill: '#C2B5D8',
            shieldStroke: '#766391',
        },
        {
            id: 'super-streak',
            title: 'Steady Learner',
            subject: 'All Subjects',
            description: 'Complete 5 more activities to unlock this badge!',
            unlocked: false,
            accentBg: 'bg-slate-100',
            accentBorder: 'border-slate-200',
            shieldFill: '#E2E8F0',
            shieldStroke: '#94A3B8',
        },
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;

    return (
        <>
            <Head title="EduQuestAI Rewards & Badges · San Mateo Elementary"/>
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
                                <Link href="/student/rewards" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Rewards & Badges">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / Rewards & Badges</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Home</span>
                            </Link>
                            <Link href="/student/avatar" className="flex items-center gap-1.5 bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] border border-[#D5E6DC] px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors">
                                <span>Spend Coins in Shop</span>
                            </Link>
                        </div>
                    </div>

                    {/* Visual Trophy Summary */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <FoxMascot className="w-16 h-16 shrink-0" hat="hat-3" />
                            <div className="space-y-1">
                                <span className="inline-block text-[11px] font-semibold text-[#2B523F] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E6DC]">
                                    Achievement Shelf
                                </span>
                                <h1 className="text-base font-bold text-slate-900">My Stars, Coins & Badges</h1>
                                <p className="text-xs text-slate-500">Every star and badge celebrates your steady progress.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="bg-[#FBF6EC] border border-[#EBDEC4] px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[92px]">
                                <PastelStar className="w-6 h-6 mx-auto mb-1" />
                                <span className="font-bold text-slate-900 text-sm block">{totalStars}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase">Stars</span>
                            </div>
                            <div className="bg-[#EEF4F8] border border-[#D5E3EE] px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[92px]">
                                <svg viewBox="0 0 28 28" className="w-6 h-6 mx-auto mb-1" fill="none">
                                    <path d="M14 3L23 7V14C23 19.5 19.1 24.4 14 26C8.9 24.4 5 19.5 5 14V7L14 3Z" fill="#9BC3DC" stroke="#4D7C9E" strokeWidth="2" strokeLinejoin="round" />
                                    <path d="M10.5 14.5L13 17L18 11.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="font-bold text-slate-900 text-sm block">{unlockedCount} / {badges.length}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase">Badges</span>
                            </div>
                            <div className="bg-[#EEF5F0] border border-[#D5E6DC] px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[92px]">
                                <PastelCoin className="w-6 h-6 mx-auto mb-1" />
                                <span className="font-bold text-slate-900 text-sm block">{totalCoins}</span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase">Coins</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Badge Grid */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Subject Achievement Badges</h2>
                            <span className="text-xs text-slate-500">{unlockedCount} unlocked</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {badges.map(badge => (
                                <div
                                    key={badge.id}
                                    className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                                        badge.unlocked
                                            ? `${badge.accentBg} ${badge.accentBorder}`
                                            : 'bg-slate-50/70 border-slate-200/80 opacity-80'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                                            <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
                                                <path
                                                    d="M24 5L39 11.5V23.5C39 32.8 32.6 41.1 24 43.8C15.4 41.1 9 32.8 9 23.5V11.5L24 5Z"
                                                    fill={badge.shieldFill}
                                                    stroke={badge.shieldStroke}
                                                    strokeWidth="2.2"
                                                    strokeLinejoin="round"
                                                />
                                                {badge.unlocked ? (
                                                    <path
                                                        d="M24 14L26.5 19.3L32.3 20.1L28.1 24.2L29.1 30L24 27.2L18.9 30L19.9 24.2L15.7 20.1L21.5 19.3L24 14Z"
                                                        fill="#FFFFFF"
                                                    />
                                                ) : (
                                                    <path
                                                        d="M20 23V20C20 17.8 21.8 16 24 16C26.2 16 28 17.8 28 20V23M18 23H30V31H18V23Z"
                                                        stroke="#64748B"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                )}
                                            </svg>
                                        </div>

                                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                            badge.unlocked
                                                ? 'bg-white text-slate-700 border-slate-200/80'
                                                : 'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                            {badge.unlocked ? 'Earned' : 'Locked'}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <span className="text-[11px] font-semibold text-slate-500 block">{badge.subject}</span>
                                        <h3 className="text-sm font-bold text-slate-900">{badge.title}</h3>
                                        <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                                        <span>{badge.unlocked ? `Earned ${badge.dateEarned}` : 'Keep learning to unlock'}</span>
                                        {badge.unlocked && <PastelStar className="w-4 h-4" filled />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}