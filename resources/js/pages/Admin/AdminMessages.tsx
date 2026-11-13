import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface Message {
    id: number;
    sender: string;
    text: string;
    time: string;
    isMe: boolean;
}

interface MessageThread {
    id: number;
    senderName: string;
    role: string;
    avatar: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    messages: Message[];
}

interface AdminMessagesProps {
    notifications?: NotificationItem[];
    threads?: MessageThread[];
    user?: {
        name: string;
        email: string;
        role: string;
        assignedSection?: string;
        avatar?: string;
    };
}

export default function AdminMessages({ notifications = [], threads = [], user }: AdminMessagesProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [messageSearch, setMessageSearch] = useState<string>('');
    const [showMobileChat, setShowMobileChat] = useState<boolean>(false);

    // Use dynamic threads passed from Laravel backend, fallback to empty array if none
    const [activeThreadId, setActiveThreadId] = useState<number>(threads[0]?.id || 1);
    const [replyText, setReplyText] = useState<string>('');

    const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];
    const unreadConversationsCount = threads.filter(t => t.unread).length;

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !activeThread) return;

        // Post reply dynamically to backend using Inertia
        router.post(`/admin/messages/${activeThread.id}/reply`, {
            message: replyText.trim()
        }, {
            preserveScroll: true,
            onSuccess: () => setReplyText(''),
        });
    };

    const handleSelectThread = (threadId: number) => {
        setActiveThreadId(threadId);
        setShowMobileChat(true);

        // Optionally mark thread as read on backend if unread
        const target = threads.find(t => t.id === threadId);
        if (target && target.unread) {
            router.post(`/admin/messages/${threadId}/read`, {}, { preserveScroll: true, preserveState: true });
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

    const [notifList, setNotifList] = useState<NotificationItem[]>(notifications);

    const handleNotificationClick = (notification: NotificationItem) => {
        const updated = notifList.filter(n => n.id !== notification.id);
        setNotifList(updated);
        setNotifOpen(false);
        router.visit(notification.link);
    };

    const unreadCount = notifList.length;

    const filteredThreads = threads.filter(t => 
        t.senderName.toLowerCase().includes(messageSearch.toLowerCase()) ||
        t.role.toLowerCase().includes(messageSearch.toLowerCase()) ||
        t.lastMessage.toLowerCase().includes(messageSearch.toLowerCase())
    );

    return (
        <>
            <Head title="Messages — Principal Portal · San Mateo Elementary School"/>
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
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">SM</div>
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
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Principal Portal</div>}
                            <nav className="space-y-1">
                                <Link href="/admin/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/admin/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>
                                <Link href="/admin/users" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Management">
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
                                    {sidebarOpen && <span>User Settings</span>}
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
                            <span className="text-xs font-semibold text-slate-500 truncate">Principal Portal / Messages</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            {/* Notification Dropdown */}
                            <div className="relative" ref={notifRef}>
                                <button 
                                    onClick={() => setNotifOpen(!notifOpen)} 
                                    className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all border border-slate-200 cursor-pointer"
                                    title="Notifications"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
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
                                            {notifList.length === 0 ? (
                                                <div className="p-6 text-center text-slate-400">No new notifications</div>
                                            ) : (
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
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Principal Avatar Badge */}
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>CT</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Container Box */}
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm w-full overflow-hidden flex flex-col md:flex-row h-[calc(100vh-13rem)] min-h-[520px]">
                        
                        {/* Conversation List Sidebar (Left) */}
                        <div className={`w-full md:w-80 border-r border-slate-200/70 flex-col bg-slate-50/40 shrink-0 h-full overflow-hidden ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-slate-200/70 flex items-center justify-between shrink-0 bg-white gap-2">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Principal Inbox</h2>
                                {unreadConversationsCount > 0 ? (
                                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full shrink-0">
                                        {unreadConversationsCount} unread
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 font-medium text-[10px] rounded-full shrink-0">
                                        All read
                                    </span>
                                )}
                            </div>
                            <div className="p-3 border-b border-slate-200/50 bg-white">
                                <input 
                                    type="text"
                                    value={messageSearch}
                                    onChange={(e) => setMessageSearch(e.target.value)}
                                    placeholder="Search conversations..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                />
                            </div>
                            <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
                                {filteredThreads.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400">No conversations found</div>
                                ) : (
                                    filteredThreads.map(thread => (
                                        <div 
                                            key={thread.id}
                                            onClick={() => handleSelectThread(thread.id)}
                                            className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${activeThreadId === thread.id ? 'bg-emerald-50/60 border-l-4 border-slate-600' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 shadow-2xs">
                                                {thread.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className="font-bold text-xs text-slate-900 truncate">{thread.senderName}</span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{thread.time}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 truncate">{thread.lastMessage}</p>
                                            </div>
                                            {thread.unread && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Active Message Thread (Right) */}
                        <div className={`flex-1 flex-col bg-white h-full overflow-hidden min-w-0 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            {activeThread ? (
                                <>
                                    {/* Thread Header */}
                                    <div className="p-4 border-b border-slate-200/70 flex items-center gap-3 bg-white shrink-0">
                                        <button 
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer shrink-0"
                                            title="Back to list"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                            {activeThread.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-bold text-slate-900 truncate">{activeThread.senderName}</h3>
                                            <span className="text-[10px] text-slate-500 font-medium truncate block">{activeThread.role}</span>
                                        </div>
                                    </div>

                                    {/* Message Stream (Scrollable) */}
                                    <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/30">
                                        {activeThread.messages.map(msg => (
                                            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-2xs ${msg.isMe ? 'bg-[#4B8B6B] text-white rounded-br-xs' : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'}`}>
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Reply Input Bar */}
                                    <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-slate-200/70 bg-white flex items-center gap-2 shrink-0">
                                        <input 
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type message as Principal..."
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                                        />
                                        <button 
                                            type="submit"
                                            className="px-5 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium rounded-xl transition-all shadow-sm cursor-pointer text-xs shrink-0 flex items-center gap-1"
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