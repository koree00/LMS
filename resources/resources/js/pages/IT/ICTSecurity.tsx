import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ICTSecurityProps {
    notifications?: NotificationItem[];
    securitySettings?: {
        multiFactor: boolean;
        sessionTimeout: string;
        studentProfileAccess: boolean;
        parentView: boolean;
        auditRetention: string;
    };
}

export default function ICTSecurity({ notifications = [], securitySettings }: ICTSecurityProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Inertia form state for security settings
    const { data, setData, post, processing } = useForm({
        multiFactor: securitySettings?.multiFactor ?? true,
        sessionTimeout: securitySettings?.sessionTimeout ?? '30 min',
        studentProfileAccess: securitySettings?.studentProfileAccess ?? true,
        parentView: securitySettings?.parentView ?? true,
        auditRetention: securitySettings?.auditRetention ?? '12 mo',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/it/security', {
            preserveScroll: true,
            onSuccess: () => {
                alert('Security settings updated successfully.');
            },
        });
    };

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
        return notifications.length > 0 ? notifications : [
            { id: 1, text: 'New account invite pending for Section 3 teacher', time: '10m ago', unread: true, link: '/it/accounts' },
            { id: 2, text: 'System security audit log updated', time: '2h ago', unread: true, link: '/it/security' }
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

    // Helper to check if search query matches safeguard items
    const matchesSearch = (title: string, desc: string) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    };

    const showMultiFactor = matchesSearch('Multi-factor sign-in', 'Required for staff accounts');
    const showSessionTimeout = matchesSearch('Session timeout', 'Minutes of inactivity');
    const showStudentProfile = matchesSearch('Student profile access', 'Authorized staff roles only');
    const showParentView = matchesSearch('Parent view', 'Approved progress only');
    const showAuditRetention = matchesSearch('Audit retention', 'Keep records for specified duration');

    const anySafeguardVisible = showMultiFactor || showSessionTimeout || showStudentProfile || showParentView || showAuditRetention;

    return (
        <>
            <Head title="Security Settings — ICT Portal · San Mateo Elementary School" />
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
                                <Link href="/it/security" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-black-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Security">
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
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar with Search Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Security / ICT</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Search Input Bar */}
                            <div className="relative hidden sm:block">
                                
                            </div>

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
                                                <button onClick={() => setNotifList([])} className="text-[11px] text-black-700 hover:underline cursor-pointer">Clear all</button>
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

                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-black-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                IC
                            </div>
                        </div>
                    </div>

                    {/* Integrated Text Card Container for Security Settings Header */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                        <div className="space-y-1.5 border-b border-slate-100 pb-4">
                            <h1 className="text-xl font-bold text-slate-900 leading-none">Security settings</h1>
                            <p className="text-xs text-slate-500 leading-relaxed">Manage sign-in safeguards and role-based access.</p>
                        </div>

                        <div>
                            <h2 className="text-sm font-bold text-slate-900">Access safeguards</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
                            
                            {!anySafeguardVisible && (
                                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                    No security safeguards found matching "{searchQuery}".
                                </div>
                            )}

                            {/* Multi-factor sign-in */}
                            {showMultiFactor && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div className="space-y-0.5 pr-4">
                                        <span className="font-bold text-slate-900 block text-xs">Multi-factor sign-in</span>
                                        <span className="text-[11px] text-slate-500 block">Required for staff accounts</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('multiFactor', !data.multiFactor)}
                                        className={`px-4 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer border ${
                                            data.multiFactor
                                                ? 'bg-emerald-100 text-black-800 border-slate-200 shadow-2xs'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {data.multiFactor ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            )}

                            {/* Session timeout */}
                            {showSessionTimeout && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div className="space-y-0.5 pr-4">
                                        <span className="font-bold text-slate-900 block text-xs">Session timeout</span>
                                        <span className="text-[11px] text-slate-500 block">Minutes of inactivity</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={data.sessionTimeout}
                                            onChange={e => setData('sessionTimeout', e.target.value)}
                                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer pr-8 shadow-2xs"
                                        >
                                            <option value="15 min">15 min</option>
                                            <option value="30 min">30 min</option>
                                            <option value="60 min">60 min</option>
                                            <option value="120 min">120 min</option>
                                        </select>
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Student profile access */}
                            {showStudentProfile && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div className="space-y-0.5 pr-4">
                                        <span className="font-bold text-slate-900 block text-xs">Student profile access</span>
                                        <span className="text-[11px] text-slate-500 block">Authorized staff roles only</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('studentProfileAccess', !data.studentProfileAccess)}
                                        className={`px-4 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer border ${
                                            data.studentProfileAccess
                                                ? 'bg-emerald-100 text-black-800 border-slate-200 shadow-2xs'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {data.studentProfileAccess ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            )}

                            {/* Parent view */}
                            {showParentView && (
                                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                                    <div className="space-y-0.5 pr-4">
                                        <span className="font-bold text-slate-900 block text-xs">Parent view</span>
                                        <span className="text-[11px] text-slate-500 block">Approved progress only</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setData('parentView', !data.parentView)}
                                        className={`px-4 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer border ${
                                            data.parentView
                                                ? 'bg-emerald-100 text-black-800 border-slate-200 shadow-2xs'
                                                : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}
                                    >
                                        {data.parentView ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            )}

                            {/* Audit retention */}
                            {showAuditRetention && (
                                <div className="flex items-center justify-between py-3">
                                    <div className="space-y-0.5 pr-4">
                                        <span className="font-bold text-slate-900 block text-xs">Audit retention</span>
                                        <span className="text-[11px] text-slate-500 block">Keep records for specified duration</span>
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={data.auditRetention}
                                            onChange={e => setData('auditRetention', e.target.value)}
                                            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-slate-800 font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer pr-8 shadow-2xs"
                                        >
                                            <option value="6 mo">6 mo</option>
                                            <option value="12 mo">12 mo</option>
                                            <option value="24 mo">24 mo</option>
                                            <option value="Permanent">Permanent</option>
                                        </select>
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center cursor-pointer disabled:opacity-50 text-xs"
                                >
                                    {processing ? 'Saving...' : 'Save security settings'}
                                </button>
                            </div>

                        </form>
                    </div>

                </main>
            </div>
        </>
    );
}