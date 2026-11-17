import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface RoleAccountStat {
    role: string;
    accounts: number;
    accessScope: string;
}

interface IctOverviewProps {
    notifications?: NotificationItem[];
    stats: {
        serviceHealth: string;
        activeAccounts: number;
        pendingInvites: number;
        accessAlerts: number;
        lastBackupTime: string;
    };
    roleStats: RoleAccountStat[];
}

export default function IctOverview({ 
    notifications = [], 
    stats,
    roleStats = []
}: IctOverviewProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
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
            const saved = localStorage.getItem('ict_notifications_dismissed');
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
            const currentDismissed = JSON.parse(localStorage.getItem('ict_notifications_dismissed') || '[]');
            localStorage.setItem('ict_notifications_dismissed', JSON.stringify([...currentDismissed, notification.id]));
        }

        setNotifOpen(false);
        router.visit(notification.link);
    };

    const markAllAsRead = () => {
        setNotifList([]);
        if (typeof window !== 'undefined') {
            const allIds = notifications.map(n => n.id);
            localStorage.setItem('ict_notifications_dismissed', JSON.stringify(allIds));
        }
    };

    const unreadCount = notifList.length;

    const filteredRoles = roleStats.filter(r => 
        r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.accessScope.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Accounts and system health — ICT & Infrastructure Portal · San Mateo Elementary School" />
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
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">EQ</div>
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
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">ICT</div>}
                            <nav className="space-y-1">
                                <Link href="/it/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/it/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                                                    {sidebarOpen && <span>Messages</span>}
                                                                </Link>
                                <Link href="/it/accounts" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Accounts">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>User Management</span>}
                                </Link>
                                
                                <Link href="/it/security" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Security">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                                    {sidebarOpen && <span>Security</span>}
                                </Link>
                                <Link href="/it/activity-log" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Activity log">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                    {sidebarOpen && <span>Activity log</span>}
                                </Link>
                                
                                <Link href="/it/account-settings" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Account">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">Overview / ICT</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Search Input */}
                            <div className="relative hidden sm:block">
                               
                            </div>

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

                            {/* ICT Coordinator Avatar Badge */}
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                IC
                            </div>
                        </div>
                    </div>

                    {/* Combined Header & 4 Stat Metrics Card */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                        <div className="space-y-1">
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Accounts and system health</h1>
                            <p className="text-xs sm:text-sm text-slate-500">Manage user access, protect student data, and review recent administrative activity.</p>
                        </div>

                        {/* 4 Stat Cards Grid Inside the Header Container */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                            {/* Card 1: Service Health */}
                            <div className="bg-[#E6F4EA] p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-600">Service health</span>
                                <div className="text-2xl font-bold text-slate-900">{stats?.serviceHealth ?? '—'}</div>
                                <span className="text-[11px] text-slate-500 block pt-1">System operational status</span>
                            </div>

                            {/* Card 2: Active Accounts */}
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Active accounts</span>
                                <div className="text-2xl font-bold text-slate-900">{stats?.activeAccounts ?? 0}</div>
                                <span className="text-[11px] text-slate-400 block pt-1">{stats?.pendingInvites ?? 0} staff invites pending</span>
                            </div>

                            {/* Card 3: Access Alerts */}
                            <div className="bg-[#FEF7E0] p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-600">Access alerts</span>
                                <div className="text-2xl font-bold text-slate-900">{stats?.accessAlerts ?? 0}</div>
                                <span className="text-[11px] text-slate-500 block pt-1">Review required</span>
                            </div>

                            {/* Card 4: Last Backup */}
                            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-xs font-medium text-slate-500">Last backup</span>
                                <div className="text-2xl font-bold text-slate-900">Status</div>
                                <span className="text-[11px] text-slate-400 block pt-1">{stats?.lastBackupTime ?? 'No recent backup recorded'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Lower Grid: Accounts by Role (Left) & Security Checklist (Right) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        
                        {/* Accounts by Role Table Card */}
                        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/70 p-6 space-y-4 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">Accounts by role</h2>

                            {/* Table Header */}
                            <div className="grid grid-cols-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 px-2">
                                <span>Role</span>
                                <span>Accounts</span>
                                <span>Access scope</span>
                            </div>

                            {/* Table Rows */}
                            <div className="space-y-2.5">
                                {filteredRoles.length === 0 ? (
                                    <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        No role accounts found in the database.
                                    </div>
                                ) : (
                                    filteredRoles.map((roleItem, index) => (
                                        <div key={index} className="grid grid-cols-3 items-center p-3 bg-white border border-slate-200/70 hover:border-slate-300 rounded-xl transition-all text-xs font-medium text-slate-800 shadow-2xs">
                                            <span className="font-semibold text-slate-900">{roleItem.role}</span>
                                            <span className="text-slate-700">{roleItem.accounts}</span>
                                            <span className="text-slate-500">{roleItem.accessScope}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Security Checklist Card */}
                        <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900">Security checklist</h2>

                            <div className="space-y-4 text-xs">
                                <div className="space-y-1 pb-3 border-b border-slate-100">
                                    <span className="font-bold text-slate-900 block">Role boundaries</span>
                                    <span className="text-emerald-700 font-semibold block">Active</span>
                                </div>
                                <div className="space-y-1 pb-3 border-b border-slate-100">
                                    <span className="font-bold text-slate-900 block">Encrypted storage</span>
                                    <span className="text-emerald-700 font-semibold block">Enabled</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="font-bold text-slate-900 block">Staff invites</span>
                                    <span className="text-emerald-700 font-semibold block">{stats?.pendingInvites ?? 0} pending</span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link 
                                    href="/it/activity-log"
                                    className="w-full py-2.5 px-4 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-lg transition-all shadow-sm flex items-center justify-center text-xs cursor-pointer"
                                >
                                    Open audit log
                                </Link>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}