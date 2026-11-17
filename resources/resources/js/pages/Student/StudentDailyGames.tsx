import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FoxMascot, SubjectIllustration, PastelStar, PastelCoin, AppleIllustration } from '@/Components/StudentVisuals';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface DailyGameItem {
    id: string;
    title: string;
    subtitle: string;
    color: string;
    rewardCoins: number;
    completedToday: boolean;
}

export default function StudentDailyGames({ notifications = [] }: { notifications?: NotificationItem[] }) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') return window.innerWidth >= 768;
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const [totalCoins, setTotalCoins] = useState<number>(120);
    const [activeGame, setActiveGame] = useState<DailyGameItem | null>(null);
    const [selectedCard, setSelectedCard] = useState<number | null>(null);
    const [gameCompletedBanner, setGameCompletedBanner] = useState<string | null>(null);

    const [games, setGames] = useState<DailyGameItem[]>([
        {
            id: 'memory-match',
            title: 'Picture Memory Match',
            subtitle: 'Find the matching pastel picture pair',
            color: 'bg-[#EEF5F0] border-[#D5E6DC]',
            rewardCoins: 15,
            completedToday: false,
        },
        {
            id: 'pattern-builder',
            title: 'Shape & Color Pattern',
            subtitle: 'Pick the missing visual tile in the row',
            color: 'bg-[#EEF4F8] border-[#D5E3EE]',
            rewardCoins: 15,
            completedToday: false,
        },
        {
            id: 'quick-count',
            title: 'Calm Apple Counter',
            subtitle: 'Count the illustrated apples at your own pace',
            color: 'bg-[#FBF6EC] border-[#EBDEC4]',
            rewardCoins: 15,
            completedToday: true,
        },
    ]);

    const renderGameIllustration = (id: string, className = 'w-10 h-10') => {
        switch (id) {
            case 'memory-match':
                return (
                    <svg viewBox="0 0 48 48" className={className} fill="none">
                        <rect x="6" y="8" width="16" height="22" rx="4" fill="#9BC3DC" stroke="#4D7C9E" strokeWidth="2" />
                        <circle cx="14" cy="19" r="3.5" fill="#FFFFFF" />
                        <rect x="26" y="16" width="16" height="22" rx="4" fill="#F2D398" stroke="#B88E35" strokeWidth="2" />
                        <circle cx="34" cy="27" r="3.5" fill="#FFFFFF" />
                    </svg>
                );
            case 'pattern-builder':
                return (
                    <svg viewBox="0 0 48 48" className={className} fill="none">
                        <circle cx="14" cy="16" r="6" fill="#E09486" stroke="#B36557" strokeWidth="2" />
                        <rect x="28" y="10" width="12" height="12" rx="3" fill="#7AB394" stroke="#4B8B6B" strokeWidth="2" />
                        <rect x="8" y="28" width="12" height="12" rx="3" fill="#7AB394" stroke="#4B8B6B" strokeWidth="2" />
                        <circle cx="34" cy="34" r="6" fill="#E09486" stroke="#B36557" strokeWidth="2" />
                    </svg>
                );
            default:
                return <AppleIllustration className={className} />;
        }
    };

    const handleFinishDailyGame = (game: DailyGameItem) => {
        if (!game.completedToday) {
            setTotalCoins(prev => prev + game.rewardCoins);
            setGames(prev => prev.map(g => g.id === game.id ? { ...g, completedToday: true } : g));
            setGameCompletedBanner(`Great job! You earned +${game.rewardCoins} Coins from ${game.title}.`);
        } else {
            setGameCompletedBanner(`Nice practice! You already collected today's coins for ${game.title}.`);
        }
        setActiveGame(null);
        setSelectedCard(null);
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
            <Head title="EduQuestAI Daily Games · San Mateo Elementary"/>
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
                                <Link href="/student/daily-games" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#EEF5F0] text-[#2B523F] font-semibold text-xs border border-[#D5E6DC] transition-colors ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Daily Games">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">EduQuestAI / Daily Mini-Games</span>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <Link href="/student/overview" className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold text-xs transition-colors cursor-pointer border border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                                <span>Home</span>
                            </Link>
                            <div className="flex items-center gap-1.5 bg-[#FBF6EC] border border-[#EBDEC4] px-3.5 py-2 rounded-xl text-xs font-bold text-[#6E5630]">
                                <PastelCoin className="w-4 h-4" />
                                <span>{totalCoins} Coins</span>
                            </div>
                        </div>
                    </div>

                    {gameCompletedBanner && (
                        <div className="bg-[#EEF5F0] border border-[#D5E6DC] text-[#2B523F] px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <PastelCoin className="w-5 h-5 shrink-0" />
                                <span>{gameCompletedBanner}</span>
                            </div>
                            <button onClick={() => setGameCompletedBanner(null)} className="underline cursor-pointer">Close</button>
                        </div>
                    )}

                    {/* Header Banner */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <FoxMascot className="w-14 h-14 shrink-0" hat="hat-2" />
                            <div className="space-y-1">
                                <span className="inline-block text-[11px] font-semibold text-[#6E5630] bg-[#FBF6EC] px-2.5 py-0.5 rounded-full border border-[#EBDEC4]">
                                    No Timers · Calm Visual Play
                                </span>
                                <h1 className="text-base font-bold text-slate-900">Daily Visual Mini-Games</h1>
                                <p className="text-xs text-slate-500">Play short picture games each day to collect bonus coins for your avatar.</p>
                            </div>
                        </div>
                    </div>

                    {/* Daily Games Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {games.map(game => (
                            <div key={game.id} className="bg-white p-6 rounded-2xl border border-slate-200/80 flex flex-col justify-between space-y-5">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${game.color}`}>
                                            {renderGameIllustration(game.id, 'w-10 h-10')}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1 ${
                                            game.completedToday 
                                                ? 'bg-[#EEF5F0] text-[#2B523F] border-[#D5E6DC]' 
                                                : 'bg-[#FBF6EC] text-[#6E5630] border-[#EBDEC4]'
                                        }`}>
                                            {game.completedToday ? 'Done Today' : (
                                                <>
                                                    <PastelCoin className="w-3.5 h-3.5" /> +{game.rewardCoins}
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">{game.title}</h2>
                                        <p className="text-xs text-slate-500 mt-1">{game.subtitle}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setActiveGame(game); setSelectedCard(null); }}
                                    className={`w-full py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                                        game.completedToday
                                            ? 'bg-slate-100 hover:bg-slate-200/70 text-slate-700 border border-slate-200'
                                            : 'bg-[#4B8B6B] hover:bg-[#3D7257] text-white'
                                    }`}
                                >
                                    {game.completedToday ? 'Play Again for Fun' : 'Play Daily Game'}
                                </button>
                            </div>
                        ))}
                    </div>

                </main>
            </div>

            {/* Interactive Visual Mini-Game Modal */}
            {activeGame && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${activeGame.color}`}>
                                    {renderGameIllustration(activeGame.id, 'w-7 h-7')}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{activeGame.title}</h3>
                                    <span className="text-[11px] text-slate-500">Tap the matching picture card below</span>
                                </div>
                            </div>
                            <span className="px-2.5 py-1 bg-[#FBF6EC] text-[#6E5630] border border-[#EBDEC4] rounded-full text-xs font-bold flex items-center gap-1">
                                <PastelCoin className="w-3.5 h-3.5" /> +{activeGame.rewardCoins}
                            </span>
                        </div>

                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4 text-center">
                            <p className="text-xs font-bold text-slate-700">Find the matching Apple card:</p>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { idx: 0, label: 'Blocks', node: <SubjectIllustration id="math" className="w-11 h-11 mx-auto" /> },
                                    { idx: 1, label: 'Apple', node: <AppleIllustration className="w-11 h-11 mx-auto" /> },
                                    { idx: 2, label: 'Book', node: <SubjectIllustration id="reading" className="w-11 h-11 mx-auto" /> },
                                ].map(card => (
                                    <button
                                        key={card.idx}
                                        onClick={() => setSelectedCard(card.idx)}
                                        className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex flex-col items-center gap-2 ${
                                            selectedCard === card.idx
                                                ? 'bg-[#EEF5F0] border-[#4B8B6B]'
                                                : 'bg-white border-slate-200 hover:border-[#4B8B6B]'
                                        }`}
                                    >
                                        {card.node}
                                        <span className="text-xs font-bold text-slate-700">{card.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <button
                                onClick={() => setActiveGame(null)}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200/70 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
                            >
                                Close
                            </button>
                            <button
                                disabled={selectedCard !== 1}
                                onClick={() => handleFinishDailyGame(activeGame)}
                                className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                                    selectedCard === 1
                                        ? 'bg-[#4B8B6B] hover:bg-[#3D7257] text-white cursor-pointer'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Collect Coins
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}