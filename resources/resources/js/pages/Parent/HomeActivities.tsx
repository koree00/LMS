import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ActivityFeedbackCard from './ActivityFeedbackCard';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface TaskItem {
    id: number;
    title: string;
    type: string;
    dueDate: string;
    status: 'Assigned' | 'Submitted' | 'Missing';
}

interface SubjectCardItem {
    id: string;
    subject: string;
    category: string;
    icon: string;
    bgGradient: string;
    borderColor: string;
    textColor: string;
    assignedCount: number;
    completedCount: number;
    nextDeadline: string;
    tasks: TaskItem[];
}

interface HomeActivitiesProps {
    notifications?: NotificationItem[];
    child?: {
        name: string;
        gradeSection: string;
    };
    subjects?: SubjectCardItem[];
    parentUser?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function HomeActivities({ 
    notifications = [], 
    child = {
        name: 'Alex Res',
        gradeSection: 'Grade 1 SNED · Section 1'
    },
    subjects = [
        {
            id: 'reading',
            subject: 'Reading and Literacy',
            category: 'Communication & Literacy',
            icon: '📚',
            bgGradient: 'bg-emerald-50/60',
            borderColor: 'border-slate-200/80',
            textColor: 'text-emerald-900',
            assignedCount: 2,
            completedCount: 3,
            nextDeadline: 'Nov 13, 2026',
            tasks: [
                { id: 101, title: 'Phonics Sound Matching Practice', type: 'Interactive Mini-Game', dueDate: 'Nov 13, 2026', status: 'Assigned' },
                { id: 102, title: 'Audio-Assisted Sight Words Drill', type: 'Reading Exercise', dueDate: 'Nov 15, 2026', status: 'Assigned' },
                { id: 103, title: 'Alphabet Letter Identification', type: 'Practice Quiz', dueDate: 'Nov 10, 2026', status: 'Submitted' },
                { id: 104, title: 'Vowel Sound Recognition', type: 'Audio Recording', dueDate: 'Nov 8, 2026', status: 'Submitted' },
                { id: 105, title: 'Basic Rhyming Words', type: 'Interactive Activity', dueDate: 'Nov 5, 2026', status: 'Submitted' },
                { id: 106, title: 'Letter A-E Tracing Sheet', type: 'Worksheet', dueDate: 'Nov 3, 2026', status: 'Missing' }
            ]
        },
        {
            id: 'language',
            subject: 'Language',
            category: 'Communication & Literacy',
            icon: '💬',
            bgGradient: 'bg-sky-50/60',
            borderColor: 'border-slate-200/80',
            textColor: 'text-sky-900',
            assignedCount: 1,
            completedCount: 2,
            nextDeadline: 'Nov 14, 2026',
            tasks: [
                { id: 201, title: 'Expressing Needs & Sensory Preferences', type: 'Parent-Child Check-in', dueDate: 'Nov 14, 2026', status: 'Assigned' },
                { id: 202, title: 'Following Simple 2-Step Instructions', type: 'Interactive Drill', dueDate: 'Nov 9, 2026', status: 'Submitted' },
                { id: 203, title: 'Naming Everyday Classroom Objects', type: 'Vocabulary Quiz', dueDate: 'Nov 6, 2026', status: 'Submitted' }
            ]
        },
        {
            id: 'math',
            subject: 'Mathematics',
            category: 'Numeracy & Core Skills',
            icon: '🔢',
            bgGradient: 'bg-amber-50/60',
            borderColor: 'border-slate-200/80',
            textColor: 'text-amber-900',
            assignedCount: 2,
            completedCount: 2,
            nextDeadline: 'Nov 14, 2026',
            tasks: [
                { id: 301, title: 'Counting Objects in the Kitchen (1 to 10)', type: 'Home Activity', dueDate: 'Nov 14, 2026', status: 'Assigned' },
                { id: 302, title: 'Basic Shape & Color Pattern Matching', type: 'Puzzle Mini-Game', dueDate: 'Nov 16, 2026', status: 'Assigned' },
                { id: 303, title: 'One-to-One Counting Practice', type: 'Interactive Task', dueDate: 'Nov 7, 2026', status: 'Submitted' },
                { id: 304, title: 'More vs. Less Quantity Comparison', type: 'Visual Worksheet', dueDate: 'Nov 4, 2026', status: 'Submitted' }
            ]
        },
        {
            id: 'makabansa',
            subject: 'Makabansa',
            category: 'Values & Community',
            icon: 'ph',
            bgGradient: 'bg-rose-50/60',
            borderColor: 'border-slate-200/80',
            textColor: 'text-rose-900',
            assignedCount: 1,
            completedCount: 2,
            nextDeadline: 'Nov 17, 2026',
            tasks: [
                { id: 401, title: 'My Family Members & Roles', type: 'Drawing Activity', dueDate: 'Nov 17, 2026', status: 'Assigned' },
                { id: 402, title: 'Understanding Daily Classroom Routines', type: 'Checklist', dueDate: 'Nov 9, 2026', status: 'Submitted' },
                { id: 403, title: 'Community Helpers Identification', type: 'Picture Match', dueDate: 'Nov 5, 2026', status: 'Submitted' }
            ]
        },
        {
            id: 'gmrc',
            subject: 'GMRC (Values Education)',
            category: 'Values & Community',
            icon: '🍃',
            bgGradient: 'bg-teal-50/60',
            borderColor: 'border-slate-200/80',
            textColor: 'text-teal-900',
            assignedCount: 0,
            completedCount: 3,
            nextDeadline: 'None',
            tasks: [
                { id: 501, title: 'Sensory Pause Breathing & Pacing', type: 'Self-Regulation Exercise', dueDate: 'Nov 11, 2026', status: 'Submitted' },
                { id: 502, title: 'Recognizing Basic Emotions (Happy/Calm)', type: 'Emotion Card Drill', dueDate: 'Nov 8, 2026', status: 'Submitted' },
                { id: 503, title: 'Sharing Toys and Taking Turns', type: 'Parent Observation', dueDate: 'Nov 4, 2026', status: 'Submitted' }
            ]
        }
    ],
    parentUser = {
        name: 'Robero Res',
        email: 'robero.res@gmail.com',
        role: 'Parent / guardian'
    }
}: HomeActivitiesProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Modal states
    const [selectedSubject, setSelectedSubject] = useState<SubjectCardItem | null>(null);
    const [taskStatusFilter, setTaskStatusFilter] = useState<string>('All');
    const [taskSubjectFilter, setTaskSubjectFilter] = useState<string>('All');

    // Feedback Modal States
    const [feedbackModalOpen, setFeedbackModalOpen] = useState<boolean>(false);
    const [activeTaskForFeedback, setActiveTaskForFeedback] = useState<{ id: number; title: string }>({ id: 0, title: '' });
    const [feedbackSuccessNotice, setFeedbackSuccessNotice] = useState<string>('');

    // Confirmation modal state for marking as submitted
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        subjectId: string;
        taskId: number;
        taskTitle: string;
    }>({
        isOpen: false,
        subjectId: '',
        taskId: 0,
        taskTitle: ''
    });

    // Local mutable state for subjects & tasks
    const [subjectList, setSubjectList] = useState<SubjectCardItem[]>(subjects);

    const executeMarkAsSubmitted = () => {
        const { subjectId, taskId } = confirmModal;
        setSubjectList(prev => prev.map(sub => {
            if (sub.id === subjectId) {
                const updatedTasks = sub.tasks.map(t => {
                    if (t.id === taskId) {
                        return { ...t, status: 'Submitted' as const };
                    }
                    return t;
                });
                
                const assignedCount = updatedTasks.filter(t => t.status === 'Assigned' || t.status === 'Missing').length;
                const completedCount = updatedTasks.filter(t => t.status === 'Submitted').length;

                const updatedSub = { ...sub, tasks: updatedTasks, assignedCount, completedCount };
                if (selectedSubject && selectedSubject.id === subjectId) {
                    setSelectedSubject(updatedSub);
                }
                return updatedSub;
            }
            return sub;
        }));
        setConfirmModal({ isOpen: false, subjectId: '', taskId: 0, taskTitle: '' });
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

    const filteredSubjects = subjectList.filter(sub => 
        sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Head title="Home Activities & Reinforcement — EduQuestAI · San Mateo Elementary School" />
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
                                <Link href="/parent/activities" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Home Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Home Activities</span>}
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
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Parent Portal / Home Activities</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <div className="relative hidden sm:block">
                                
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
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                {parentUser.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        </div>
                    </div>

                    {/* Header & Overview Card */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-2 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Home-Reinforcement Subject Dashboard</h1>
                            </div>
                            <div className="bg-emerald-50 border border-slate-200/70 px-4 py-3 rounded-xl text-center shrink-0">
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Pending Tasks</span>
                                <span className="text-2xl font-bold text-slate-900">
                                    {subjectList.reduce((acc, sub) => acc + sub.assignedCount, 0)}
                                </span>
                            </div>
                        </div>

                        {/* Subject Cards Grid */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core MATATAG Learning Areas (Click to view tasks)</h2>
                                <button 
                                    onClick={() => { setSelectedSubject({ id: 'all', subject: 'All MATATAG Subjects', category: 'Overview', icon: '🌟', bgGradient: '', borderColor: '', textColor: '', assignedCount: 0, completedCount: 0, nextDeadline: '', tasks: subjectList.flatMap(s => s.tasks) }); setTaskStatusFilter('All'); setTaskSubjectFilter('All'); }}
                                    className="text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-2xs"
                                >
                                    View All Subject Tasks
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredSubjects.length === 0 ? (
                                    <div className="col-span-full py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                        No subjects found matching your search.
                                    </div>
                                ) : (
                                    filteredSubjects.map((sub) => (
                                        <div 
                                            key={sub.id} 
                                            onClick={() => { setSelectedSubject(sub); setTaskStatusFilter('All'); setTaskSubjectFilter('All'); }}
                                            className={`p-5 rounded-2xl border ${sub.borderColor} ${sub.bgGradient} cursor-pointer hover:shadow-md transition-all space-y-4 flex flex-col justify-between`}
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <span className="text-3xl p-2.5 bg-white rounded-xl border border-slate-200/70 shadow-2xs">
                                                        {sub.icon === 'ph' ? '🇵🇭' : sub.icon}
                                                    </span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/80 border border-slate-200/60 text-slate-600">
                                                        {sub.category}
                                                    </span>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <h3 className={`font-bold text-base ${sub.textColor}`}>{sub.subject}</h3>
                                                    <p className="text-[11px] text-slate-500">Next Deadline: <span className="font-semibold text-slate-700">{sub.nextDeadline}</span></p>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-slate-900 block">{sub.assignedCount} Pending</span>
                                                    <span className="text-[10px] text-slate-500">{sub.completedCount} Completed</span>
                                                </div>
                                                <span className={`font-bold text-xs flex items-center gap-1 ${sub.textColor}`}>
                                                    View Tasks →
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </main>
            </div>

            {/* Task Details & Management Modal */}
            {selectedSubject && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                                    {selectedSubject.icon === 'ph' ? '🇵🇭' : selectedSubject.icon}
                                </span>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{selectedSubject.subject}</h3>
                                    <p className="text-xs text-slate-500">Manage assigned, submitted, and missing home tasks.</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedSubject(null)}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer shadow-2xs"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Filter Dropdowns Bar */}
                        <div className="px-6 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                            <span className="text-xs font-semibold text-slate-700">Filter Tasks:</span>
                            <div className="flex items-center gap-2.5 flex-wrap">
                                {selectedSubject.id === 'all' && (
                                    <div className="relative w-44 text-xs">
                                        <select 
                                            value={taskSubjectFilter}
                                            onChange={(e) => setTaskSubjectFilter(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer pr-8"
                                        >
                                            <option value="All">All Subjects</option>
                                            {subjectList.map(s => (
                                                <option key={s.id} value={s.subject}>{s.subject}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                        </div>
                                    </div>
                                )}

                                <div className="relative w-40 text-xs">
                                    <select 
                                        value={taskStatusFilter}
                                        onChange={(e) => setTaskStatusFilter(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="All">Status</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Missing">Missing</option>
                                    </select>
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Task List Body */}
                        <div className="p-6 overflow-y-auto space-y-3 flex-1 bg-slate-50/30">
                            {feedbackSuccessNotice && (
                                <div className="p-3 bg-emerald-50 border border-slate-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 mb-3">
                                    <span>✓</span> {feedbackSuccessNotice}
                                </div>
                            )}

                            {(() => {
                                const currentTasksToFilter = selectedSubject.id === 'all' 
                                    ? subjectList.flatMap(sub => sub.tasks.map(t => ({ ...t, parentSubject: sub.subject, subjectId: sub.id })))
                                    : selectedSubject.tasks.map(t => ({ ...t, parentSubject: selectedSubject.subject, subjectId: selectedSubject.id }));

                                const filteredTasks = currentTasksToFilter.filter(t => {
                                    const matchesStatus = taskStatusFilter === 'All' || t.status === taskStatusFilter;
                                    const matchesSubject = taskSubjectFilter === 'All' || t.parentSubject === taskSubjectFilter;
                                    return matchesStatus && matchesSubject;
                                });

                                if (filteredTasks.length === 0) {
                                    return (
                                        <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl bg-white">
                                            No tasks found matching your filter criteria.
                                        </div>
                                    );
                                }

                                return filteredTasks.map((task) => (
                                    <div key={task.id} className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                                        <div className="space-y-1 min-w-0">
                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                <span className="font-bold text-slate-900 text-xs sm:text-sm">{task.title}</span>
                                                {selectedSubject.id === 'all' && (
                                                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-slate-200 px-2 py-0.5 rounded">
                                                        {task.parentSubject}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                                                    {task.type}
                                                </span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 block">Due Date: {task.dueDate}</span>
                                        </div>

                                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto flex-wrap">
                                            {task.status === 'Submitted' ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-md border bg-emerald-50 text-emerald-800 border-slate-200">
                                                        Submitted ✓
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            setActiveTaskForFeedback({ id: task.id, title: task.title });
                                                            setFeedbackModalOpen(true);
                                                        }}
                                                        className="px-3.5 py-1.5 rounded-lg bg-[#4B8B6B] hover:bg-[#3d7255] border border-slate-100 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                                                    >
                                                        Add Feedback
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmModal({
                                                        isOpen: true,
                                                        subjectId: task.subjectId,
                                                        taskId: task.id,
                                                        taskTitle: task.title
                                                    })}
                                                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer shadow-2xs"
                                                >
                                                    Mark as Submitted
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-white border-t border-slate-100 flex justify-end">
                            <button 
                                onClick={() => setSelectedSubject(null)}
                                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-slate-100 text-white text-xs font-bold cursor-pointer transition-all shadow-sm"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Prompt for Manual Marking */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md p-6 space-y-4">
                        <div className="space-y-1.5">
                            <h3 className="text-base font-bold text-slate-900">Mark Task as Submitted</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Are you sure you want to lock <span className="font-bold text-slate-800">"{confirmModal.taskTitle}"</span> as submitted? Once submitted, this status will be finalized.
                            </p>
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button 
                                onClick={() => setConfirmModal({ isOpen: false, subjectId: '', taskId: 0, taskTitle: '' })}
                                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeMarkAsSubmitted}
                                className="px-4 py-2 rounded-xl bg-[#4B8B6B] hover:bg-[#3d7255] text-white text-xs font-bold cursor-pointer transition-all shadow-xs"
                            >
                                Yes, Mark as Submitted
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Controlled Activity Feedback Pop-up Modal */}
            {feedbackModalOpen && (
                <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-fadeIn">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 space-y-4 relative">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-bold text-slate-900">Activity Feedback</h3>
                                <p className="text-xs text-slate-500">Share telemetry observations for Teacher Mara.</p>
                            </div>
                            <button 
                                onClick={() => setFeedbackModalOpen(false)}
                                className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <ActivityFeedbackCard 
                            activityTitle={activeTaskForFeedback.title}
                            onSubmitted={(feedback) => {
                                console.log('Feedback submitted:', feedback);
                                setFeedbackModalOpen(false);
                                setFeedbackSuccessNotice('✓ Thank you! Activity feedback successfully sent to Teacher Mara.');
                                setTimeout(() => setFeedbackSuccessNotice(''), 5000);
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
}