import React, { useState, useRef, useEffect } from 'react';
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
    avatar: string;
    preview: string;
    timestamp: string;
    unread: boolean;
    messages: {
        id: number;
        sender: string;
        text: string;
        time: string;
        isMe: boolean;
    }[];
}

interface SnedMessagesProps {
    notifications?: NotificationItem[];
    user?: {
        name: string;
        email: string;
        role: string;
        assignedSection?: string;
        avatar?: string;
    };
}

export default function SnedMessages({ notifications = [], user }: SnedMessagesProps) {
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

    const [conversations, setConversations] = useState<MessageItem[]>([
        {
            id: 1,
            sender: 'Cherry Tiong',
            role: 'Principal — San Mateo Elementary School',
            avatar: 'CT',
            preview: 'Please review the updated IEP compliance summary for Grade 1 inclusion.',
            timestamp: '10:42 AM',
            unread: true,
            messages: [
                { id: 101, sender: 'Cherry Tiong', text: 'Good morning Ena! Have you finalized the behavioral telemetry logs for Grade 1?', time: '10:30 AM', isMe: false },
                { id: 102, sender: 'Cherry Tiong', text: 'Please review the updated IEP compliance summary for Grade 1 inclusion.', time: '10:42 AM', isMe: false },
            ]
        },
        {
            id: 2,
            sender: 'Teacher Mara Santos',
            role: 'Inclusive Teacher · Section 1',
            avatar: 'MS',
            preview: 'Sensory pause logs for student Leo are ready for validation.',
            timestamp: 'Yesterday',
            unread: false,
            messages: [
                { id: 201, sender: 'Teacher Mara Santos', text: 'Sensory pause logs for student Leo are ready for validation in the queue.', time: 'Yesterday', isMe: false },
            ]
        },
        {
            id: 3,
            sender: 'ICT Support Desk',
            role: 'Infrastructure & Operations',
            avatar: 'IT',
            preview: 'Audio support and text-to-speech tools have been updated.',
            timestamp: 'Nov 12',
            unread: false,
            messages: [
                { id: 301, sender: 'ICT Support Desk', text: 'Audio support and text-to-speech tools have been updated for low-stimulation UI.', time: 'Nov 12', isMe: false },
            ]
        }
    ]);

    const [activeChatId, setActiveChatId] = useState<number>(conversations[0]?.id || 1);
    const [replyText, setReplyText] = useState<string>('');

    const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];
    const unreadConversationsCount = conversations.filter(c => c.unread).length;

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
            const saved = localStorage.getItem('sned_notifications_dismissed');
            if (saved) {
                const dismissedIds: number[] = JSON.parse(saved);
                return notifications.filter(n => !dismissedIds.includes(n.id));
            }
        }
        return notifications.length > 0 ? notifications : [
            { id: 1, text: 'New sensory pause validation pending review', time: '15m ago', unread: true, link: '/sned-coordinator/validation-queue' }
        ];
    });

    const handleNotificationClick = (notification: NotificationItem) => {
        const updated = notifList.filter(n => n.id !== notification.id);
        setNotifList(updated);
        if (typeof window !== 'undefined') {
            const currentDismissed = JSON.parse(localStorage.getItem('sned_notifications_dismissed') || '[]');
            localStorage.setItem('sned_notifications_dismissed', JSON.stringify([...currentDismissed, notification.id]));
        }
        setNotifOpen(false);
        router.visit(notification.link);
    };

    const markAllAsRead = () => {
        setNotifList([]);
        if (typeof window !== 'undefined') {
            const allIds = notifList.map(n => n.id);
            localStorage.setItem('sned_notifications_dismissed', JSON.stringify(allIds));
        }
    };

    const unreadCount = notifList.length;

    const handleSelectChat = (id: number) => {
        setActiveChatId(id);
        setShowMobileChat(true);
        setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
    };

    const handleSendReply = (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: user?.name || 'Ena Res',
            text: replyText.trim(),
            time: 'Just now',
            isMe: true,
        };

        setConversations(prev => prev.map(c => {
            if (c.id === activeChatId) {
                return {
                    ...c,
                    preview: `You: ${replyText.trim()}`,
                    timestamp: 'Just now',
                    messages: [...c.messages, newMessage]
                };
            }
            return c;
        }));

        setReplyText('');
    };

    const filteredConversations = conversations.filter(c =>
        c.sender.toLowerCase().includes(messageSearch.toLowerCase()) ||
        c.role.toLowerCase().includes(messageSearch.toLowerCase()) ||
        c.preview.toLowerCase().includes(messageSearch.toLowerCase())
    );

    return (
        <>
            <Head title="Messages — SNED Coordinator Portal · San Mateo Elementary School"/>
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
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">SNED Portal</div>}
                            <nav className="space-y-1">
                                <Link href="/sned-coordinator/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                 <Link href="/sned-coordinator/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>
                                 <Link href="/sned-coordinator/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Learners Profile">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                                                                                    {sidebarOpen && <span>Learners Profile</span>}
                                                                                                </Link> 
                                <Link href="/sned-coordinator/validation-queue" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Validation Queue">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    {sidebarOpen && <span>Validation Queue</span>}
                                </Link>
                                <Link href="/sned-coordinator/intervention-logs" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Intervention & Flags">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    {sidebarOpen && <span>Intervention & Flags</span>}
                                </Link>
                               
                                <Link href="/sned-coordinator/settings" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="User Settings">
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
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">SNED Portal / Messages</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
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
                                                <button onClick={markAllAsRead} className="text-[11px] text-slate-700 hover:underline cursor-pointer">Clear all</button>
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

                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-slate-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>ER</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Messages Container Box */}
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm w-full overflow-hidden flex flex-col md:flex-row h-[calc(100vh-13rem)] min-h-[520px]">
                        
                        <div className={`w-full md:w-80 border-r border-slate-200/70 flex-col bg-slate-50/40 shrink-0 h-full overflow-hidden ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            <div className="p-4 border-b border-slate-200/70 flex items-center justify-between shrink-0 bg-white gap-2">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">SNED Inbox</h2>
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
                                {filteredConversations.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400">No conversations found</div>
                                ) : (
                                    filteredConversations.map(conv => (
                                        <div 
                                            key={conv.id}
                                            onClick={() => handleSelectChat(conv.id)}
                                            className={`p-4 cursor-pointer transition-all flex items-start gap-3 ${activeChatId === conv.id ? 'bg-emerald-50/60 border-l-4 border-slate-600' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 shadow-2xs">
                                                {conv.avatar}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className="font-bold text-xs text-slate-900 truncate">{conv.sender}</span>
                                                    <span className="text-[10px] text-slate-400 shrink-0">{conv.timestamp}</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 truncate">{conv.preview}</p>
                                            </div>
                                            {conv.unread && (
                                                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className={`flex-1 flex-col bg-white h-full overflow-hidden min-w-0 ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                            {activeChat ? (
                                <>
                                    <div className="p-4 border-b border-slate-200/70 flex items-center gap-3 bg-white shrink-0">
                                        <button 
                                            onClick={() => setShowMobileChat(false)}
                                            className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 cursor-pointer shrink-0"
                                            title="Back to list"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                                        </button>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                            {activeChat.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xs font-bold text-slate-900 truncate">{activeChat.sender}</h3>
                                            <span className="text-[10px] text-slate-500 font-medium truncate block">{activeChat.role}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 bg-slate-50/30">
                                        {activeChat.messages.map(msg => (
                                            <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                                <div className={`max-w-md rounded-2xl px-4 py-3 text-xs shadow-2xs ${msg.isMe ? 'bg-[#4B8B6B] text-white rounded-br-xs' : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-xs'}`}>
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.time}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSendReply} className="p-3 sm:p-4 border-t border-slate-200/70 bg-white flex items-center gap-2 shrink-0">
                                        <input 
                                            type="text"
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Type message as SNED Coordinator..."
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