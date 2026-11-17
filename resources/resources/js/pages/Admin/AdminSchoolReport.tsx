import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface SectionReportItem {
    id: number;
    sectionName: string;
    teacher: string;
    totalLearners: number;
    snedCount: number;
    status: string;
}

interface MatatagMonthlyTrend {
    month: string;
    readingAndLiteracy: number;
    language: number;
    makabansa: number;
    math: number;
    gmrc: number;
}

interface SchoolStats {
    totalEnrolled: number;
    inclusionLearners: number;
    activeFaculty: number;
    systemCompliance: string;
}

interface AdminSchoolReportProps {
    notifications?: NotificationItem[];
    stats?: SchoolStats;
    sections?: SectionReportItem[];
    matatagTrends?: MatatagMonthlyTrend[];
}

export default function AdminSchoolReport({ notifications = [], stats, sections = [], matatagTrends = [] }: AdminSchoolReportProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const notifRef = useRef<HTMLDivElement>(null);

    const sectionList = sections;
    const trendList = matatagTrends;

    const filteredSections = sectionList.filter(s => 
        s.sectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
            const saved = localStorage.getItem('admin_notifications_dismissed');
            if (saved) {
                const dismissedIds: number[] = JSON.parse(saved);
                return notifications.filter(n => !dismissedIds.includes(n.id));
            }
        }
        return notifications;
    });

    const handleNotificationClick = (notification: NotificationItem) => {
        const updated = notifList.filter(n => n.id !== notification.id);
        setNotifList(updated);

        if (typeof window !== 'undefined') {
            const currentDismissed = JSON.parse(localStorage.getItem('admin_notifications_dismissed') || '[]');
            localStorage.setItem('admin_notifications_dismissed', JSON.stringify([...currentDismissed, notification.id]));
        }

        setNotifOpen(false);
        router.visit(notification.link);
    };

    const markAllAsRead = () => {
        setNotifList([]);
        if (typeof window !== 'undefined') {
            const allIds = notifications.map(n => n.id);
            localStorage.setItem('admin_notifications_dismissed', JSON.stringify(allIds));
        }
    };

    const unreadCount = notifList.length;

    return (
        <>
            <Head title="School Report — Admin & Principal Portal · San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/10 z-40 md:hidden backdrop-blur-3xs transition-opacity print:hidden" />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0 print:hidden
                    ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">EQ</div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary </span>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shrink-0 border border-transparent hover:border-slate-200/70">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>
                        <div>
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Admin Portal</div>}
                            <nav className="space-y-1">
                                <Link href="/admin/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/admin/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50  text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                                                    {sidebarOpen && <span>Messages</span>}
                                                                </Link>
                                <Link href="/admin/users" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Management">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>User Management</span>}
                                </Link>
                                <Link href="/admin/school-report" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-black-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="School Reports">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>School Reports</span>}
                                </Link>
                                <Link href="/admin/reports" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Compliance Reports">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                    {sidebarOpen && <span>Compliance Reports</span>}
                                </Link>
                                <Link href="/admin/settings" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Settings">
                                                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                                    {sidebarOpen && <span>My Settings</span>}
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
                <main className={`flex-1 w-full min-w-0 py-6 px-3 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-6 transition-all duration-200 ml-0 print:ml-0 print:w-full print:max-w-none print:p-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border print:hidden">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">School Report / Admin Portal</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Notification Bell Dropdown */}
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

                            {/* Admin Avatar Badge */}
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-black-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* Header Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">School-Wide Inclusion & Enrollment Report</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">San Mateo Elementary School · Performance & Section Metrics</p>
                        </div>
                        <button onClick={() => window.print()} className="px-4 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-fit print:hidden">
                            Print School Report
                        </button>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full box-border">
                        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-500">Total Enrolled Learners</span>
                            <div className="text-2xl font-bold text-slate-900">{stats?.totalEnrolled ?? 0}</div>
                            <span className="text-[11px] text-emerald-700 font-medium block pt-1">Grade 1</span>
                        </div>
                        <div className="bg-emerald-50/60 p-5 rounded-xl border border-slate-200/60 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-emerald-900">Inclusion Learners (SNED)</span>
                            <div className="text-2xl font-bold text-emerald-950">{stats?.inclusionLearners ?? 0}</div>
                            <span className="text-[11px] text-emerald-800/80 block pt-1">Mild ASD & ADHD support</span>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-slate-500">Active Faculty & Staff</span>
                            <div className="text-2xl font-bold text-slate-900">{stats?.activeFaculty ?? 0}</div>
                            <span className="text-[11px] text-slate-400 block pt-1">Teachers & Coordinators</span>
                        </div>
                        <div className="bg-emerald-50/60 p-5 rounded-xl border border-slate-200/60 shadow-2xs space-y-1">
                            <span className="text-xs font-medium text-emerald-900">System Compliance</span>
                            <div className="text-2xl font-bold text-emerald-950">{stats?.systemCompliance ?? '0%'}</div>
                            <span className="text-[11px] text-emerald-800/80 block pt-1">Ed standards</span>
                        </div>
                    </div>

                    {/* MATATAG Curriculum Vertical Bar Chart: Monthly Progression by All 5 Learning Areas (Reading, Language, Makabansa, Math, GMRC) */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-6 shadow-sm w-full box-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">MATATAG Curriculum Progression (Grade 1 Learning Areas)</h2>
                                <p className="text-xs text-slate-500">Cohort completion percentages across all 5 foundational MATATAG subjects.</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded bg-[#7A9A8B] block"></span>
                                    <span className="text-slate-700">Reading & Literacy</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded bg-[#6FA8A2] block"></span>
                                    <span className="text-slate-700">Language</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded bg-[#7A93B0] block"></span>
                                    <span className="text-slate-700">Makabansa</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded bg-[#9A8CB0] block"></span>
                                    <span className="text-slate-700">Mathematics</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded bg-[#B08C9A] block"></span>
                                    <span className="text-slate-700">GMRC</span>
                                </div>
                            </div>
                        </div>

                        {/* Responsive Scrollable Vertical Bar Chart Container */}
                        <div className="w-full overflow-x-auto pb-4">
                            {trendList.length === 0 ? (
                                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                    No curriculum progression data available.
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 gap-6 pt-6 pb-2 items-end h-64 border-b border-slate-100 px-2 min-w-[760px]">
                                    {trendList.map((trend, index) => (
                                        <div key={index} className="flex flex-col items-center h-full justify-end space-y-2 group">
                                            <div className="w-full flex items-end justify-center gap-1 h-48 bg-slate-50/80 rounded-xl p-2 border border-slate-200/60 relative">
                                                
                                                {/* Reading & Literacy Bar (Soft Sage) */}
                                                <div className="w-1/5 bg-[#7A9A8B] rounded-t-xs transition-all duration-500 relative group-hover:opacity-90" style={{ height: `${trend.readingAndLiteracy}%` }} title={`Reading & Literacy: ${trend.readingAndLiteracy}%`}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-xs rounded">{trend.readingAndLiteracy}%</span>
                                                </div>

                                                {/* Language Bar (Soft Teal) */}
                                                <div className="w-1/5 bg-[#6FA8A2] rounded-t-xs transition-all duration-500 relative group-hover:opacity-90" style={{ height: `${trend.language}%` }} title={`Language: ${trend.language}%`}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-xs rounded">{trend.language}%</span>
                                                </div>

                                                {/* Makabansa Bar (Soft Sky Blue) */}
                                                <div className="w-1/5 bg-[#7A93B0] rounded-t-xs transition-all duration-500 relative group-hover:opacity-90" style={{ height: `${trend.makabansa}%` }} title={`Makabansa: ${trend.makabansa}%`}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-xs rounded">{trend.makabansa}%</span>
                                                </div>

                                                {/* Mathematics Bar (Soft Muted Lavender) */}
                                                <div className="w-1/5 bg-[#9A8CB0] rounded-t-xs transition-all duration-500 relative group-hover:opacity-90" style={{ height: `${trend.math}%` }} title={`Mathematics: ${trend.math}%`}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-xs rounded">{trend.math}%</span>
                                                </div>

                                                {/* GMRC Bar (Soft Muted Rose) */}
                                                <div className="w-1/5 bg-[#B08C9A] rounded-t-xs transition-all duration-500 relative group-hover:opacity-90" style={{ height: `${trend.gmrc}%` }} title={`GMRC: ${trend.gmrc}%`}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1 shadow-xs rounded">{trend.gmrc}%</span>
                                                </div>

                                            </div>
                                            <span className="text-xs font-bold text-slate-700 pt-1">{trend.month}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section-Level Inclusion Overview */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-5 shadow-sm w-full box-border">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Section-Level Inclusion Overview</h2>
                                <p className="text-xs text-slate-500">Detailed breakdown of enrollment and SNED support per class section.</p>
                            </div>
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search sections or teachers..."
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:w-64 print:hidden"
                            />
                        </div>

                        {/* Distinct Separated Section Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs w-full">
                            {filteredSections.length === 0 ? (
                                <div className="col-span-3 py-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                    No section records found in database.
                                </div>
                            ) : (
                                filteredSections.map(section => (
                                    <div key={section.id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between w-full box-border">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-bold text-slate-900 text-sm truncate">{section.sectionName}</span>
                                                <span className={`font-semibold px-2 py-0.5 rounded text-[10px] border shrink-0 ${
                                                    section.status === 'Optimal Progress' 
                                                        ? 'text-emerald-700 bg-emerald-50 border-slate-100' 
                                                        : 'text-amber-700 bg-amber-50 border-slate-100'
                                                }`}>
                                                    {section.status}
                                                </span>
                                            </div>
                                            <p className="text-slate-500 font-medium truncate">Adviser: <span className="text-slate-700 font-semibold">{section.teacher}</span></p>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span>Total Enrolled:</span>
                                                <span className="font-bold text-slate-900">{section.totalLearners}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-slate-600">
                                                <span>SNED Profiles:</span>
                                                <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">{section.snedCount} active</span>
                                            </div>

                                            {/* Capacity visual load bar */}
                                            <div className="pt-1">
                                                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                                    <span>Class Capacity Load</span>
                                                    <span>{Math.round((section.totalLearners / 40) * 100)}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                                    <div className="bg-[#4B8B6B] h-full rounded-full" style={{ width: `${(section.totalLearners / 40) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}