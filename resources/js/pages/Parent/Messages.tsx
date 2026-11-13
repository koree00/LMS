import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface MessageItem {
    id: number;
    sender: string;
    role: string;
    avatarText: string;
    timestamp: string;
    preview: string;
    unread: boolean;
    thread: {
        sender: string;
        text: string;
        time: string;
        isUser: boolean;
    }[];
}

interface ParentMessagesProps {
    notifications?: NotificationItem[];
    child?: {
        name: string;
        gradeSection: string;
    };
    messages?: MessageItem[];
    parentUser?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function ParentMessages({ 
    notifications = [], 
    child = {
        name: 'Alex Reyes',
        gradeSection: 'Grade 1 SNED · Section 1'
    },
    messages = [
        {
            id: 1,
            sender: 'Teacher Maria Santos',
            role: 'Grade 1 Special Education Teacher · San Mateo Elementary School',
            avatarText: 'MS',
            timestamp: '10:45 AM',
            preview: 'Hello Mr. and Mrs. Reyes, I posted a new home-reinforcement activity for Alex regarding phonics sound matching...',
            unread: true,
            thread: [
                { sender: 'Teacher Maria Santos', text: 'Hello Mr. and Mrs. Reyes, I posted a new home-reinforcement activity for Alex regarding phonics sound matching.', time: '10:45 AM', isUser: false }
            ]
        },
        {
            id: 2,
            sender: 'Principal Cynthia S. Tompong',
            role: 'Principal · San Mateo Elementary School',
            avatarText: 'CT',
            timestamp: 'Yesterday',
            preview: 'Good day! Thank you for coordinating the data gathering authorizations for the upcoming inclusive learning modules.',
            unread: false,
            thread: [
                { sender: 'Principal Cynthia S. Tompong', text: 'Good day! Thank you for coordinating the data gathering authorizations for the upcoming inclusive learning modules.', time: 'Yesterday 2:15 PM', isUser: false },
                { sender: 'Roberto Reyes', text: 'You are very welcome, Principal Tompong. Please let us know if additional documentation is required.', time: 'Yesterday 3:30 PM', isUser: true }
            ]
        },
        {
            id: 3,
            sender: 'School Clinic Nurse Ana',
            role: 'Health & Sensory Support Coordinator',
            avatarText: 'AN',
            timestamp: 'Nov 10, 2026',
            preview: 'Just a gentle reminder regarding Alex’s sensory pause schedule during high-stimulus classroom hours.',
            unread: false,
            thread: [
                { sender: 'School Clinic Nurse Ana', text: 'Just a gentle reminder regarding Alex’s sensory pause schedule during high-stimulus classroom hours.', time: 'Nov 10, 2026 9:00 AM', isUser: false }
            ]
        }
    ],
    parentUser = {
        name: 'Roberto Reyes',
        email: 'roberto.reyes@gmail.com',
        role: 'Parent / guardian'
    }
}: ParentMessagesProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Messages state
    const [messageList, setMessageList] = useState<MessageItem[]>(messages);
    const [activeMessageId, setActiveMessageId] = useState<number>(messages[0]?.id || 1);
    const [replyText, setReplyText] = useState<string>('');
    const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

    const activeConversation = messageList.find(m => m.id === activeMessageId) || messageList[0];

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMsg = {
            sender: parentUser.name,
            text: replyText.trim(),
            time: 'Just now',
            isUser: true
        };

        setMessageList(prev => prev.map(m => {
            if (m.id === activeMessageId) {
                return {
                    ...m,
                    preview: `You: ${replyText.trim()}`,
                    timestamp: 'Just now',
                    thread: [...m.thread, newMsg]
                };
            }
            return m;
        }));

        setReplyText('');
    };

    const handleSelectConversation = (id: number) => {
        setActiveMessageId(id);
        setMessageList(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
        setMobileShowChat(true);
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
            { id: 1, text: 'Teacher Maria posted a new home-reinforcement activity', time: '15m ago', unread: true, link: '/parent/activities' },
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

    const filteredMessages = messageList.filter(m => 
        m.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Teacher & School Messages — EduQuestAI · San Mateo Elementary School" />
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
                                <Link href="/parent/progress" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Child Progress">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Child Progress</span>}
                                </Link>
                                <Link href="/parent/activities" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Home Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Home Activities</span>}
                                </Link>
                                <Link href="/parent/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
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
                <main className={`flex-1 w-full min-w-0 py-3 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-5 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Parent Portal / Messages</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
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

                    {/* Messages Layout Container */}
                    <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm w-full grid grid-cols-1 lg:grid-cols-3 overflow-hidden min-h-[480px]">
                        
                        {/* Conversation List Sidebar */}
                        <div className={`border-r border-slate-200/70 flex-col bg-slate-50/40 lg:flex ${mobileShowChat ? 'hidden lg:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-slate-200/70 space-y-3 bg-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Teacher & Staff Messages</h2>
                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-slate-200 px-2 py-0.5 rounded-md">
                                        {messageList.filter(m => m.unread).length} Unread
                                    </span>
                                </div>
                                {/* Search Bar */}
                                <div className="relative w-full">
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..." 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    />
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                                {filteredMessages.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400">No conversations found.</div>
                                ) : (
                                    filteredMessages.map(msg => (
                                        <div 
                                            key={msg.id}
                                            onClick={() => handleSelectConversation(msg.id)}
                                            className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${
                                                activeMessageId === msg.id 
                                                    ? 'bg-emerald-50/60 border-l-4 border-slate-600' 
                                                    : 'hover:bg-slate-100/60 bg-white'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200/70 shrink-0 shadow-2xs">
                                                {msg.avatarText}
                                            </div>
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-xs truncate ${msg.unread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                                        {msg.sender}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{msg.timestamp}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 truncate leading-relaxed">{msg.preview}</p>
                                                {msg.unread && (
                                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 mt-1"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Active Conversation Thread View */}
                        <div className={`lg:col-span-2 flex-col bg-white ${mobileShowChat ? 'flex' : 'hidden lg:flex'}`}>
                            {activeConversation ? (
                                <>
                                    {/* Thread Header */}
                                    <div className="p-4 sm:p-5 border-b border-slate-200/70 flex items-center justify-between bg-white">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Back button for mobile view */}
                                            <button 
                                                onClick={() => setMobileShowChat(false)}
                                                className="lg:hidden p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer shrink-0"
                                                title="Back to list"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                            </button>

                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200/70 shrink-0 shadow-2xs">
                                                {activeConversation.avatarText}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-slate-900 text-sm truncate">{activeConversation.sender}</h3>
                                                <p className="text-[11px] text-slate-500 truncate">{activeConversation.role}</p>
                                            </div>
                                        </div>
                                        <span className="hidden sm:inline-block text-[11px] font-medium text-emerald-800 bg-emerald-50 border border-slate-200 px-3 py-1 rounded-lg shrink-0">
                                            San Mateo Elementary Portal
                                        </span>
                                    </div>

                                    {/* Messages Scroll Area */}
                                    <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/30 max-h-[300px] sm:max-h-[340px]">
                                        {activeConversation.thread.map((t, idx) => (
                                            <div key={idx} className={`flex flex-col ${t.isUser ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-bold text-slate-500">{t.sender}</span>
                                                    <span className="text-[10px] text-slate-400">{t.time}</span>
                                                </div>
                                                <div className={`p-3.5 rounded-2xl text-xs max-w-xs sm:max-w-md leading-relaxed ${
                                                    t.isUser 
                                                        ? 'bg-[#4B8B6B] text-white rounded-br-xs shadow-xs' 
                                                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs shadow-2xs'
                                                }`}>
                                                    {t.text}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Form */}
                                    <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-slate-200/70 bg-white flex items-center gap-2 sm:gap-3">
                                        <input 
                                            type="text" 
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder={`Reply to ${activeConversation.sender.split(' ')[1] || activeConversation.sender}...`}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                        <button 
                                            type="submit"
                                            className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#4B8B6B] hover:bg-[#3d7255] text-white text-xs font-bold cursor-pointer transition-all shadow-xs shrink-0"
                                        >
                                            Send
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
                                    Select a conversation from the left to start messaging.
                                </div>
                            )}
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}