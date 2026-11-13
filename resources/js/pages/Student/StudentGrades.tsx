import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, SubjectIllustration, PastelStar } from '@/Components/StudentVisuals';

interface GradeRecord {
    id: number;
    subjectId: 'math' | 'reading' | 'language' | 'gmrc' | 'makabansa';
    subjectName: string;
    topic: string;
    level: string;
    score: number;
    maxScore: number;
    gradePercent: number;
    stars: number;
    status: 'Outstanding' | 'Very Satisfactory' | 'Satisfactory';
    dateCompleted: string;
}

export default function StudentGrades() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [selectedSubject, setSelectedSubject] = useState<string>('all');

    // Safely reads saved sensory preferences from localStorage without throwing if Provider isn't mounted
    const [calmPastelMode, setCalmPastelMode] = useState<boolean>(true);
    const [gentleChimes, setGentleChimes] = useState<boolean>(true);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const saved = window.localStorage.getItem('eduquest_sensory_prefs_v1');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (typeof parsed.calmPastelMode === 'boolean') setCalmPastelMode(parsed.calmPastelMode);
                if (typeof parsed.gentleChimes === 'boolean') setGentleChimes(parsed.gentleChimes);
            }
        } catch {
            // use defaults
        }
    }, []);

    const speak = (text: string) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.92;
            window.speechSynthesis.speak(utterance);
        }
    };

    const playChime = () => {
        if (!gentleChimes || typeof window === 'undefined') return;
        try {
            const AudioCtx =
                window.AudioContext ||
                (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch {
            // ignore
        }
    };

    const gradeRecords: GradeRecord[] = [
        {
            id: 1,
            subjectId: 'math',
            subjectName: 'Mathematics',
            topic: 'Counting 1 to 10 with Visual Objects',
            level: 'Level 1',
            score: 10,
            maxScore: 10,
            gradePercent: 98,
            stars: 3,
            status: 'Outstanding',
            dateCompleted: 'Nov 10, 2026',
        },
        {
            id: 2,
            subjectId: 'math',
            subjectName: 'Mathematics',
            topic: 'Simple Addition Using Fruit Blocks',
            level: 'Level 2',
            score: 9,
            maxScore: 10,
            gradePercent: 94,
            stars: 3,
            status: 'Outstanding',
            dateCompleted: 'Nov 12, 2026',
        },
        {
            id: 3,
            subjectId: 'reading',
            subjectName: 'Reading and Literacy',
            topic: 'Letter Sounds A to E',
            level: 'Level 1',
            score: 9,
            maxScore: 10,
            gradePercent: 92,
            stars: 3,
            status: 'Outstanding',
            dateCompleted: 'Nov 11, 2026',
        },
        {
            id: 4,
            subjectId: 'reading',
            subjectName: 'Reading and Literacy',
            topic: 'Matching Sight Words to Pictures',
            level: 'Level 2',
            score: 8,
            maxScore: 10,
            gradePercent: 88,
            stars: 2,
            status: 'Very Satisfactory',
            dateCompleted: 'Nov 13, 2026',
        },
        {
            id: 5,
            subjectId: 'language',
            subjectName: 'Language',
            topic: 'Magandang Umaga Everyday Greetings',
            level: 'Level 1',
            score: 10,
            maxScore: 10,
            gradePercent: 96,
            stars: 3,
            status: 'Outstanding',
            dateCompleted: 'Nov 11, 2026',
        },
        {
            id: 6,
            subjectId: 'gmrc',
            subjectName: 'GMRC',
            topic: 'Tulong sa Tahanan (Helping at Home)',
            level: 'Level 1',
            score: 9,
            maxScore: 10,
            gradePercent: 95,
            stars: 3,
            status: 'Outstanding',
            dateCompleted: 'Nov 12, 2026',
        },
        {
            id: 7,
            subjectId: 'makabansa',
            subjectName: 'Makabansa',
            topic: 'Mga Bahagi ng Paaralan (San Mateo Elem.)',
            level: 'Level 1',
            score: 8,
            maxScore: 10,
            gradePercent: 89,
            stars: 2,
            status: 'Very Satisfactory',
            dateCompleted: 'Nov 13, 2026',
        },
    ];

    const subjects = [
        { id: 'all', name: 'All Subjects' },
        { id: 'math', name: 'Mathematics' },
        { id: 'reading', name: 'Reading and Literacy' },
        { id: 'language', name: 'Language' },
        { id: 'gmrc', name: 'GMRC' },
        { id: 'makabansa', name: 'Makabansa' },
    ];

    const filteredRecords =
        selectedSubject === 'all'
            ? gradeRecords
            : gradeRecords.filter(r => r.subjectId === selectedSubject);

    const averageGrade = Math.round(
        filteredRecords.reduce((acc, item) => acc + item.gradePercent, 0) /
            (filteredRecords.length || 1)
    );

    const totalStarsEarned = filteredRecords.reduce((acc, item) => acc + item.stars, 0);

    const getStatusBadgeStyle = (status: GradeRecord['status']) => {
        switch (status) {
            case 'Outstanding':
                return 'bg-[#E3F1E8] text-[#2B523F] border-[#C2DFCE]';
            case 'Very Satisfactory':
                return 'bg-[#EEF4F8] text-[#2F526D] border-[#D5E3EE]';
            case 'Satisfactory':
                return 'bg-[#FBF6EC] text-[#6E5630] border-[#EBDEC4]';
        }
    };

    return (
        <>
            <Head title="EduQuestAI My Grades · San Mateo Elementary" />
            <div
                className={`min-h-screen flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border transition-colors duration-300 ${
                    calmPastelMode ? 'bg-[#F5F4EE]' : 'bg-[#F8FAFC]'
                }`}
            >
                {sidebarOpen && (
                    <div
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/15 z-40 md:hidden transition-opacity"
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed inset-y-0 left-0 z-50 border-r border-slate-200/80 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                        ${calmPastelMode ? 'bg-[#FDFCF9]' : 'bg-white'}
                        ${sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                    `}
                >
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div
                            className={`flex items-center pb-4 border-b border-slate-100 ${
                                sidebarOpen ? 'justify-between' : 'flex-col gap-3'
                            }`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-xl bg-[#EEF5F0] text-[#35634C] border border-[#D5E6DC] flex items-center justify-center font-bold text-xs shrink-0">
                                    EQ
                                </div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">
                                            EduQuestAI
                                        </span>
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            San Mateo Elementary
                                        </span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shrink-0 border border-transparent hover:border-slate-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            {sidebarOpen && (
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                                    Student Hub
                                </div>
                            )}
                            <nav className="space-y-1.5">
                                <Link
                                    href="/student/overview"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="Overview"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>

                                <Link
                                    href="/student/activities"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="Gamified Activities"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {sidebarOpen && <span>Gamified Activities</span>}
                                </Link>
 <Link
                                    href="/student/grades"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="My Grades"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    {sidebarOpen && <span>My Grades</span>}
                                </Link>
                                <Link
                                    href="/student/daily-games"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="Daily Games"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {sidebarOpen && <span>Daily Games</span>}
                                </Link>

                               

                                <Link
                                    href="/student/avatar"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="My Avatar & Shop"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {sidebarOpen && <span>My Avatar & Shop</span>}
                                </Link>

                                <Link
                                    href="/student/rewards"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="Rewards & Badges"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                    {sidebarOpen && <span>Rewards & Badges</span>}
                                </Link>

                                <Link
                                    href="/student/feedback"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="Teacher Feedback"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    {sidebarOpen && <span>Teacher Feedback</span>}
                                </Link>

                                <Link
                                    href="/student/settings"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-colors ${
                                        !sidebarOpen ? 'md:justify-center px-0' : ''
                                    }`}
                                    title="User Settings"
                                >
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {sidebarOpen && <span>User Settings</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0">
                        <Link
                            href="/login"
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50/60 text-slate-700 font-medium text-xs border border-transparent hover:border-rose-200/70 transition-colors ${
                                !sidebarOpen ? 'md:justify-center px-0' : ''
                            }`}
                            title="Sign out"
                        >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main
                    className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${
                        sidebarOpen ? 'md:ml-64' : 'md:ml-20'
                    }`}
                >
                    {/* Top Bar */}
                    <div
                        className={`flex items-center justify-between p-3.5 sm:px-6 rounded-xl border border-slate-200/80 w-full box-border ${
                            calmPastelMode ? 'bg-[#FDFCF9]' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">
                                EduQuestAI / My Grades
                            </span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <button
                                onClick={() =>
                                    speak(
                                        `Your current average grade is ${averageGrade} percent with ${totalStarsEarned} stars earned.`
                                    )
                                }
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] font-semibold text-xs transition-colors cursor-pointer border border-[#D5E6DC]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                                <span>Read Grades</span>
                            </button>

                            <Link
                                href="/student/overview"
                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Home</span>
                            </Link>
                        </div>
                    </div>

                    {/* Header Summary Card */}
                    <div
                        className={`p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
                            calmPastelMode ? 'bg-[#FDFCF9]' : 'bg-white'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <FoxMascot className="w-16 h-16 shrink-0" hat="hat-1" />
                            <div className="space-y-1">
                                <span className="inline-block text-[11px] font-semibold text-[#2B523F] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E6DC]">
                                    Grade 1 — Section 1 · Quarter 2
                                </span>
                                <h1 className="text-base font-bold text-slate-900">
                                    My Learning Grades & Progress
                                </h1>
                                <p className="text-xs text-slate-500">
                                    See your scores by subject, topic, and activity level.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <div className="bg-[#EEF5F0] border border-[#D5E6DC] px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[105px]">
                                <span className="font-bold text-[#2B523F] text-base block">
                                    {averageGrade}%
                                </span>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase">
                                    Average Grade
                                </span>
                            </div>
                            <div className="bg-[#FBF6EC] border border-[#EBDEC4] px-4 py-3 rounded-xl text-center flex-1 sm:min-w-[105px]">
                                <div className="flex items-center justify-center gap-1">
                                    <PastelStar className="w-4 h-4" filled />
                                    <span className="font-bold text-slate-900 text-base">
                                        {totalStarsEarned}
                                    </span>
                                </div>
                                <span className="text-[10px] text-slate-600 font-semibold uppercase">
                                    Stars Earned
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Subject Filter Pills */}
                    <div
                        className={`p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-2.5 ${
                            calmPastelMode ? 'bg-[#FDFCF9]' : 'bg-white'
                        }`}
                    >
                        {subjects.map(subj => {
                            const active = selectedSubject === subj.id;
                            return (
                                <button
                                    key={subj.id}
                                    onClick={() => {
                                        setSelectedSubject(subj.id);
                                        playChime();
                                    }}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 border ${
                                        active
                                            ? 'bg-[#E3F1E8] text-[#2B523F] border-[#BBD8C6]'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                                    }`}
                                >
                                    {subj.id !== 'all' && (
                                        <SubjectIllustration id={subj.id} className="w-4 h-4" />
                                    )}
                                    <span>{subj.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Grades Table: Subject - Topic - Level - Grade */}
                    <div
                        className={`rounded-2xl border border-slate-200/80 overflow-hidden ${
                            calmPastelMode ? 'bg-[#FDFCF9]' : 'bg-white'
                        }`}
                    >
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                Subject · Topic · Level · Grade
                            </h2>
                            <span className="text-xs text-slate-500">
                                {filteredRecords.length} graded activities
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-6">Subject</th>
                                        <th className="py-3.5 px-4">Topic</th>
                                        <th className="py-3.5 px-4">Level</th>
                                        <th className="py-3.5 px-4">Grade</th>
                                        <th className="py-3.5 px-6 text-right">Listen</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {filteredRecords.map(record => (
                                        <tr
                                            key={record.id}
                                            className="hover:bg-slate-50/70 transition-colors"
                                        >
                                            {/* Subject */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                                                        <SubjectIllustration
                                                            id={record.subjectId}
                                                            className="w-6 h-6"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">
                                                            {record.subjectName}
                                                        </span>
                                                        <span className="text-[11px] text-slate-400">
                                                            {record.dateCompleted}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Topic */}
                                            <td className="py-4 px-4 font-semibold text-slate-800">
                                                {record.topic}
                                            </td>

                                            {/* Level */}
                                            <td className="py-4 px-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#EEF5F0] text-[#2B523F] border border-[#D5E6DC]">
                                                    {record.level}
                                                </span>
                                            </td>

                                            {/* Grade + Stars + Remark */}
                                            <td className="py-4 px-4">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <span className="text-sm font-extrabold text-slate-900">
                                                        {record.gradePercent}%
                                                    </span>
                                                    <span className="text-[11px] text-slate-500">
                                                        ({record.score}/{record.maxScore})
                                                    </span>
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 3 }).map((_, i) => (
                                                            <PastelStar
                                                                key={i}
                                                                className="w-3.5 h-3.5"
                                                                filled={i < record.stars}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyle(
                                                            record.status
                                                        )}`}
                                                    >
                                                        {record.status}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Audio Read-Aloud Button */}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() =>
                                                        speak(
                                                            `${record.subjectName}, ${record.topic}, ${record.level}. Grade: ${record.gradePercent} percent, ${record.status}.`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#E3F1E8] hover:bg-[#D5E9DC] text-[#2B523F] border border-[#C2DFCE] text-[11px] font-semibold transition-colors cursor-pointer"
                                                >
                                                    <svg
                                                        className="w-3.5 h-3.5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                                        />
                                                    </svg>
                                                    <span>Listen</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}