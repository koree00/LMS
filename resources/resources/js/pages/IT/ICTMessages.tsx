import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface MessageThread {
    id: number;
    senderName: string;
    role: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    messages: {
        id: number;
        sender: string;
        text: string;
        time: string;
        isMe: boolean;
    }[];
}

interface ICTMessagesProps {
    notifications?: NotificationItem[];
    threads?: MessageThread[];
}

export default function ICTMessages({ notifications = [], threads = [] }: ICTMessagesProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [messageSearch, setMessageSearch] = useState<string>('');

    // Mobile view state: whether we are currently viewing the chat thread on small screens
    const [showMobileChat, setShowMobileChat] = useState<boolean>(false);

    // Conversation threads with simple, everyday messaging
    const [conversationList, setConversationList] = useState<MessageThread[]>(threads.length > 0 ? threads : [
        {
            id: 1,
            senderName: 'Cherry Tiong',
            role: 'Principal · San Mateo Elementary School',
            avatar: 'CT',
            lastMessage: 'Please check the daily activity reports before Monday.',
            time: '10:15 AM',
            unread: true,
            messages: [
                { id: 1, sender: 'Cherry Tiong', text: 'Good morning! Are all the student records updated for the new week?', time: '9:30 AM', isMe: false },
                { id: 2, sender: 'ICT Admin', text: 'Good morning Principal Tiong! Yes, everything is updated and checked.', time: '9:45 AM', isMe: true },
                { id: 3, sender: 'Cherry Tiong', text: 'Please check the daily activity reports before Monday.', time: '10:15 AM', isMe: false }
            ]
        },
        {
            id: 2,
            senderName: 'Ena Res',
            role: 'SNED Coordinator',
            avatar: 'ER',
            lastMessage: 'Thank you for updating the account access for the new teachers.',
            time: 'Yesterday',
            unread: false,
            messages: [
                { id: 1, sender: 'Ena Res', text: 'Hi! Can we reset the password for teacher Mara Sas?', time: 'Yesterday', isMe: false },
                { id: 2, sender: 'ICT Admin', text: 'Done! Her temporary login details have been sent to her email.', time: 'Yesterday', isMe: true },
                { id: 3, sender: 'Ena Res', text: 'Thank you for updating the account access for the new teachers.', time: 'Yesterday', isMe: false }
            ] 
        },
        {
            id: 3,
            senderName: 'Teacher Mara Sas',
            role: 'Inclusive Teacher · Section 1',
            avatar: 'MS',
            lastMessage: 'The audio support and reading tools are working great on the tablets.',
            time: 'Nov 10',
            unread: false,
            messages: [
                { id: 1, sender: 'Teacher Mara Sas', text: 'The audio support and reading tools are working great on the tablets.', time: 'Nov 10', isMe: false }
            ]
        }
    ]);

    const [activeThreadId, setActiveThreadId] = useState<number>(conversationList[0]?.id || 1);
    const [replyText, setReplyText] = useState<string>('');

    const activeThread = conversationList.find(t => t.id === activeThreadId) || conversationList[0];

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: 'ICT Admin',
            text: replyText.trim(),
            time: 'Just now',
            isMe: true,
        };

        setConversationList(conversationList.map(t => {
            if (t.id === activeThreadId) {
                return {
                    ...t,
                    lastMessage: replyText.trim(),
                    time: 'Just now',
                    messages: [...t.messages, newMessage]
                };
            }
            return t;
        }));

        setReplyText('');
    };

    const handleSelectThread = (threadId: number) => {
        setActiveThreadId(threadId);
        setShowMobileChat(true); // Switch to active chat on mobile view
        setConversationList(conversationList.map(t => {
            if (t.id === threadId) {
                return { ...t, unread: false };
            }
            return t;
        }));
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

    const filteredThreads = conversationList.filter(t => 
        t.senderName.toLowerCase().includes(messageSearch.toLowerCase()) ||
        t.role.toLowerCase().includes(messageSearch.toLowerCase()) ||
        t.lastMessage.toLowerCase().includes(messageSearch.toLowerCase())
    );

    return (
        <>
            <Head title="Messages & Communications — ICT Portal · San Mateo Elementary School" />
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
                                <Link href="/it/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
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
                                <Link href="/it/account" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="My Account">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">Messages</span>
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

                    {/* Messaging Card Container */}
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm w-full overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[500px]">
                        
                        {/* Left Sidebar: Conversation Threads (Hidden on mobile when viewing a chat) */}
                        <div className={`w-full md:w-80 border-r border-slate-200/70 flex-col bg-slate-50/50 shrink-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-slate-200/70 space-y-3 bg-white">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-sm font-bold text-slate-900">Messages</h1>
                                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-slate-100">
                                        {conversationList.length} chats
                                    </span>
                                </div>
                                <input 
                                    type="text" 
                                    value={messageSearch}
                                    onChange={(e) => setMessageSearch(e.target.value)}
                                    placeholder="Search conversations..." 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                />
                            </div>

                            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                                {filteredThreads.length > 0 ? (
                                    filteredThreads.map(thread => (
                                        <div 
                                            key={thread.id}
                                            onClick={() => handleSelectThread(thread.id)}
                                            className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 ${
                                                activeThreadId === thread.id ? 'bg-emerald-50/70 border-l-4 border-[#4B8B6B]' : 'hover:bg-slate-100/60'
                                            }`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200/80 shrink-0 shadow-2xs">
                                                {thread.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-1">
                                                    <span className="font-bold text-xs text-slate-900 truncate">{thread.senderName}</span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{thread.time}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">{thread.role}</p>
                                                <p className="text-[11px] text-slate-600 truncate mt-1">{thread.lastMessage}</p>
                                            </div>
                                            {thread.unread && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-xs text-slate-400">No conversations found</div>
                                )}
                            </div>
                        </div>

                        {/* Right Area: Active Chat Thread View (Hidden on mobile when viewing the list) */}
                        <div className={`flex-1 flex-col bg-white min-w-0 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            {activeThread ? (
                                <>
                                    {/* Thread Header */}
                                    <div className="p-4 border-b border-slate-200/70 flex items-center justify-between bg-white shrink-0">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {/* Back button for mobile view */}
                                            <button 
                                                onClick={() => setShowMobileChat(false)}
                                                className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer shrink-0"
                                                title="Back to list"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                            </button>
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 shadow-2xs">
                                                {activeThread.avatar}
                                            </div>
                                            <div className="min-w-0">
                                                <h2 className="text-xs font-bold text-slate-900 truncate">{activeThread.senderName}</h2>
                                                <p className="text-[11px] text-slate-500 truncate">{activeThread.role}</p>
                                            </div>
                                        </div>
                                       
                                    </div>

                                    {/* Messages Scroll Area */}
                                    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/30">
                                        {activeThread.messages.map(msg => (
                                            <div 
                                                key={msg.id} 
                                                className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                                            >
                                                <div className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-2xs ${
                                                    msg.isMe 
                                                        ? 'bg-[#4B8B6B] text-white rounded-br-xs' 
                                                        : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'
                                                }`}>
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                </div>
                                                <span className={`text-[10px] text-slate-400 mt-1 px-1 ${msg.isMe ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Input Footer */}
                                    <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-slate-200/70 bg-white flex items-center gap-2.5 shrink-0">
                                        <input 
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type your message here..."
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-sans"
                                        />
                                        <button
                                            type="submit"
                                            className="px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all shadow-sm cursor-pointer text-xs shrink-0 flex items-center gap-1.5"
                                        >
                                            <span>Send</span>
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                                    Select a conversation to start messaging.
                                </div>
                            )}
                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}