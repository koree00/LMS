import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    assignedSection: string;
    status: string;
}

interface AdminUsersProps {
    notifications?: NotificationItem[];
    users?: UserItem[];
}

export default function AdminUsers({ notifications = [], users = [] }: AdminUsersProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    
    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    
    const [userToEdit, setUserToEdit] = useState<UserItem | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
    
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeRoleTab, setActiveRoleTab] = useState<string>('All');
    const notifRef = useRef<HTMLDivElement>(null);

    // Form state for add user modal
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState('Inclusive Teacher');
    const [selectedSections, setSelectedSections] = useState<string[]>(['Section 1', 'Section 2']);
    const [singleSection, setSingleSection] = useState('Section 1');

    // Form state for edit user modal
    const [editUserName, setEditUserName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserRole, setEditUserRole] = useState('');
    const [editUserSection, setEditUserSection] = useState('');

    // Local user roster state initialized strictly from props (empty by default)
    const [userList, setUserList] = useState<UserItem[]>(users);

    const allSections = ['Section 1', 'Section 2', 'Section 3', 'Section 4', 'Section 5', 'Section 6', 'Section 7', 'Section 8', 'Section 9'];
    const roleTabs = ['All', 'Inclusive Teacher', 'SNED Coordinator', 'Parent / Guardian', 'Student / Learner', 'School Principal / Admin'];

    const handleSectionToggle = (section: string) => {
        if (selectedSections.includes(section)) {
            if (selectedSections.length > 1) {
                setSelectedSections(selectedSections.filter(s => s !== section));
            }
        } else {
            setSelectedSections([...selectedSections, section]);
        }
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

    // Filter users based on search input query and active role tab
    const filteredUsers = userList.filter(u => {
        const matchesTab = activeRoleTab === 'All' || u.role === activeRoleTab;
        const matchesSearch = 
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.assignedSection.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const handleAddUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let sectionDisplay = '';
        if (newUserRole === 'SNED Coordinator' || newUserRole === 'School Principal / Admin') {
            sectionDisplay = 'School-wide';
        } else if (newUserRole === 'Inclusive Teacher') {
            sectionDisplay = `Grade 1 - ${selectedSections.join(', ')}`;
        } else {
            sectionDisplay = `Grade 1 - ${singleSection}`;
        }

        const newUser: UserItem = {
            id: Date.now(),
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            assignedSection: sectionDisplay,
            status: 'Active'
        };

        setUserList([newUser, ...userList]);
        setIsAddModalOpen(false);
        
        // Reset form
        setNewUserName('');
        setNewUserEmail('');
        setNewUserRole('Inclusive Teacher');
        setSelectedSections(['Section 1', 'Section 2']);
        setSingleSection('Section 1');
    };

    const openEditModal = (user: UserItem) => {
        setUserToEdit(user);
        setEditUserName(user.name);
        setEditUserEmail(user.email);
        setEditUserRole(user.role);
        setEditUserSection(user.assignedSection);
        setIsEditModalOpen(true);
    };

    const handleEditUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userToEdit) {
            setUserList(userList.map(u => u.id === userToEdit.id ? {
                ...u,
                name: editUserName,
                email: editUserEmail,
                role: editUserRole,
                assignedSection: editUserSection
            } : u));
            setIsEditModalOpen(false);
            setUserToEdit(null);
        }
    };

    const confirmDeleteUser = (user: UserItem) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const handleDeleteUser = () => {
        if (userToDelete) {
            setUserList(userList.filter(u => u.id !== userToDelete.id));
            setDeleteModalOpen(false);
            setUserToDelete(null);
        }
    };

    return (
        <>
            <Head title="User Management — Admin Portal · Elementary School" />
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
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">SM</div>
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
                                <Link href="/admin/users" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Management">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>User Management</span>}
                                </Link>
                                <Link href="/admin/school-report" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="School Reports">
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
                <main className={`flex-1 w-full min-w-0 py-6 px-3 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-6 transition-all duration-200 ml-0 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">User Management / Admin & Principal Portal</span>
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
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* Greeting Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">System User Management</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage pre-authorized accounts for activation by role.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-4 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer w-fit"
                        >
                            + Add New User
                        </button>
                    </div>

                    {/* Role Selection: Dropdown on Mobile (< 768px), Horizontal Tabs on Desktop (>= 768px) */}
                    <div className="w-full">
                        {/* Mobile Choose a Role Dropdown */}
                        <div className="block md:hidden w-full bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs space-y-1">
                            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Choose a Role</label>
                            <select
                                value={activeRoleTab}
                                onChange={(e) => setActiveRoleTab(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            >
                                {roleTabs.map(tab => (
                                    <option key={tab} value={tab}>{tab}</option>
                                ))}
                            </select>
                        </div>

                        {/* Desktop Horizontal Tabs */}
                        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto pb-1">
                            {roleTabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveRoleTab(tab)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                        activeRoleTab === tab 
                                            ? 'bg-[#4B8B6B] text-white shadow-xs' 
                                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar Container */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex items-center justify-between gap-4 w-full box-border">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${activeRoleTab === 'All' ? 'all users' : activeRoleTab.toLowerCase()}s by name or email...`} 
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-4 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                        />
                    </div>

                    {/* Active Directory Roster: Mobile Card Stack & Desktop Table */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 sm:p-6 space-y-4 shadow-sm w-full box-border overflow-hidden">
                        <h2 className="text-sm font-bold text-slate-900">Active Directory Roster ({activeRoleTab})</h2>
                        
                        {filteredUsers.length === 0 ? (
                            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                No users found in database. Click "+ Add New User" to authorize an account.
                            </div>
                        ) : (
                            <>
                                {/* Mobile Card View (< 768px): Fully responsive stacked card layout */}
                                <div className="space-y-3 md:hidden w-full">
                                    {filteredUsers.map(user => (
                                        <div key={user.id} className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 space-y-2.5 text-xs w-full box-border">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="font-bold text-slate-900 text-sm truncate">{user.name}</span>
                                                <span className="text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded-md border border-slate-100 shrink-0">{user.status}</span>
                                            </div>
                                            <div className="text-slate-500 font-mono text-[11px] break-all">{user.email}</div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px]">
                                                <div className="overflow-hidden">
                                                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-semibold">Role</span>
                                                    <span className="font-medium text-slate-700 truncate block">{user.role}</span>
                                                </div>
                                                <div className="overflow-hidden">
                                                    <span className="text-slate-400 block uppercase tracking-wider text-[9px] font-semibold">Assigned Section</span>
                                                    <span className="font-medium text-slate-700 truncate block">{user.assignedSection}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                                                <button 
                                                    onClick={() => openEditModal(user)}
                                                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-medium rounded-md transition-all cursor-pointer border border-slate-200 shadow-2xs"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => confirmDeleteUser(user)}
                                                    className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-slate-700 font-medium rounded-md transition-all cursor-pointer border border-slate-100 shadow-2xs"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View (>= 768px): Preserved exact styling */}
                                <div className="hidden md:block w-full overflow-x-auto">
                                    <table className="w-full min-w-[700px] text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Name</th>
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Email / Identifier</th>
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Role</th>
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Assigned Section</th>
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px]">Status</th>
                                                <th className="pb-3 px-3 uppercase tracking-wider text-[10px] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-3.5 px-3 font-bold text-slate-900 whitespace-nowrap">{user.name}</td>
                                                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">{user.email}</td>
                                                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{user.role}</td>
                                                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">{user.assignedSection}</td>
                                                    <td className="py-3.5 px-3 text-emerald-700 font-semibold whitespace-nowrap">{user.status}</td>
                                                    <td className="py-3.5 px-3 text-right space-x-2 whitespace-nowrap">
                                                        <button 
                                                            onClick={() => openEditModal(user)}
                                                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-all cursor-pointer border border-slate-200"
                                                            title="Edit User"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => confirmDeleteUser(user)}
                                                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-slate-700 font-medium rounded-md transition-all cursor-pointer border border-slate-100"
                                                            title="Delete User"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>

            {/* Add New User Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Authorize New Account for Activation</h3>
                            <button 
                                onClick={() => setIsAddModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder="e.g. Juan Dela Cruz" 
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Email / Account Identifier</label>
                                <input 
                                    type="email" 
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    placeholder="e.g. juan.delacruz@sanmateo-es.edu.ph" 
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                                <select 
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option>Inclusive Teacher</option>
                                    <option>SNED Coordinator</option>
                                    <option>Parent / Guardian</option>
                                    <option>Student / Learner</option>
                                    <option>School Principal / Admin</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block font-semibold text-slate-700">Assigned Sections / Scope (Grade 1)</label>
                                
                                {newUserRole === 'SNED Coordinator' || newUserRole === 'School Principal / Admin' ? (
                                    <input 
                                        type="text" 
                                        value="School-wide" 
                                        disabled 
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed font-medium" 
                                    />
                                ) : newUserRole === 'Inclusive Teacher' ? (
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 max-h-40 overflow-y-auto">
                                        <p className="text-[11px] text-slate-500 font-medium">Select all sections handled by this teacher:</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {allSections.map(sec => (
                                                <label key={sec} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedSections.includes(sec)}
                                                        onChange={() => handleSectionToggle(sec)}
                                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                                                    />
                                                    <span>{sec}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <select 
                                        value={singleSection}
                                        onChange={(e) => setSingleSection(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                                    >
                                        {allSections.map(sec => (
                                            <option key={sec} value={sec}>Grade 1 - {sec}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white rounded-lg font-medium cursor-pointer shadow-sm"
                                >
                                    Authorize Account
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {isEditModalOpen && userToEdit && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Edit User Account</h3>
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleEditUserSubmit} className="space-y-3 text-xs">
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                                <input 
                                    type="text" 
                                    value={editUserName}
                                    onChange={(e) => setEditUserName(e.target.value)}
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Email / Account Identifier</label>
                                <input 
                                    type="email" 
                                    value={editUserEmail}
                                    onChange={(e) => setEditUserEmail(e.target.value)}
                                    required 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400" 
                                />
                            </div>
                            <div>
                                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                                <select 
                                    value={editUserRole}
                                    onChange={(e) => setEditUserRole(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option>Inclusive Teacher</option>
                                    <option>SNED Coordinator</option>
                                    <option>Parent / Guardian</option>
                                    <option>Student / Learner</option>
                                    <option>School Principal / Admin</option>
                                </select>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block font-semibold text-slate-700 mb-1">Assigned Section / Scope</label>
                                
                                {editUserRole === 'SNED Coordinator' || editUserRole === 'School Principal / Admin' ? (
                                    <input 
                                        type="text" 
                                        value="School-wide" 
                                        disabled 
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed font-medium" 
                                    />
                                ) : editUserRole === 'Inclusive Teacher' ? (
                                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2 max-h-40 overflow-y-auto">
                                        <p className="text-[11px] text-slate-500 font-medium">Select all sections handled by this teacher:</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {allSections.map(sec => {
                                                const isChecked = editUserSection.includes(sec);
                                                return (
                                                    <label key={sec} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-xs">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={(e) => {
                                                                let currentSecs = editUserSection.replace('Grade 1 - ', '').split(', ').map(s => s.trim()).filter(Boolean);
                                                                if (e.target.checked) {
                                                                    if (!currentSecs.includes(sec)) currentSecs.push(sec);
                                                                } else {
                                                                    currentSecs = currentSecs.filter(s => s !== sec);
                                                                }
                                                                setEditUserSection(currentSecs.length > 0 ? `Grade 1 - ${currentSecs.join(', ')}` : 'Grade 1 - Section 1');
                                                            }}
                                                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-400"
                                                        />
                                                        <span>{sec}</span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <select 
                                        value={editUserSection.replace('Grade 1 - ', '')}
                                        onChange={(e) => setEditUserSection(`Grade 1 - ${e.target.value}`)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium text-xs"
                                    >
                                        {allSections.map(sec => (
                                            <option key={sec} value={sec}>Grade 1 - {sec}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white rounded-lg font-medium cursor-pointer shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-sm font-bold text-slate-900">Confirm User Deletion</h3>
                            <button 
                                onClick={() => setDeleteModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="space-y-2 text-xs text-slate-600">
                            <p>Are you sure you want to revoke and delete access for <strong className="text-slate-900">{userToDelete.name}</strong> ({userToDelete.email})?</p>
                            <p className="text-slate-600 font-medium">This action will immediately disable their account authorization and cannot be undone.</p>
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                            <button 
                                type="button" 
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-xs cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                type="button" 
                                onClick={handleDeleteUser}
                                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium text-xs cursor-pointer shadow-sm"
                            >
                                Yes, Delete User
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}