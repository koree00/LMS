import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ParentAccountProps {
    notifications?: NotificationItem[];
    child?: {
        name: string;
        gradeSection: string;
    };
    parentUser?: {
        name: string;
        email: string;
        phone: string;
        role: string;
        relationship: string;
        notificationsEnabled: boolean;
        avatar?: string;
    };
}

export default function ParentAccount({ 
    notifications = [], 
    child = {
        name: 'Alex Res',
        gradeSection: 'Grade 1 SNED · Section 1'
    },
    parentUser = {
        name: 'Robero Res',
        email: 'robero.res@gmail.com',
        phone: '+63 912 345 6789',
        role: 'Parent / guardian',
        relationship: 'Father',
        notificationsEnabled: true
    }
}: ParentAccountProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Avatar preview and file input state
    const [avatarPreview, setAvatarPreview] = useState<string | null>(parentUser.avatar ?? null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Edit mode states
    const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);

    // Initial form state snapshot for cancel/reset functionality
    const initialFormState = {
        name: parentUser.name,
        email: parentUser.email,
        phone: parentUser.phone,
        relationshipPreset: ['Father', 'Mother', 'Guardian'].includes(parentUser.relationship) ? parentUser.relationship : 'Other',
        relationshipCustom: ['Father', 'Mother', 'Guardian'].includes(parentUser.relationship) ? '' : parentUser.relationship,
        notificationsEnabled: parentUser.notificationsEnabled,
        avatar: parentUser.avatar ?? null
    };

    // Form state for editing account profile details
    const [formData, setFormData] = useState(initialFormState);

    // Separate state for Notification Preferences card
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(parentUser.notificationsEnabled);
    const [notifSuccessMessage, setNotifSuccessMessage] = useState<string>('');

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Password visibility toggle states (Eye toggle feature)
    const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [isDirty, setIsDirty] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [passwordMessage, setPasswordMessage] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            setIsDirty(true);
        }
    };

    const handleAvatarDelete = () => {
        setAvatarPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setIsDirty(true);
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
        setSuccessMessage('');
    };

    const handleCancelEdit = () => {
        setFormData(initialFormState);
        setAvatarPreview(parentUser.avatar ?? null);
        setIsEditingProfile(false);
        setIsDirty(false);
        setSuccessMessage('');
    };

    const handleCancelPassword = () => {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingPassword(false);
        setPasswordError('');
        setPasswordMessage('');
    };

    const handlePasswordChangeField = (field: string, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }));
        setPasswordMessage('');
        setPasswordError('');
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsDirty(false);
        setIsEditingProfile(false);
        setSuccessMessage('Profile information and avatar updated successfully.');
        setTimeout(() => setSuccessMessage(''), 4000);
    };

    const handleNotificationToggle = (enabled: boolean) => {
        setNotificationsEnabled(enabled);
        setNotifSuccessMessage('Notification preferences updated successfully.');
        setTimeout(() => setNotifSuccessMessage(''), 4000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setPasswordError('Please fill in all password fields.');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters long.');
            return;
        }

        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsEditingPassword(false);
        setPasswordError('');
        setPasswordMessage('Password updated successfully.');
        setTimeout(() => setPasswordMessage(''), 4000);
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

    const matchesSearch = (title: string, desc: string) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return title.toLowerCase().includes(q) || desc.toLowerCase().includes(q);
    };

    const showProfileCard = matchesSearch('Profile Information', 'Update your account profile details');
    const showPasswordCard = matchesSearch('Change Password', 'Ensure your account is using a secure password');
    const showNotificationCard = matchesSearch('SMS & Email Activity Alerts', 'Receive instant updates');

    return (
        <>
            <Head title="My Account Settings — EduQuestAI · San Mateo Elementary School" />
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
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Parent Portal</div>}
                            <nav className="space-y-1">
                                <Link href="/parent/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
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
                               
                                <Link href="/parent/account" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Account">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">Settings / My Account</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Search Input Bar */}
                            <div className="relative hidden sm:block">
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search settings..." 
                                    className="w-48 lg:w-64 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />
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
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{formData.name.split(' ').map(n => n[0]).join('')}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Information Form Card */}
                    {showProfileCard && (
                        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                            
                            {/* Header Section: Editable Profile Avatar aligned on the left */}
                            <div className="flex items-center justify-between pb-5 border-b border-slate-100 flex-wrap gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-900 border border-slate-200/80 flex items-center justify-center font-bold text-sm overflow-hidden shadow-xs shrink-0">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{formData.name.split(' ').map(n => n[0]).join('')}</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h2 className="text-sm font-bold text-slate-900 leading-snug">Profile Information</h2>
                                        
                                        {/* Change Picture Control & Meta specs in line */}
                                        {isEditingProfile ? (
                                            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs mt-1">
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
                                                    className="text-[#4B8B6B] hover:underline font-semibold cursor-pointer"
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
                                        ) : (
                                            <p className="text-xs text-slate-500 mt-0.5">Manage your personal contact info and preferences.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Edit Profile / View Toggle Button */}
                                {!isEditingProfile && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditingProfile(true)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {successMessage && (
                                <div className="p-3.5 bg-emerald-50 border border-slate-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                                    <span>✓</span> {successMessage}
                                </div>
                            )}

                            {/* Account Edit Form */}
                            <form onSubmit={handleProfileSubmit} className="space-y-6 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-700 block">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            disabled={!isEditingProfile}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            className={`w-full border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium ${
                                                isEditingProfile 
                                                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                    : 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-600'
                                            }`}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-700 block">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled={!isEditingProfile}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className={`w-full border rounded-xl px-3.5 py-2.5 text-slate-800 font-medium ${
                                                isEditingProfile 
                                                    ? 'bg-slate-50 border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400' 
                                                    : 'bg-slate-100 border-slate-200 cursor-not-allowed text-slate-600'
                                            }`}
                                            required
                                        />
                                    </div>

                                    

                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-700 block">Relationship to Student</label>
                                        {isEditingProfile ? (
                                            <div className="space-y-2">
                                                <select
                                                    value={formData.relationshipPreset}
                                                    onChange={(e) => handleChange('relationshipPreset', e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium cursor-pointer"
                                                >
                                                    <option value="Father">Father</option>
                                                    <option value="Mother">Mother</option>
                                                    <option value="Guardian">Guardian</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {formData.relationshipPreset === 'Other' && (
                                                    <input 
                                                        type="text"
                                                        placeholder="Please specify relationship"
                                                        value={formData.relationshipCustom}
                                                        onChange={(e) => handleChange('relationshipCustom', e.target.value)}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                                                        required
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <input 
                                                type="text"
                                                disabled
                                                value={formData.relationshipPreset === 'Other' ? formData.relationshipCustom || 'Other' : formData.relationshipPreset}
                                                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-600 font-medium cursor-not-allowed"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* Linked Student Info Card */}
                                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Linked Student Profile</span>
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{child.name}</h3>
                                            <p className="text-[11px] text-slate-500">{child.gradeSection} · San Mateo Elementary School</p>
                                        </div>
                                        <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-slate-200">
                                            Active Link
                                        </span>
                                    </div>
                                </div>

                                {/* Cancel & Save Changes Action Buttons (Only visible in Edit Mode) */}
                                {isEditingProfile && (
                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <button 
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shadow-2xs"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={!isDirty}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
                                                isDirty 
                                                    ? 'bg-[#4B8B6B] hover:bg-[#3d7255] text-white cursor-pointer' 
                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            }`}
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Separate Notification Preferences Card */}
                    {showNotificationCard && (
                        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-4 shadow-sm w-full">
                            <div className="space-y-1">
                                <h2 className="text-sm font-bold text-slate-900"> Email Activity Alerts</h2>
                                <p className="text-[11px] text-slate-500">Receive instant notifications when teachers post home-reinforcement activities or badges.</p>
                            </div>

                            {notifSuccessMessage && (
                                <div className="p-3 bg-emerald-50 border border-slate-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                                    <span>✓</span> {notifSuccessMessage}
                                </div>
                            )}

                            <div className="flex items-center justify-between p-4 border border-slate-200/80 rounded-2xl bg-slate-50/50 text-xs">
                                <div className="space-y-0.5">
                                    <span className="font-bold text-slate-900 block">Activity & Progress Notifications</span>
                                    <p className="text-[11px] text-slate-500">Toggle instant push alerts and email summaries on/off.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input 
                                        type="checkbox" 
                                        checked={notificationsEnabled}
                                        onChange={(e) => handleNotificationToggle(e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4B8B6B]"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Separate Password Security Card */}
                    {showPasswordCard && (
                        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 space-y-5 shadow-sm w-full">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-sm font-bold text-slate-900">Change Password</h2>
                                    <p className="text-[11px] text-slate-500">Ensure your account is using a secure password to protect student progress records.</p>
                                </div>

                                {!isEditingPassword && (
                                    <button 
                                        type="button"
                                        onClick={() => setIsEditingPassword(true)}
                                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                    >
                                        Edit Password
                                    </button>
                                )}
                            </div>

                            {passwordMessage && (
                                <div className="p-3.5 bg-emerald-50 border border-slate-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                                    <span>✓</span> {passwordMessage}
                                </div>
                            )}

                            {passwordError && (
                                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-center gap-2">
                                    <span></span> {passwordError}
                                </div>
                            )}

                            {isEditingPassword ? (
                                <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs pt-1">
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-700 block">Current Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => handlePasswordChangeField('currentPassword', e.target.value)}
                                                placeholder="Enter current password"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                                                required
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                title={showCurrentPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-700 block">New Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => handlePasswordChangeField('newPassword', e.target.value)}
                                                    placeholder="At least 8 characters"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                                                    required
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                    title={showNewPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showNewPassword ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="font-bold text-slate-700 block">Confirm New Password</label>
                                            <div className="relative">
                                                <input 
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => handlePasswordChangeField('confirmPassword', e.target.value)}
                                                    placeholder="Re-enter new password"
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 pr-12 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-medium"
                                                    required
                                                />
                                                <button 
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                                                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-3 pt-2">
                                        <button 
                                            type="button"
                                            onClick={handleCancelPassword}
                                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all shadow-2xs"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="px-5 py-2.5 rounded-xl bg-[#4B8B6B] hover:bg-[#3d7255] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="text-xs text-slate-500 py-1">
                                    Password last updated over 3 months ago. Click <strong className="text-slate-700">Edit Password</strong> above to set a new one.
                                </div>
                            )}
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}