import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface AuditEvent {
    id: number;
    time: string;
    actor: string;
    roleGroup: 'Teachers' | 'Coordinators' | 'Parents' | 'Security';
    action: string;
    category: string;
}

interface ICTActivityLogProps {
    notifications?: NotificationItem[];
    auditEvents?: AuditEvent[];
}

export default function ICTActivityLog({ notifications = [], auditEvents }: ICTActivityLogProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('All');

    // Notification list state with persistent storage support
    const [notifList, setNotifList] = useState<NotificationItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('ict_notifications_dismissed');
            if (saved) {
                const dismissedIds: number[] = JSON.parse(saved);
                return notifications.filter(n => !dismissedIds.includes(n.id));
            }
        }
        return notifications.length > 0 ? notifications : [
            { id: 1, text: 'New account invite pending for Section 3 teacher', time: '10m ago', unread: true, link: '/it/accounts' },
            { id: 2, text: 'System backup completed successfully at 2:00 AM', time: '5h ago', unread: true, link: '/it/overview' }
        ];
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

    const unreadCount = notifList.length;

    const eventsList: AuditEvent[] = auditEvents && auditEvents.length > 0 ? auditEvents : [
        { id: 1, time: 'Today · 10:42', actor: 'Teacher Ana', roleGroup: 'Teachers', action: 'Approved lesson', category: 'Lesson workflow' },
        { id: 2, time: 'Today · 10:18', actor: 'Parent account', roleGroup: 'Parents', action: 'Viewed progress', category: 'Read-only access' },
        { id: 3, time: 'Today · 09:54', actor: 'ICT coordinator', roleGroup: 'Security', action: 'Updated role access', category: 'Security setting' },
        { id: 4, time: 'Yesterday · 15:22', actor: 'SNED coordinator', roleGroup: 'Coordinators', action: 'Validated lesson', category: 'Lesson workflow' },
        { id: 5, time: 'Yesterday · 14:05', actor: 'Teacher Bea', roleGroup: 'Teachers', action: 'Added observation', category: 'Student record' },
        { id: 6, time: 'Yesterday · 11:30', actor: 'Principal Raos', roleGroup: 'Coordinators', action: 'Downloaded school report', category: 'Administrative Oversight' },
    ];

    const filteredEvents = eventsList.filter(ev => {
        const matchesSearch = 
            ev.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ev.category.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesRole = selectedRoleFilter === 'All' || ev.roleGroup === selectedRoleFilter;

        return matchesSearch && matchesRole;
    });

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

    // Minimal, professional pastel color styling for roles (no neon)
    const getRoleBadgeStyle = (role: string) => {
        switch (role) {
            case 'Teachers':
                return 'bg-emerald-50 text-slate-800 border-slate-200/60';
            case 'Coordinators':
                return 'bg-sky-50 text-slate-800 border-slate-200/60';
            case 'Parents':
                return 'bg-amber-50 text-slate-800 border-slate-200/60';
            case 'Security':
                return 'bg-rose-50 text-slate-800 border-slate-200/60';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    return (
        <>
            <Head title="Activity Log — ICT Portal · San Mateo Elementary School" />
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
                                <Link href="/it/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
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
                                <Link href="/it/activity-log" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Activity log">
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
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Header Bar with Notification Bell Dropdown (Search Bar Removed Here) */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Activity log / ICT</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Notification Dropdown Feature */}
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
                                                <button onClick={() => setNotifList([])} className="text-[11px] text-emerald-700 hover:underline cursor-pointer">Clear all</button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {notifList.length > 0 ? (
                                                notifList.map(n => (
                                                    <div 
                                                        key={n.id} 
                                                        onClick={() => handleNotificationClick(n)}
                                                        className="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-2.5"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
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
                                IC
                            </div>
                        </div>
                    </div>

                    {/* Integrated Text Card Container for Audit Log Title, Search Bar & Role Filter */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-4 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">Audit log</h1>
                                <p className="text-[11px] text-slate-500 mt-0.5">Track system-wide actor actions, category records, and role events.</p>
                            </div>

                            {/* Toolbar: Search Bar and Role Filter Dropdown */}
                            <div className="flex items-center flex-wrap gap-2.5 text-xs">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search actor or action..." 
                                        className="w-48 sm:w-56 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    />
                                </div>

                                <div className="relative shrink-0">
                                    <select
                                        value={selectedRoleFilter}
                                        onChange={(e) => setSelectedRoleFilter(e.target.value)}
                                        className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer pr-9"
                                    >
                                        <option value="All">Filter by Role: All Roles</option>
                                        <option value="Teachers">Teachers</option>
                                        <option value="Coordinators">Coordinators</option>
                                        <option value="Parents">Parents</option>
                                        <option value="Security">Security</option>
                                    </select>
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Events List inside the Section */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    {selectedRoleFilter === 'All' ? 'Recent events (All Roles)' : `${selectedRoleFilter} Activity`}
                                </h2>
                                <span className="text-[11px] text-slate-400 font-medium">{filteredEvents.length} events found</span>
                            </div>

                            <div className="space-y-2.5">
                                {filteredEvents.length === 0 ? (
                                    <div className="py-10 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl space-y-1">
                                        <p className="font-semibold text-slate-600">No activity logs found</p>
                                        <p>Try changing your role filter or clearing your search query.</p>
                                    </div>
                                ) : (
                                    filteredEvents.map((ev) => (
                                        <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-slate-200/80 rounded-xl text-xs gap-3 shadow-2xs hover:border-slate-300 transition-all">
                                            
                                            {/* Actor Column with Subtle Pastel Role Badge (No Icons) */}
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 leading-tight">{ev.actor}</span>
                                                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium border w-fit ${getRoleBadgeStyle(ev.roleGroup)}`}>
                                                        {ev.roleGroup}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Column */}
                                            <div className="text-slate-700 font-medium sm:px-4 flex-1 truncate">
                                                {ev.action}
                                            </div>

                                            {/* Time & Category Badge */}
                                            <div className="flex items-center gap-3 justify-between sm:justify-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                                                <span className="text-slate-400 font-medium text-[11px]">{ev.time}</span>
                                                <span className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {ev.category}
                                                </span>
                                            </div>

                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}