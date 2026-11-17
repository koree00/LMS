import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface UserAccount {
    id: number;
    email: string;
    role: string;
    accessScope: string;
    status: 'Active' | 'Pending' | 'Suspended';
}

interface ICTInviteUserProps {
    notifications?: NotificationItem[];
    users?: UserAccount[];
}

export default function ICTInviteUser({ notifications = [], users = [] }: ICTInviteUserProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Sensory-friendly toast feedback banner state
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);

    // Mock initial user list if none passed from backend
    const [accountList, setAccountList] = useState<UserAccount[]>(users.length > 0 ? users : [
        { id: 1, email: 'mara.sas@school.gmail.com', role: 'Inclusive teacher', accessScope: 'Section 1, Section 2', status: 'Active' },
        { id: 2, email: 'juan.dacuraz@school.gmail.com', role: 'Student (Grade 1 / SNED)', accessScope: 'Section 1', status: 'Active' },
        { id: 3, email: 'etel.ryes@school.gmail.com', role: 'SNED coordinator', accessScope: 'School-Wide Validation', status: 'Active' },
        { id: 4, email: 'cherry.tiong@school.gmail.com', role: 'Principal', accessScope: 'Full Oversight', status: 'Active' },
        { id: 5, email: 're.ryes@gmail.com', role: 'Parent / guardian', accessScope: 'Section 1 (Child Progress)', status: 'Pending' },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // Edit Modal State
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [editRole, setEditRole] = useState('');
    const [editAccessScope, setEditAccessScope] = useState<string[] | string>([]);

    // Revoke Modal State
    const [revokingUser, setRevokingUser] = useState<UserAccount | null>(null);

    // Inertia form state for inviting
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        role: 'Inclusive teacher',
        access_scope: ['Section 1'] as string[] | string,
    });

    const triggerToast = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 4000);
    };

    const handleRoleChange = (newRole: string) => {
        setData('role', newRole);
        if (newRole === 'Inclusive teacher') {
            setData('access_scope', ['Section 1']);
        } else if (newRole === 'Student (Grade 1 / SNED)') {
            setData('access_scope', 'Section 1');
        } else if (newRole === 'SNED coordinator') {
            setData('access_scope', 'School-Wide Validation & IEP Tracking');
        } else if (newRole === 'Principal') {
            setData('access_scope', 'Full School Reporting & Oversight');
        } else if (newRole === 'Parent / guardian') {
            setData('access_scope', 'Approved Child Progress Only');
        }
    };

    const handleSectionToggle = (section: string) => {
        const currentSections = Array.isArray(data.access_scope) ? data.access_scope : [];
        if (currentSections.includes(section)) {
            if (currentSections.length > 1) {
                setData('access_scope', currentSections.filter(s => s !== section));
            }
        } else {
            setData('access_scope', [...currentSections, section]);
        }
    };

    const handleSubmitInvite = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...data,
            access_scope: Array.isArray(data.access_scope)
                ? data.access_scope.join(', ')
                : data.access_scope,
        };

        router.post('/it/accounts', payload, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setIsInviteModalOpen(false);
                triggerToast('Invitation sent successfully.');
            },
        });
    };

    const handleOpenEdit = (user: UserAccount) => {
        setEditingUser(user);
        setEditRole(user.role);
        if (user.accessScope.includes('Section')) {
            setEditAccessScope(user.accessScope.split(', ').map(s => s.trim()));
        } else {
            setEditAccessScope(user.accessScope);
        }
    };

    const handleEditRoleChange = (newRole: string) => {
        setEditRole(newRole);
        if (newRole === 'Inclusive teacher') {
            setEditAccessScope(['Section 1']);
        } else if (newRole === 'Student (Grade 1 / SNED)') {
            setEditAccessScope('Section 1');
        } else if (newRole === 'SNED coordinator') {
            setEditAccessScope('School-Wide Validation & IEP Tracking');
        } else if (newRole === 'Principal') {
            setEditAccessScope('Full School Reporting & Oversight');
        } else if (newRole === 'Parent / guardian') {
            setEditAccessScope('Approved Child Progress Only');
        }
    };

    const handleEditSectionToggle = (section: string) => {
        const current = Array.isArray(editAccessScope) ? editAccessScope : [];
        if (current.includes(section)) {
            if (current.length > 1) {
                setEditAccessScope(current.filter(s => s !== section));
            }
        } else {
            setEditAccessScope([...current, section]);
        }
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        const finalScope = Array.isArray(editAccessScope) 
            ? editAccessScope.join(', ') 
            : editAccessScope;

        setAccountList(accountList.map(u => u.id === editingUser.id ? { ...u, role: editRole, accessScope: finalScope } : u));
        setEditingUser(null);
        triggerToast(`Access scope updated successfully for ${editingUser.email}`);
    };

    const handleConfirmRevoke = () => {
        if (!revokingUser) return;
        setAccountList(accountList.filter(u => u.id !== revokingUser.id));
        const email = revokingUser.email;
        setRevokingUser(null);
        triggerToast(`Access successfully revoked for ${email}`);
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

    const filteredUsers = accountList.filter(u => {
        const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const sectionsList = [
        'Section 1', 'Section 2', 'Section 3', 
        'Section 4', 'Section 5', 'Section 6', 
        'Section 7', 'Section 8', 'Section 9'
    ];

    return (
        <>
            <Head title="User Management & Invitations — ICT Portal · San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {/* Sensory-Friendly Success Toast Banner */}
                {successMessage && (
                    <div className="fixed top-5 right-5 z-50 bg-emerald-50 text-slate-900 px-4 py-3 rounded-xl shadow-md flex items-center gap-2.5 text-xs border border-slate-200 transition-all duration-300">
                        <svg className="w-4 h-4 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        <span>{successMessage}</span>
                    </div>
                )}

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
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">EQ</div>
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
                                <Link href="/it/accounts" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-800 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Accounts">
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
                        <Link href="/login" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50/50 text-slate-700 font-medium text-xs border border-transparent hover:border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Sign out">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Accounts / User Management & Directory</span>
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
                                                <button onClick={() => setNotifList([])} className="text-[11px] text-slate-700 hover:underline cursor-pointer">Clear all</button>
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

                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                IC
                            </div>
                        </div>
                    </div>

                    {/* User Management Directory Card (Now at Top with Search and Invite Button) */}
                    <div id="user-directory-section" className="bg-white rounded-xl border border-slate-200/70 p-4 sm:p-8 space-y-6 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">User Management Directory</h2>
                                <p className="text-[11px] text-slate-500 mt-0.5">Manage active roles, edit multi-section access scopes, or revoke user privileges.</p>
                            </div>
                            
                            <div className="flex items-center flex-wrap gap-2.5 text-xs">
                                <input 
                                    type="text" 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search users..." 
                                    className="w-44 sm:w-52 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                />
                                <select 
                                    value={roleFilter}
                                    onChange={e => setRoleFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="Inclusive teacher">Inclusive teacher</option>
                                    <option value="Student (Grade 1 / SNED)">Student</option>
                                    <option value="SNED coordinator">SNED Coordinator</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Parent / guardian">Parent</option>
                                </select>
                                <button 
                                    onClick={() => setIsInviteModalOpen(true)}
                                    className="px-3.5 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-lg text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                    Invite new user
                                </button>
                            </div>
                        </div>

                        {/* DESKTOP TABLE VIEW */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">User / Email</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">Access Scope / Sections</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(u => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-all">
                                                <td className="py-3.5 px-4 font-medium text-slate-900">{u.email}</td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium ${
                                                        u.role === 'Inclusive teacher' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        u.role.includes('Student') ? 'bg-slate-50 text-slate-800 border border-slate-100' :
                                                        u.role === 'SNED coordinator' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        u.role === 'Principal' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        'bg-slate-100 text-slate-700 border border-slate-200'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-600 font-normal">{u.accessScope}</td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                                                        u.status === 'Active' ? 'bg-transparent-100 border-slate-800 text-slate-800' : 'bg-transparent-100 text-slate-800'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                                        {u.status}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right space-x-3">
                                                    <button 
                                                        onClick={() => handleOpenEdit(u)} 
                                                        className="text-slate-700 hover:text-slate-900 font-semibold cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-6 text-center text-slate-400">No user accounts found matching your filter.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* MOBILE CARD VIEW */}
                        <div className="grid grid-cols-1 gap-3 md:hidden">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <div key={u.id} className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 text-xs break-all leading-snug">{u.email}</p>
                                                <div className="mt-1.5">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${
                                                        u.role === 'Inclusive teacher' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        u.role.includes('Student') ? 'bg-slate-50 text-slate-800 border border-slate-100' :
                                                        u.role === 'SNED coordinator' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        u.role === 'Principal' ? 'bg-slate-50 text-slate-700 border border-slate-100' :
                                                        'bg-slate-100 text-slate-800 border border-slate-200'
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                                                u.status === 'Active' ? 'bg-emerald-100 text-slate-800 border-slate-200' : 'bg-amber-100 text-slate-800 border-slate-200'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'Active' ? 'bg-emerald-600' : 'bg-amber-600'}`}></span>
                                                {u.status}
                                            </span>
                                        </div>

                                        <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                            <span className="text-slate-500 font-medium">Access Scope:</span>
                                            <span className="text-slate-800 font-semibold text-right">{u.accessScope}</span>
                                        </div>

                                        <div className="flex items-center justify-end gap-2.5 pt-2.5 border-t border-slate-200/60 text-xs">
                                            <button 
                                                onClick={() => handleOpenEdit(u)} 
                                                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-slate-800 border border-slate-200 font-semibold transition-all cursor-pointer"
                                            >
                                                Edit Access
                                            </button>
                                            <button 
                                                onClick={() => setRevokingUser(u)} 
                                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-slate-700 border border-slate-200 font-semibold transition-all cursor-pointer"
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-400 text-xs">No user accounts found matching your filter.</div>
                            )}
                        </div>
                    </div>

                </main>
            </div>

            {/* INVITE USER MODAL */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Invite a user or learner</h3>
                                <p className="text-[11px] text-slate-500">Assign an appropriate role and configure multi-section access scope.</p>
                            </div>
                            <button 
                                onClick={() => setIsInviteModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmitInvite} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="modal-email-input">School email or account username</label>
                                <input 
                                    id="modal-email-input"
                                    type="text" 
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="name@gmail.com" 
                                    required
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-sans"
                                />
                                {errors.email && <p className="text-[10px] text-rose-500 mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="modal-role-select">Role</label>
                                <div className="relative">
                                    <select 
                                        id="modal-role-select"
                                        value={data.role}
                                        onChange={e => handleRoleChange(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
                                    >
                                        <option value="Inclusive teacher">Inclusive teacher</option>
                                        <option value="Student (Grade 1 / SNED)">Student (Grade 1 / SNED)</option>
                                        <option value="SNED coordinator">SNED coordinator</option>
                                        <option value="Principal">Principal</option>
                                        <option value="Parent / guardian">Parent / guardian</option>
                                    </select>
                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                                {errors.role && <p className="text-[10px] text-rose-500 mt-1">{errors.role}</p>}
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">
                                    {data.role === 'Inclusive teacher' ? 'Assigned Sections (Select multiple if handling several sections)' : 'Access scope'}
                                </label>

                                {data.role === 'Inclusive teacher' && (
                                    <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                                        <span className="text-[11px] text-slate-500 block font-medium">Check all class sections handled by this teacher:</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {sectionsList.map((sec) => {
                                                const isSelected = Array.isArray(data.access_scope) && data.access_scope.includes(sec);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={sec}
                                                        onClick={() => handleSectionToggle(sec)}
                                                        className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                                            isSelected 
                                                                ? 'bg-emerald-50 border-slate-300 text-slate-900 shadow-2xs' 
                                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <span>{sec}</span>
                                                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center text-[8px] ${isSelected ? 'bg-emerald-600 border-slate-600 text-white' : 'border-slate-300'}`}>
                                                            {isSelected ? '✓' : ''}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {data.role === 'Student (Grade 1 / SNED)' && (
                                    <div className="relative">
                                        <select 
                                            value={typeof data.access_scope === 'string' ? data.access_scope : 'Section 1'}
                                            onChange={e => setData('access_scope', e.target.value)}
                                            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none cursor-pointer"
                                        >
                                            {sectionsList.map(sec => (
                                                <option key={sec} value={sec}>{sec} · Grade 1 SNED</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                )}

                                {['SNED coordinator', 'Principal', 'Parent / guardian'].includes(data.role) && (
                                    <input 
                                        type="text"
                                        disabled
                                        value={
                                            data.role === 'SNED coordinator' ? 'School-Wide Validation & IEP Tracking (All Sections 1–9)' :
                                            data.role === 'Principal' ? 'Full School Reporting & Administrative Oversight' :
                                            'Approved Child Progress & Home-Reinforcement Only'
                                        }
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-600 font-medium cursor-not-allowed"
                                    />
                                )}

                                {errors.access_scope && <p className="text-[10px] text-rose-500 mt-1">{errors.access_scope}</p>}
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all cursor-pointer shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Sending...' : 'Send invitation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* EDIT ACCESS MODAL WITH CHECKLIST */}
            {editingUser && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg p-6 space-y-5">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Edit User Access</h3>
                                <p className="text-[11px] text-slate-500 truncate">{editingUser.email}</p>
                            </div>
                            <button 
                                onClick={() => setEditingUser(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">Role</label>
                                <select 
                                    value={editRole}
                                    onChange={e => handleEditRoleChange(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                >
                                    <option value="Inclusive teacher">Inclusive teacher</option>
                                    <option value="Student (Grade 1 / SNED)">Student (Grade 1 / SNED)</option>
                                    <option value="SNED coordinator">SNED coordinator</option>
                                    <option value="Principal">Principal</option>
                                    <option value="Parent / guardian">Parent / guardian</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-700 mb-1.5">
                                    {editRole === 'Inclusive teacher' ? 'Assigned Sections (Select multiple)' : 'Access Scope / Sections'}
                                </label>

                                {editRole === 'Inclusive teacher' ? (
                                    <div className="p-3.5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                                        <span className="text-[11px] text-slate-500 block font-medium">Check all class sections handled by this teacher:</span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {sectionsList.map((sec) => {
                                                const isSelected = Array.isArray(editAccessScope) && editAccessScope.includes(sec);
                                                return (
                                                    <button
                                                        type="button"
                                                        key={sec}
                                                        onClick={() => handleEditSectionToggle(sec)}
                                                        className={`py-1.5 px-2.5 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                                            isSelected 
                                                                ? 'bg-emerald-50 border-slate-300 text-slate-900 shadow-2xs' 
                                                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                                        }`}
                                                    >
                                                        <span>{sec}</span>
                                                        <span className={`w-3 h-3 rounded-full border flex items-center justify-center text-[8px] ${isSelected ? 'bg-emerald-600 border-slate-600 text-white' : 'border-slate-300'}`}>
                                                            {isSelected ? '✓' : ''}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : editRole === 'Student (Grade 1 / SNED)' ? (
                                    <select 
                                        value={typeof editAccessScope === 'string' ? editAccessScope : 'Section 1'}
                                        onChange={e => setEditAccessScope(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                    >
                                        {sectionsList.map(sec => (
                                            <option key={sec} value={sec}>{sec} · Grade 1 SNED</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input 
                                        type="text"
                                        disabled
                                        value={
                                            editRole === 'SNED coordinator' ? 'School-Wide Validation & IEP Tracking (All Sections 1–9)' :
                                            editRole === 'Principal' ? 'Full School Reporting & Administrative Oversight' :
                                            'Approved Child Progress & Home-Reinforcement Only'
                                        }
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-600 font-medium cursor-not-allowed"
                                    />
                                )}
                            </div>

                            <div className="pt-4 flex items-center justify-between w-full border-t border-slate-100">
    <button
        type="button"
        onClick={() => {
            const userToRevoke = editingUser;
            setEditingUser(null);
            setRevokingUser(userToRevoke);
        }}
        className="px-4 py-2 text-rose-600 border border-rose-200 hover:bg-rose-50 font-medium rounded-xl transition-all cursor-pointer text-xs"
    >
        Revoke access
    </button>

    <div className="flex items-center gap-2">
        <button
            type="button"
            onClick={() => setEditingUser(null)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer text-xs"
        >
            Cancel
        </button>
        <button
            type="submit"
            className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all cursor-pointer shadow-sm text-xs"
        >
            Save changes
        </button>
    </div>
</div>
                        </form>
                    </div>
                </div>
            )}

            {/* REVOKE ACCESS CONFIRMATION MODAL */}
            {revokingUser && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm p-6 space-y-4 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-bold text-slate-900">Revoke User Access</h3>
                            <button 
                                onClick={() => setRevokingUser(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <p className="text-slate-600 leading-relaxed pt-1">
                            Are you sure you want to revoke access and delete account for <strong className="text-slate-900 font-semibold break-all">{revokingUser.email}</strong>?
                        </p>
                        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setRevokingUser(null)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRevoke}
                                className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-slate-800 border border-slate-100 font-semibold rounded-xl transition-all cursor-pointer shadow-2xs"
                            >
                                Yes, revoke access
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}