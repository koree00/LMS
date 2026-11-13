import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
}

interface ConversationItem {
    id: number;
    name: string;
    role: string;
    lastMessage: string;
    time: string;
    unread: boolean;
}

export default function TeacherMessages() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    
    const [notifOpen, setNotifOpen] = useState<boolean>(false);
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

    const [notifications, setNotifications] = useState<NotificationItem[]>([
        { id: 1, text: 'New classroom observation note logged for Mia S.', time: '10m ago', unread: true },
        { id: 2, text: 'SNED validation review completed for Grade 1 math', time: '1h ago', unread: true },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [conversations, setConversations] = useState<ConversationItem[]>([
        { id: 1, name: 'Cherry Tiong', role: 'Principal · San Mateo Elementary School', lastMessage: 'Please review the updated IEP compliance summary for Grade 1 inclusion.', time: '10:42 AM', unread: true },
        { id: 2, name: 'Parent of Mia Santos', role: 'Family Check-in', lastMessage: 'Mia enjoyed the counting activity today!', time: '2h ago', unread: false },
        { id: 3, name: 'SNED Validation Team', role: 'Support Services', lastMessage: 'The lesson modification review has been approved.', time: 'Yesterday', unread: false },
    ]);

    const [activeChat, setActiveChat] = useState<ConversationItem>(conversations[0]);
    const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);
    const [replyText, setReplyText] = useState<string>('');

    const filteredConversations = conversations.filter(conv => 
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        conv.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        setReplyText('');
    };

    return (
        <>
            <Head title="Messages — Teacher Portal · San Mateo Elementary School" />
            <div className="min-h-screen bg-white flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div 
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-slate-900/10 z-40 md:hidden backdrop-blur-3xs transition-opacity"
                    />
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                                    SM
                                </div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span>
                                        <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all cursor-pointer shrink-0 border border-transparent hover:border-slate-200/70"
                                aria-label="Toggle Sidebar"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            {sidebarOpen && (
                                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">
                                    Teacher
                                </div>
                            )}

                            <nav className="space-y-1">
                                <Link href="/teacher/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/teacher/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>Learners</span>}
                                </Link>
                                <Link href="/teacher/lessons" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Lessons</span>}
                                </Link>
                                <Link href="/teacher/observations" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    {sidebarOpen && <span>Observations</span>}
                                </Link>
                                <Link href="/teacher/reports" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Reports</span>}
                                </Link>
                                <Link href="/teacher/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>
                                <Link href="/teacher/schedule" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                    {sidebarOpen && <span>Schedule</span>}
                                </Link>
                            </nav>
                        </div>
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 shrink-0 bg-white">
                        <Link href="/login" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-50/50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                            <svg className="w-4 h-4 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 w-full min-w-0 py-4 px-3 sm:px-6 lg:px-8 space-y-4 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Bar Header */}
                    <div className="flex items-center justify-between bg-white p-3 sm:px-5 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Teacher Portal / Messages</span>
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
                                                <button onClick={markAllAsRead} className="text-[11px] text-slate-700 hover:underline font-medium cursor-pointer">Mark all read</button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-2.5 ${n.unread ? 'bg-slate-50' : ''}`}>
                                                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-slate-500' : 'bg-slate-300'}`}></span>
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
                                TA
                            </div>
                        </div>
                    </div>

                    {/* Responsive Messages Container Box */}
                    <div className="bg-white rounded-xl border border-slate-200/70 shadow-2xs grid grid-cols-1 lg:grid-cols-3 overflow-hidden w-full">
                        
                        {/* Left Column: Inbox & Search (Hidden on mobile when chat is active) */}
                        <div className={`border-r border-slate-200/70 flex-col h-[480px] bg-white ${mobileShowChat ? 'hidden lg:flex' : 'flex'}`}>
                            
                            {/* Inbox Header & Unread Badge */}
                            <div className="py-3 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-800">TEACHER INBOX</span>
                                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-slate-100">1 unread</span>
                            </div>

                            {/* Search Input Bar */}
                            <div className="p-2.5 border-b border-slate-100 shrink-0">
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </span>
                                    <input 
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search conversations..." 
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                            </div>

                            {/* Conversation List items */}
                            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                                {filteredConversations.length > 0 ? (
                                    filteredConversations.map((conv) => (
                                        <div 
                                            key={conv.id}
                                            onClick={() => {
                                                setActiveChat(conv);
                                                setMobileShowChat(true);
                                            }}
                                            className={`py-2.5 px-3 cursor-pointer transition-all text-xs flex items-start gap-2.5 relative ${activeChat.id === conv.id ? 'bg-slate-50/80 border-l-4 border-emerald-600' : 'hover:bg-slate-50/50'}`}
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-[11px]">
                                                {conv.name.charAt(0) === 'C' ? 'CT' : conv.name.charAt(0) === 'P' ? 'MS' : 'IT'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-slate-900 truncate">{conv.name}</span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{conv.time}</span>
                                                </div>
                                                <p className="text-slate-500 text-[11px] truncate mt-0.5">{conv.lastMessage}</p>
                                            </div>
                                            {conv.unread && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute right-3 top-3.5"></span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-6 text-center text-slate-400 text-xs">No conversations found</div>
                                )}
                            </div>
                        </div>

                        {/* Right 2 Columns: Chat Conversation Window (Full screen on mobile when active) */}
                        <div className={`lg:col-span-2 flex-col h-[480px] bg-white ${mobileShowChat ? 'flex' : 'hidden lg:flex'}`}>
                            
                            {/* Contact Header */}
                            <div className="py-3 px-4 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-3 min-w-0">
                                    <button 
                                        onClick={() => setMobileShowChat(false)}
                                        className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
                                        title="Back to inbox"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                    </button>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                                        {activeChat.name.charAt(0) === 'C' ? 'CT' : activeChat.name.charAt(0) === 'P' ? 'MS' : 'IT'}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-xs font-bold text-slate-900 truncate">{activeChat.name}</h3>
                                        <span className="text-[10px] text-slate-500 truncate block">{activeChat.role}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Bubbles Body */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs bg-white">
                                <div className="flex flex-col space-y-1">
                                    <div className="bg-slate-100/80 py-2.5 px-3.5 rounded-xl rounded-tl-xs text-slate-800 max-w-md shadow-2xs leading-relaxed">
                                        Good morning Teacher Ana! Have you finalized the behavioral telemetry logs for Grade 1?
                                    </div>
                                    <span className="text-[10px] text-slate-400 px-0.5">10:30 AM</span>
                                </div>

                                <div className="flex flex-col space-y-1">
                                    <div className="bg-slate-100/80 py-2.5 px-3.5 rounded-xl rounded-tl-xs text-slate-800 max-w-md shadow-2xs leading-relaxed">
                                        {activeChat.lastMessage}
                                    </div>
                                    <span className="text-[10px] text-slate-400 px-0.5">{activeChat.time}</span>
                                </div>
                            </div>

                            {/* Input Form & Right-aligned Send Button */}
                            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex items-center gap-2.5 bg-white shrink-0">
                                <input 
                                    type="text" 
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type message as Teacher..." 
                                    className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-2xs min-w-0"
                                />
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-all shadow-sm shrink-0 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Send</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                            </form>

                        </div>

                    </div>

                </main>
            </div>
        </>
    );
}