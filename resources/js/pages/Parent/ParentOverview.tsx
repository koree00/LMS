import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ParentOverviewProps {
    notifications?: NotificationItem[];
    child?: {
        name: string;
        gradeSection: string;
        streakDays: number;
        completedLessonsCount: number;
        earnedBadgesCount: number;
        currentMilestone: string;
    };
    parentUser?: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

export default function ParentOverview({ 
    notifications = [], 
    child = {
        name: 'Alex Res',
        gradeSection: 'Grade 1 SNED · Section 1',
        streakDays: 5,
        completedLessonsCount: 14,
        earnedBadgesCount: 8,
        currentMilestone: 'Alphabet & Phonetic Sounds - Level 2'
    },
    parentUser = {
        name: 'Roberto Res',
        email: 'roberto.res@gmail.com',
        role: 'Parent / guardian'
    }
}: ParentOverviewProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setNotifOpen(false);
            }
        };
        if (notifOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [notifOpen]);

    const [notifList, setNotifList] = useState<NotificationItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('parent_notifications_dismissed');
            if (saved) {
                const dismissedIds: number[] = JSON.parse(saved);
                return notifications.filter(n => !dismissedIds.includes(n.id));
            }
        }
        return notifications.length > 0 ? notifications : [
            { id: 1, text: 'Teacher Mara posted a new home-reinforcement activity', time: '15m ago', unread: true, link: '/parent/activities' },
            { id: 2, text: 'Alex earned the "Phonics Star" badge today!', time: '2h ago', unread: true, link: '/parent/progress' }
        ];
    });

    const handleNotificationClick = (notification: NotificationItem) => {
        const updated = notifList.filter(n => n.id !== notification.id);
        setNotifList(updated);

        if (typeof window !== 'undefined') {
            const currentDismissed = JSON.parse(localStorage.getItem('parent_notifications_dismissed') || '[]');
            localStorage.setItem('parent_notifications_dismissed', JSON.stringify([...currentDismissed, notification.id]));
        }

        setNotifOpen(false);
        router.visit(notification.link);
    };

    const markAllAsRead = () => {
        setNotifList([]);
        if (typeof window !== 'undefined') {
            const allIds = notifications.map(n => n.id);
            localStorage.setItem('parent_notifications_dismissed', JSON.stringify(allIds));
        }
    };

    const unreadCount = notifList.length;

    return (
        <>
            <Head title="Parent Dashboard — EduQuestAI · San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/10 z-40 md:hidden backdrop-blur-3xs transition-opacity" />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-black-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">EQ</div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shrink-0 border border-transparent hover:border-slate-200/70">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                        <div>
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Parent Portal</div>}
                            <nav className="space-y-1">
                                <Link href="/parent/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/parent/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>
                                <Link href="/parent/progress" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Child Progress">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Child Progress</span>}
                                </Link>
                                <Link href="/parent/activities" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Home Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Home Activities</span>}
                                </Link>
                                
                                <Link href="/parent/account" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Account">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    {sidebarOpen && <span>My account</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>
                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50/50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Sign out">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Overview / Parent Portal</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <div className="relative hidden sm:block">
                                
                            </div>

                            {/* Notification Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setNotifOpen(!notifOpen)} 
                                    className="relative w-9 h-9 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 cursor-pointer transition-all"
                                    title="Notifications"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200/70 p-3.5 z-50">
                                        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                                            <span className="text-xs font-bold text-slate-800">Notifications ({unreadCount})</span>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllAsRead} className="text-[11px] text-[#4B8B6B] hover:underline font-medium cursor-pointer">Mark all read</button>
                                            )}
                                        </div>
                                        <div className="space-y-2 max-h-56 overflow-y-auto">
                                            {notifList.length === 0 ? (
                                                <div className="py-4 text-center text-xs text-slate-400">No new notifications</div>
                                            ) : (
                                                notifList.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => handleNotificationClick(n)}
                                                        className="p-2.5 rounded-lg text-xs border bg-emerald-50/50 border-slate-100 font-medium cursor-pointer hover:bg-emerald-100/60 transition-all"
                                                    >
                                                        <p className="leading-snug text-slate-800">{n.text}</p>
                                                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time} · Click to view</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Parent Avatar Badge */}
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                {parentUser.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                    </div>

                    {/* Combined Welcome & Child Progress Summary Card */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Parent & Guardian Dashboard</h1>
                                                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Welcome back, {parentUser.name}</span>

                        </div>

                        {/* 4 Stat Metrics Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                            {/* Card 1: Child Name & Grade */}
                            <div className="bg-emerald-50/60 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Enrolled Learner</span>
                                <div className="text-lg font-bold text-slate-900 truncate">{child.name}</div>
                                <span className="text-[11px] text-slate-600 block pt-0.5">{child.gradeSection}</span>
                            </div>

                            {/* Card 2: Daily Streak */}
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Learning streak</span>
                                <div className="text-2xl font-bold text-slate-900">{child.streakDays} Days</div>
                                <span className="text-[11px] text-slate-400 block pt-1">Active daily login</span>
                            </div>

                            {/* Card 3: Completed Lessons */}
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Completed lessons</span>
                                <div className="text-2xl font-bold text-slate-900">{child.completedLessonsCount}</div>
                                <span className="text-[11px] text-slate-400 block pt-1">Gamified modules finished</span>
                            </div>

                            {/* Card 4: Earned Badges */}
                            <div className="bg-amber-50/60 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Badges unlocked</span>
                                <div className="text-2xl font-bold text-slate-900">{child.earnedBadgesCount} Badges</div>
                                <span className="text-[11px] text-slate-500 block pt-1">Reward milestones</span>
                            </div>
                        </div>
                    </div>

                    {/* Lower Grid: Current Milestone & Quick Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        
                        {/* Current Milestone & Sensory Feedback Card */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/70 p-6 space-y-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">Current learning focus</h2>

                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-black-650 bg-emerald-100 border border-slate-200 px-2.5 py-1 rounded-md">Active Module</span>
                                    <span className="text-xs text-slate-500 font-medium">San Mateo Elementary SNED</span>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">{child.currentMilestone}</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Your child is currently exploring interactive literacy and phonetic identification games designed with low-stimulation visual assets and sensory pause safeguards.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <Link 
                                    href="/parent/progress" 
                                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 block">View full progress</span>
                                        <span className="text-[11px] text-slate-500 block">Check skill mastery breakdown</span>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                </Link>

                                <Link 
                                    href="/parent/activities" 
                                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-emerald-50/30 transition-all flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="space-y-0.5">
                                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 block">Home activities</span>
                                        <span className="text-[11px] text-slate-500 block">Guided offline practice tasks</span>
                                    </div>
                                    <svg className="w-4 h-4 text-slate-400 group-hover:text-black-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                </Link>
                            </div>
                        </div>

                        {/* Teacher Communication & Support Card */}
                        <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">Inclusive educator support</h2>

                            <div className="space-y-3 text-xs">
                                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                                    <span className="font-bold text-slate-900 block">Teacher Mara Santos</span>
                                    <span className="text-slate-500 block text-[11px]">Inclusive Education Teacher · Section 1</span>
                                    <span className="text-emerald-700 font-semibold block text-[11px] pt-1">Active & Available</span>
                                </div>
                                <p className="text-slate-600 text-[11px] leading-relaxed">
                                    Feel free to send a direct message if you have questions regarding your child's daily sensory feedback or home-reinforcement exercises.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link 
                                    href="/parent/messages"
                                    className="w-full py-2.5 px-4 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center text-xs cursor-pointer"
                                >
                                    Open messages
                                </Link>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}