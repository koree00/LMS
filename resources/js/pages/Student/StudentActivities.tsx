import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { SubjectIllustration, PastelStar, PastelCoin, AppleIllustration, FoxMascot } from '@/Components/StudentVisuals';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface LevelItem {
    id: number;
    levelNumber: number;
    title: string;
    status: 'completed' | 'unlocked' | 'locked';
    stars: number;
    highScore: number;
}

interface TopicSection {
    id: number;
    title: string;
    description: string;
    levels: LevelItem[];
}

interface SubjectData {
    id: string;
    name: string;
    color: string;
    topics: TopicSection[];
}

export default function StudentActivities({ notifications = [] }: { notifications?: NotificationItem[] }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('math');
    const [activeLevel, setActiveLevel] = useState<{ level: LevelItem; topicTitle: string; subjectName: string } | null>(null);

    const [gameStep, setGameStep] = useState<number>(1);
    const [mistakes, setMistakes] = useState<number>(0);
    const [isGamePlaying, setIsGamePlaying] = useState<boolean>(false);
    const [gameResult, setGameResult] = useState<{ stars: number; coinsEarned: number; passed: boolean } | null>(null);

    const [totalCoins, setTotalCoins] = useState<number>(120);
    const [totalStars, setTotalStars] = useState<number>(48);
    const [completedActivitiesCount, setCompletedActivitiesCount] = useState<number>(14);

    const subjectsData: SubjectData[] = [
        {
            id: 'math',
            name: 'Mathematics',
            color: 'bg-[#EEF5F0] border-[#D5E6DC]',
            topics: [
                {
                    id: 1,
                    title: 'Chapter 1: Numbers & Quantity (1 to 5)',
                    description: 'Count the illustrated objects on each visual card.',
                    levels: [
                        { id: 101, levelNumber: 1, title: 'Counting 1 to 3 Apples', status: 'completed', stars: 3, highScore: 100 },
                        { id: 102, levelNumber: 2, title: 'Matching Quantities to Digits', status: 'completed', stars: 2, highScore: 85 },
                        { id: 103, levelNumber: 3, title: 'Spot the Missing Number', status: 'unlocked', stars: 0, highScore: 0 },
                    ]
                },
                {
                    id: 2,
                    title: 'Chapter 2: Basic Addition Concepts',
                    description: 'Combine picture groups together with gentle voice guidance.',
                    levels: [
                        { id: 104, levelNumber: 4, title: 'Adding Objects Together', status: 'locked', stars: 0, highScore: 0 },
                        { id: 105, levelNumber: 5, title: 'Plus One Adventures', status: 'locked', stars: 0, highScore: 0 },
                    ]
                }
            ]
        },
        {
            id: 'reading',
            name: 'Reading and Literacy',
            color: 'bg-[#EEF4F8] border-[#D5E3EE]',
            topics: [
                {
                    id: 1,
                    title: 'Chapter 1: Alphabet & Phonemic Awareness',
                    description: 'Listen to letter sounds and match picture cards.',
                    levels: [
                        { id: 201, levelNumber: 1, title: 'Letter Sounds A to E', status: 'completed', stars: 3, highScore: 95 },
                        { id: 202, levelNumber: 2, title: 'Beginning Consonants', status: 'unlocked', stars: 0, highScore: 0 },
                    ]
                }
            ]
        },
        {
            id: 'language',
            name: 'Language',
            color: 'bg-[#FBF6EC] border-[#EBDEC4]',
            topics: [
                {
                    id: 1,
                    title: 'Chapter 1: Oral Communication & Greetings',
                    description: 'Learn polite everyday expressions (Magalang na Pananalita).',
                    levels: [
                        { id: 301, levelNumber: 1, title: 'Magandang Umaga Greetings', status: 'completed', stars: 3, highScore: 95 },
                        { id: 302, levelNumber: 2, title: 'Pakiusap at Salamat', status: 'unlocked', stars: 0, highScore: 0 },
                    ]
                }
            ]
        },
        {
            id: 'gmrc',
            name: 'GMRC',
            color: 'bg-[#FAF0EE] border-[#EBD5D0]',
            topics: [
                {
                    id: 1,
                    title: 'Chapter 1: Pagmamahal sa Pamilya',
                    description: 'Understanding home roles and helpfulness in the family.',
                    levels: [
                        { id: 401, levelNumber: 1, title: 'Tulong sa Tahanan', status: 'completed', stars: 3, highScore: 90 },
                        { id: 402, levelNumber: 2, title: 'Paggalang sa Nakatatanda', status: 'unlocked', stars: 0, highScore: 0 },
                    ]
                }
            ]
        },
        {
            id: 'makabansa',
            name: 'Makabansa',
            color: 'bg-[#F5F3FA] border-[#DFDAEC]',
            topics: [
                {
                    id: 1,
                    title: 'Chapter 1: Ang Aking Paaralan',
                    description: 'Explore school facilities and community helpers.',
                    levels: [
                        { id: 501, levelNumber: 1, title: 'Mga Bahagi ng Paaralan', status: 'completed', stars: 3, highScore: 92 },
                        { id: 502, levelNumber: 2, title: 'Aming mga Guro at Kawani', status: 'unlocked', stars: 0, highScore: 0 },
                    ]
                }
            ]
        }
    ];

    const currentSubject = subjectsData.find(s => s.id === selectedSubjectId) || subjectsData[0];

    const speakInstructions = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleStartLevel = (level: LevelItem, topicTitle: string) => {
        setActiveLevel({ level, topicTitle, subjectName: currentSubject.name });
        setGameStep(1);
        setMistakes(0);
        setIsGamePlaying(true);
        setGameResult(null);
        speakInstructions(`Starting ${level.title}. Count the pictures and tap the matching number card.`);
    };

    const handleAnswerItem = (isCorrect: boolean) => {
        if (!isCorrect) setMistakes(prev => prev + 1);
        if (gameStep < 5) {
            setGameStep(prev => prev + 1);
        } else {
            const finalMistakes = !isCorrect ? mistakes + 1 : mistakes;
            let earnedStars = 3;
            if (finalMistakes === 2) earnedStars = 2;
            else if (finalMistakes === 3) earnedStars = 1;
            else if (finalMistakes > 3) earnedStars = 0;

            const passed = earnedStars > 0;
            const newCompletedCount = completedActivitiesCount + 1;
            setCompletedActivitiesCount(newCompletedCount);

            let coinsEarned = 0;
            if (passed) {
                if (newCompletedCount % 7 === 0) coinsEarned = 20;
                else if (newCompletedCount % 4 === 0) coinsEarned = 15;
                else coinsEarned = 10;

                setTotalCoins(prev => prev + coinsEarned);
                setTotalStars(prev => prev + earnedStars);
            }

            setGameResult({ stars: earnedStars, coinsEarned, passed });
            setIsGamePlaying(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [notifOpen]);

    return (
        <>
            <Head title="EduQuestAI Gamified Activities · San Mateo Elementary"/>
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
                                <Link href="/student/activities" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Gamified Activities">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / Gamified Activities</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Home</span>
                            </Link>
                            <button onClick={() => speakInstructions('Welcome to your learning map! Pick a subject, then tap on any open level to start playing and earning stars.')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] font-semibold text-xs transition-colors cursor-pointer border border-[#D5E6DC]">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                <span>Audio Help</span>
                            </button>
                            <div className="flex items-center gap-1.5 bg-[#FBF6EC] border border-[#EBDEC4] px-3.5 py-2 rounded-xl text-xs font-bold text-[#6E5630]">
                                <PastelCoin className="w-4 h-4" />
                                <span>{totalCoins} Coins</span>
                            </div>
                        </div>
                    </div>

                    {/* Visual Subject Selector */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-3.5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Select Learning Subject</h1>
                            <span className="text-xs text-slate-500">Tap a picture card to view levels</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {subjectsData.map(subj => {
                                const isSelected = subj.id === selectedSubjectId;
                                return (
                                    <button
                                        key={subj.id}
                                        onClick={() => setSelectedSubjectId(subj.id)}
                                        className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-3 ${
                                            isSelected 
                                                ? 'bg-[#4B8B6B] text-white border-[#4B8B6B]' 
                                                : 'bg-slate-50/70 text-slate-700 border-slate-200/80 hover:bg-white hover:border-[#4B8B6B]'
                                        }`}
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                                            <SubjectIllustration id={subj.id} className="w-6 h-6" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className="text-xs font-bold block truncate">{subj.name}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Visual Adventure Map */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3.5">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${currentSubject.color}`}>
                                    <SubjectIllustration id={currentSubject.id} className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">{currentSubject.name} Learning Path</h2>
                                    <p className="text-xs text-slate-500">Complete levels at your own pace to collect stars and coins.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => speakInstructions(`You are viewing the ${currentSubject.name} learning path. Tap any open level card to begin.`)}
                                className="px-3.5 py-2 bg-[#EEF5F0] text-[#2B523F] border border-[#D5E6DC] font-semibold text-xs rounded-xl hover:bg-[#E1EDE5] transition-colors cursor-pointer flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                <span>Read Path Aloud</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {currentSubject.topics.map((topic, tIdx) => (
                                <div key={topic.id} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-5">
                                    <div>
                                        <span className="text-[11px] font-bold text-[#35634C] uppercase tracking-wider block">Chapter {tIdx + 1}</span>
                                        <h3 className="text-sm font-bold text-slate-900 mt-0.5">{topic.title}</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">{topic.description}</p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-6 pt-2 pb-2">
                                        {topic.levels.map((lvl, index) => {
                                            const isCompleted = lvl.status === 'completed';
                                            const isUnlocked = lvl.status === 'unlocked';
                                            const isLocked = lvl.status === 'locked';

                                            return (
                                                <div key={lvl.id} className="flex items-center gap-6">
                                                    <div className="flex flex-col items-center space-y-2">
                                                        <button
                                                            disabled={isLocked}
                                                            onClick={() => handleStartLevel(lvl, topic.title)}
                                                            className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center font-bold text-sm transition-colors border-2 cursor-pointer p-2 ${
                                                                isCompleted ? 'bg-[#FBF6EC] text-[#6E5630] border-[#E0C799] hover:bg-[#F4EBD9]' :
                                                                isUnlocked ? 'bg-[#4B8B6B] text-white border-[#3D7257] hover:bg-[#3D7257]' :
                                                                'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                                            }`}
                                                        >
                                                            <span className="text-lg">{lvl.levelNumber}</span>
                                                            {isLocked ? (
                                                                <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                                                            ) : isCompleted ? (
                                                                <div className="flex items-center gap-0.5 mt-1">
                                                                    {Array.from({ length: 3 }).map((_, sIdx) => (
                                                                        <PastelStar key={sIdx} className="w-4 h-4" filled={sIdx < lvl.stars} />
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <span className="text-[11px] font-semibold mt-1 bg-white/20 px-2 py-0.5 rounded-full">Play</span>
                                                            )}
                                                        </button>
                                                        <span className="text-xs font-semibold text-slate-700 text-center max-w-[120px] leading-snug" title={lvl.title}>
                                                            {lvl.title}
                                                        </span>
                                                    </div>

                                                    {index < topic.levels.length - 1 && (
                                                        <div className="w-10 h-1 bg-slate-300 rounded-full hidden sm:block"></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </div>

            {/* Visual Interactive Activity Modal */}
            {activeLevel && isGamePlaying && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 space-y-6">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div>
                                <span className="text-[11px] font-bold text-[#35634C] uppercase tracking-wider">{activeLevel.subjectName} · {activeLevel.topicTitle}</span>
                                <h3 className="text-sm font-bold text-slate-900 mt-0.5">{activeLevel.level.title}</h3>
                            </div>
                            <span className="px-3 py-1 bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs rounded-full border border-[#D5E6DC]">
                                {gameStep} / 5
                            </span>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-center space-y-5">
                            {/* Visual Counting Objects */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex items-center justify-center gap-4">
                                <AppleIllustration className="w-14 h-14" />
                                <AppleIllustration className="w-14 h-14" />
                                <AppleIllustration className="w-14 h-14" />
                            </div>

                            <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                How many apples are on the card?
                            </p>

                            {/* Visual Number + Dot Choices */}
                            <div className="grid grid-cols-2 gap-3.5 pt-1">
                                <button 
                                    onClick={() => handleAnswerItem(true)}
                                    className="p-4 bg-white hover:bg-[#EEF5F0] text-slate-800 rounded-xl border-2 border-slate-200 hover:border-[#4B8B6B] transition-colors cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <span className="text-2xl font-extrabold text-[#35634C]">3</span>
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#4B8B6B]"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#4B8B6B]"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#4B8B6B]"></span>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => handleAnswerItem(false)}
                                    className="p-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl border-2 border-slate-200 transition-colors cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <span className="text-2xl font-extrabold text-slate-600">5</span>
                                    <div className="flex gap-1.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                        <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <button 
                                onClick={() => setIsGamePlaying(false)}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Pause & Exit
                            </button>
                            <button 
                                onClick={() => speakInstructions("Count the apples in the picture, then tap the matching number.")}
                                className="px-4 py-2.5 bg-[#EEF5F0] hover:bg-[#E1EDE5] text-[#2B523F] font-semibold rounded-xl text-xs transition-colors cursor-pointer border border-[#D5E6DC] flex items-center gap-1.5"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                                <span>Repeat Audio</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Result Modal with Visual Stars & Mascot */}
            {activeLevel && gameResult && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 space-y-5 text-center">
                        <FoxMascot className="w-16 h-16 mx-auto" hat="hat-1" />
                        <div className="space-y-1.5">
                            <h3 className="text-base font-bold text-slate-900">
                                {gameResult.passed ? 'Wonderful Job!' : 'Good Effort — Let’s Try Again'}
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {gameResult.passed 
                                    ? `You completed ${activeLevel.level.title}!`
                                    : `Take a deep breath. You can try again whenever you feel ready.`
                                }
                            </p>
                        </div>

                        {gameResult.passed && (
                            <div className="bg-[#FBF6EC] border border-[#EBDEC4] p-4 rounded-2xl space-y-2.5">
                                <div className="flex justify-center gap-2">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <PastelStar key={i} className="w-8 h-8" filled={i < gameResult.stars} />
                                    ))}
                                </div>
                                <div className="flex items-center justify-center gap-4 text-xs font-bold text-[#6E5630]">
                                    <span>+{gameResult.stars} Stars</span>
                                    <span className="flex items-center gap-1">
                                        <PastelCoin className="w-4 h-4" /> +{gameResult.coinsEarned} Coins
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                            <Link 
                                href="/student/overview"
                                className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Home
                            </Link>
                            <button 
                                onClick={() => { setGameResult(null); setActiveLevel(null); }}
                                className="w-full sm:w-auto px-4 py-2.5 bg-[#FBF6EC] hover:bg-[#F4EBD9] text-[#6E5630] border border-[#EBDEC4] font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Back to Map
                            </button>
                            <button 
                                onClick={() => { setGameResult(null); handleStartLevel(activeLevel.level, activeLevel.topicTitle); }}
                                className="w-full sm:w-auto px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Play Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}