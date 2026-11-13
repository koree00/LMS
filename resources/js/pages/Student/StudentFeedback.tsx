import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, SubjectIllustration, PastelStar } from '@/Components/StudentVisuals';

interface FeedbackItem {
    id: number;
    subjectId: string;
    subjectName: string;
    teacherName: string;
    activityTitle: string;
    message: string;
    starsAwarded: number;
    date: string;
}

export default function StudentFeedback() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [selectedSubject, setSelectedSubject] = useState<string>('all');
    const [speakingId, setSpeakingId] = useState<number | null>(null);

    const feedbackList: FeedbackItem[] = [
        {
            id: 1,
            subjectId: 'math',
            subjectName: 'Mathematics',
            teacherName: 'Teacher Ana Reyes',
            activityTitle: 'Counting 1 to 3 Apples',
            message: 'Great job counting the apples carefully, Leonardo! You took your time and got all 3 stars.',
            starsAwarded: 3,
            date: 'Today · 10:15 AM',
        },
        {
            id: 2,
            subjectId: 'reading',
            subjectName: 'Reading and Literacy',
            teacherName: 'Teacher Ana Reyes',
            activityTitle: 'Letter Sounds A to E',
            message: 'Wonderful listening! You matched the letter sounds with the picture cards very smoothly.',
            starsAwarded: 3,
            date: 'Yesterday · 2:10 PM',
        },
        {
            id: 3,
            subjectId: 'language',
            subjectName: 'Language',
            teacherName: 'Teacher Ana Reyes',
            activityTitle: 'Magandang Umaga Greetings',
            message: 'Very polite answers! Keep practicing your morning greetings at home and in class.',
            starsAwarded: 3,
            date: 'Nov 11, 2026',
        },
        {
            id: 4,
            subjectId: 'gmrc',
            subjectName: 'GMRC',
            teacherName: 'Teacher Ana Reyes',
            activityTitle: 'Tulong sa Tahanan',
            message: 'I love how you chose the helpful actions for family members. Keep up the kindness!',
            starsAwarded: 3,
            date: 'Nov 10, 2026',
        },
        {
            id: 5,
            subjectId: 'makabansa',
            subjectName: 'Makabansa',
            teacherName: 'Teacher Ana Reyes',
            activityTitle: 'Mga Bahagi ng Paaralan',
            message: 'Nice work identifying our library and clinic at San Mateo Elementary!',
            starsAwarded: 3,
            date: 'Nov 9, 2026',
        },
    ];

    const subjects = [
        { id: 'all', name: 'All Subjects' },
        { id: 'math', name: 'Mathematics' },
        { id: 'reading', name: 'Reading' },
        { id: 'language', name: 'Language' },
        { id: 'gmrc', name: 'GMRC' },
        { id: 'makabansa', name: 'Makabansa' },
    ];

    const filteredFeedback = selectedSubject === 'all'
        ? feedbackList
        : feedbackList.filter(item => item.subjectId === selectedSubject);

    const speakMessage = (item: FeedbackItem) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setSpeakingId(item.id);
            const utterance = new SpeechSynthesisUtterance(`${item.teacherName} says: ${item.message}`);
            utterance.rate = 0.9;
            utterance.onend = () => setSpeakingId(null);
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <>
            <Head title="EduQuestAI Teacher Feedback · San Mateo Elementary"/>
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
                                <Link href="/student/feedback" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Teacher Feedback">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / Teacher Feedback</span>
                        </div>

                        <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200 shrink-0">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            <span>Home</span>
                        </Link>
                    </div>

                    {/* Header Banner */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <FoxMascot className="w-14 h-14 shrink-0" accessory="acc-3" />
                            <div className="space-y-1">
                                <span className="inline-block text-[11px] font-semibold text-[#2B523F] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full border border-[#D5E6DC]">
                                    Notes from Teacher Ana
                                </span>
                                <h1 className="text-base font-bold text-slate-900">Encouragement & Activity Notes</h1>
                                <p className="text-xs text-slate-500">Tap “Listen” on any card to hear your teacher’s message read aloud.</p>
                            </div>
                        </div>
                    </div>

                    {/* Visual Subject Filter Pills */}
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex flex-wrap items-center gap-2.5">
                        {subjects.map(subj => {
                            const active = selectedSubject === subj.id;
                            return (
                                <button
                                    key={subj.id}
                                    onClick={() => setSelectedSubject(subj.id)}
                                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-2 border ${
                                        active
                                            ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-white'
                                    }`}
                                >
                                    {subj.id !== 'all' && <SubjectIllustration id={subj.id} className="w-4 h-4" />}
                                    <span>{subj.name}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Visual Feedback Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFeedback.map(item => (
                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0">
                                                <SubjectIllustration id={item.subjectId} className="w-7 h-7" />
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-[11px] font-bold text-[#35634C] block">{item.subjectName}</span>
                                                <h3 className="text-sm font-bold text-slate-900 truncate">{item.activityTitle}</h3>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-0.5 shrink-0">
                                            {Array.from({ length: 3 }).map((_, idx) => (
                                                <PastelStar key={idx} className="w-4 h-4" filled={idx < item.starsAwarded} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/70">
                                        <p className="text-xs text-slate-700 leading-relaxed">“{item.message}”</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="text-[11px] text-slate-500">
                                        <span className="font-semibold text-slate-700">{item.teacherName}</span> · {item.date}
                                    </div>

                                    <button
                                        onClick={() => speakMessage(item)}
                                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border ${
                                            speakingId === item.id
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]'
                                                : 'bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] border-[#D5E6DC]'
                                        }`}
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                        <span>{speakingId === item.id ? 'Reading...' : 'Listen'}</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </main>
            </div>
        </>
    );
}