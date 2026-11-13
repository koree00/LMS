import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ICTAccountSettingsProps {
    notifications?: NotificationItem[];
    user?: {
        name: string;
        email: string;
        role: string;
        department: string;
        avatar?: string;
    };
}

export default function ICTAccountSettings({ notifications = [], user }: ICTAccountSettingsProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Edit mode states for standard form behavior
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);

    // Password visibility toggle states
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // Avatar display state
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Inertia form for personal profile updates (including avatar file)
    const profileForm = useForm({
        name: user?.name ?? 'ICT Administrator',
        email: user?.email ?? 'it.lead@school.edu.ph',
        department: user?.department ?? 'ICT Infrastructure & Operations',
        avatar: null as File | null,
    });

    // Inertia form for password updates
    const passwordForm = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            profileForm.setData('avatar', file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleAvatarDelete = () => {
        profileForm.setData('avatar', null);
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.post('/it/account/profile', {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                setIsEditingProfile(false);
                alert('Personal profile and avatar updated successfully.');
            },
        });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        passwordForm.put('/it/account/password', {
            preserveScroll: true,
            onSuccess: () => {
                passwordForm.reset();
                setIsEditingPassword(false);
                alert('Password changed successfully.');
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

    const matchesSearch = (title: string, desc: string) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    };

    const showProfileCard = matchesSearch('Profile Information', 'Update your account profile details and email.');
    const showPasswordCard = matchesSearch('Update Password', 'Ensure your account is using a long, random password.');

    return (
        <>
            <Head title="My Account Settings — ICT Portal · San Mateo Elementary School" />
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
                                <Link href="/it/account" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Account">
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
                    
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Settings / My Account</span>
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

                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>IC</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Form Card */}
                    {showProfileCard && (
                        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                            
                            {/* Header Section with Edit Toggle */}
                            <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-xl bg-emerald-100 text-slate-800 border border-slate-200/80 flex items-center justify-center font-bold text-sm overflow-hidden shadow-xs shrink-0">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>IC</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h2 className="text-sm font-bold text-slate-900 leading-snug">Profile Information</h2>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Update your account profile details and email address.</p>
                                    </div>
                                </div>

                                {!isEditingProfile && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(true)}
                                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shrink-0 shadow-2xs"
                                    >
                                        Edit profile
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                                
                                {isEditingProfile && (
                                    <div className="flex items-center gap-2 text-xs pb-2">
                                        <input 
                                            type="file" 
                                            ref={fileInputRef}
                                            onChange={handleAvatarChange}
                                            accept="image/*"
                                            className="hidden"
                                            id="avatar-upload-input"
                                        />
                                        <label 
                                            htmlFor="avatar-upload-input"
                                            className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline"
                                        >
                                            Change picture
                                        </label>
                                        {avatarPreview && (
                                            <>
                                                <span className="text-slate-300">·</span>
                                                <button 
                                                    type="button"
                                                    onClick={handleAvatarDelete}
                                                    className="text-rose-600 hover:text-rose-800 font-semibold cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </>
                                        )}
                                        <span className="text-slate-300">·</span>
                                        <span className="text-[11px] text-slate-400">PNG, JPG up to 2MB</span>
                                    </div>
                                )}

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">Full Name</label>
                                    <input 
                                        type="text"
                                        disabled={!isEditingProfile}
                                        value={profileForm.data.name}
                                        onChange={e => profileForm.setData('name', e.target.value)}
                                        required
                                        className={`w-full border rounded-lg px-3.5 py-2.5 text-slate-800 transition-all ${
                                            isEditingProfile 
                                                ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                : 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                                        }`}
                                    />
                                    {profileForm.errors.name && <p className="text-[10px] text-rose-500 mt-1">{profileForm.errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">Email Address</label>
                                    <input 
                                        type="email"
                                        disabled={!isEditingProfile}
                                        value={profileForm.data.email}
                                        onChange={e => profileForm.setData('email', e.target.value)}
                                        required
                                        className={`w-full border rounded-lg px-3.5 py-2.5 text-slate-800 transition-all ${
                                            isEditingProfile 
                                                ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                : 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                                        }`}
                                    />
                                    {profileForm.errors.email && <p className="text-[10px] text-rose-500 mt-1">{profileForm.errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">Department / Role Scope</label>
                                    <input 
                                        type="text"
                                        disabled
                                        value={profileForm.data.department}
                                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3.5 py-2.5 text-slate-600 font-medium cursor-not-allowed"
                                    />
                                </div>

                                {isEditingProfile && (
                                    <div className="pt-2 flex items-center justify-end gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={profileForm.processing}
                                            className="px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 text-xs"
                                        >
                                            {profileForm.processing ? 'Saving...' : 'Save changes'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Update Password Form Card */}
                    {showPasswordCard && (
                        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">Update Password</h2>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Ensure your account is using a secure password to stay safe.</p>
                                </div>

                                {!isEditingPassword && (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingPassword(true)}
                                        className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shrink-0 shadow-2xs"
                                    >
                                        Edit password
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                                
                                {/* Current Password Field */}
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showCurrentPassword ? 'text' : 'password'}
                                            disabled={!isEditingPassword}
                                            value={passwordForm.data.current_password}
                                            onChange={e => passwordForm.setData('current_password', e.target.value)}
                                            required={isEditingPassword}
                                            className={`w-full border rounded-lg px-3.5 py-2.5 pr-10 text-slate-800 transition-all ${
                                                isEditingPassword 
                                                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                    : 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                                            }`}
                                        />
                                        {isEditingPassword && (
                                            <button 
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title={showCurrentPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {passwordForm.errors.current_password && <p className="text-[10px] text-rose-500 mt-1">{passwordForm.errors.current_password}</p>}
                                </div>

                                {/* New Password Field */}
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">New Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showNewPassword ? 'text' : 'password'}
                                            disabled={!isEditingPassword}
                                            value={passwordForm.data.password}
                                            onChange={e => passwordForm.setData('password', e.target.value)}
                                            required={isEditingPassword}
                                            className={`w-full border rounded-lg px-3.5 py-2.5 pr-10 text-slate-800 transition-all ${
                                                isEditingPassword 
                                                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                    : 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                                            }`}
                                        />
                                        {isEditingPassword && (
                                            <button 
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title={showNewPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showNewPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {passwordForm.errors.password && <p className="text-[10px] text-rose-500 mt-1">{passwordForm.errors.password}</p>}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            disabled={!isEditingPassword}
                                            value={passwordForm.data.password_confirmation}
                                            onChange={e => passwordForm.setData('password_confirmation', e.target.value)}
                                            required={isEditingPassword}
                                            className={`w-full border rounded-lg px-3.5 py-2.5 pr-10 text-slate-800 transition-all ${
                                                isEditingPassword 
                                                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                    : 'bg-slate-100 border-slate-200 text-slate-600 font-medium cursor-not-allowed'
                                            }`}
                                        />
                                        {isEditingPassword && (
                                            <button 
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    {passwordForm.errors.password_confirmation && <p className="text-[10px] text-rose-500 mt-1">{passwordForm.errors.password_confirmation}</p>}
                                </div>

                                {isEditingPassword && (
                                    <div className="pt-2 flex items-center justify-end gap-2.5">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingPassword(false)}
                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={passwordForm.processing}
                                            className="px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50 text-xs"
                                        >
                                            {passwordForm.processing ? 'Updating...' : 'Update password'}
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}