import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
}

export default function TeacherOverview() {
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

    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: 1, text: 'New classroom observation note logged for Mia S.', time: '10m ago', unread: true },
        { id: 2, text: 'SNED validation review completed for Grade 1 math', time: '1h ago', unread: true },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    return (
        <>
            <Head title="Overview — Teacher Portal · San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/10 z-40 md:hidden backdrop-blur-3xs transition-opacity"
                    />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                    SM
                                </div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shrink-0 border border-transparent hover:border-slate-200/70"
                                aria-label="Toggle Sidebar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            {sidebarOpen && (
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                                    Teacher
                                </div>
                            )}

                            <nav className="space-y-1">
                                <Link href="/teacher/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/teacher/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>Learners</span>}
                                </Link>
                                <Link href="/teacher/lessons" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Lessons</span>}
                                </Link>
                                <Link href="/teacher/observations" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    {sidebarOpen && <span>Observations</span>}
                                </Link>
        
                                <Link href="/teacher/reports" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Reports</span>}
                                </Link>
                                <Link href="/teacher/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-500 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                                                    {sidebarOpen && <span>Messages</span>}
                                                                </Link>
                                <Link href="/teacher/schedule" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    {sidebarOpen && <span>Schedule</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50/50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                            <svg className="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Bar Header */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Overview / Teacher</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Notification Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
                                    title="Notifications"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-2xs">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                                {notifOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden text-xs">
                                        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100 font-bold text-slate-800">
                                            <span>Notifications</span>
                                            {unreadCount > 0 && (
                                                <button onClick={markAllAsRead} className="text-[11px] text-[#4B8B6B] hover:underline font-medium cursor-pointer">Mark all read</button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-2.5 ${n.unread ? 'bg-emerald-50/40' : ''}`}>
                                                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-slate-800 font-medium leading-tight truncate">{n.text}</p>
                                                            <span className="text-[10px] text-slate-400">{n.time}</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-6 text-center text-slate-400">No new notifications</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                TA
                            </div>
                        </div>
                    </div>

                    {/* Greeting & Create Lesson Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm w-full">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Good morning, Teacher Ana</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Class 1 · San Mateo Elementary · Tuesday, November 3</p>
                        </div>
                        <Link href="/teacher/lessons/create" className="px-4 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-fit shrink-0">
                            Create lesson
                        </Link>
                    </div>

                    {/* Metric Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-500">Learners</span>
                            <div className="text-2xl font-bold text-slate-900">24</div>
                            <span className="text-[11px] text-slate-400 block pt-1">Across 2 sections</span>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-500">Lessons ready</span>
                            <div className="text-2xl font-bold text-slate-900">4</div>
                            <span className="text-[11px] text-slate-400 block pt-1">Reviewed and assigned</span>
                        </div>
                        <div className="bg-amber-50/60 p-5 rounded-xl border border-slate-200/60 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-900">Needs review</span>
                            <div className="text-2xl font-bold text-slate-950">5</div>
                            <span className="text-[11px] text-slate-800/80 block pt-1">2 new observations</span>
                        </div>
                        <div className="bg-emerald-50/60 p-5 rounded-xl border border-slate-200/60 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-900">Check-ins</span>
                            <div className="text-2xl font-bold text-slate-950">2</div>
                            <span className="text-[11px] text-slate-800/80 block pt-1">Requested this week</span>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
                        
                        {/* Left: Learner Progress Table */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/70 p-5 sm:p-6 space-y-4 shadow-sm">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Learner progress</h2>
                                <p className="text-xs text-slate-500">Recent lesson activity</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                            <th className="pb-3 uppercase tracking-wider text-[10px]">Learner</th>
                                            <th className="pb-3 uppercase tracking-wider text-[10px]">Last lesson</th>
                                            <th className="pb-3 uppercase tracking-wider text-[10px]">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 font-medium text-slate-900">Mia S.</td>
                                            <td className="py-3.5 text-slate-600">Counting stars</td>
                                            <td className="py-3.5 text-slate-700 font-medium">Ready for next step</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 font-medium text-slate-900">Noah P.</td>
                                            <td className="py-3.5 text-slate-600">Letter sounds</td>
                                            <td className="py-3.5 text-slate-700 font-medium">Teacher check-in</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 font-medium text-slate-900">Ava R.</td>
                                            <td className="py-3.5 text-slate-600">Plant parts</td>
                                            <td className="py-3.5 text-slate-700 font-medium">On track</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 font-medium text-slate-900">Liam T.</td>
                                            <td className="py-3.5 text-slate-600">Number match</td>
                                            <td className="py-3.5 text-slate-700 font-medium">Lesson assigned</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Right Column: Today's Schedule & Needs Attention */}
                        <div className="space-y-6">
                            
                            {/* Today's Schedule Card */}
                            <div className="bg-white rounded-xl border border-slate-200/70 p-5 space-y-3 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900">Today</h3>
                                <div className="space-y-2.5 text-xs text-slate-600">
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                        <span className="font-semibold text-slate-700">9:00</span>
                                        <span>Math group</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                        <span className="font-semibold text-slate-700">10:30</span>
                                        <span>Reading check-in</span>
                                    </div>
                                    <div className="flex items-center justify-between pb-2">
                                        <span className="font-semibold text-slate-700">1:00</span>
                                        <span>Lesson review</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Link href="/teacher/schedule" className="w-full py-2 px-3 border border-slate-200 text-emerald-800 hover:bg-emerald-50 text-xs font-medium rounded-lg transition-all flex items-center justify-center">
                                        View schedule
                                    </Link>
                                </div>
                            </div>

                            {/* Needs Attention Card */}
                            <div className="bg-white rounded-xl border border-slate-200/70 p-5 space-y-3 shadow-sm">
                                <h3 className="text-sm font-bold text-slate-900">Needs attention</h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    2 observations need a response.<br />
                                    1 lesson is waiting for review.
                                </p>
                                <div className="pt-2">
                                    <Link href="/teacher/observations" className="w-full py-2 px-3 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-lg transition-all flex items-center justify-center shadow-sm">
                                        Open review queue
                                    </Link>
                                </div>
                            </div>

                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}