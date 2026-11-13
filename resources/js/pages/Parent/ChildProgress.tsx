import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface MasterySubItem {
    skillName: string;
    percentage: number;
    status: 'Mastered' | 'In Progress' | 'Needs Reinforcement';
}

interface SkillLevel {
    levelName: string; // e.g., "Level 1", "Level 2"
    levelDescription: string;
    levelPercent: number;
    breakdown: MasterySubItem[];
}

interface MatatagSubjectWithLevels {
    subject: string;
    overallPercent: number;
    levels: SkillLevel[];
}

interface BadgeItem {
    id: number;
    title: string;
    description: string;
    dateEarned: string;
    iconText: string;
}

interface ChildProgressProps {
    notifications?: NotificationItem[];
    child?: {
        name: string;
        gradeSection: string;
        overallMastery: number;
    };
    subjects?: MatatagSubjectWithLevels[];
    badges?: BadgeItem[];
    parentUser?: {
        name: string;
        email: string;
        role: string;
    };
}

export default function ChildProgress({ 
    notifications = [], 
    child = {
        name: 'Alex Reyes',
        gradeSection: 'Grade 1 SNED · Section 1',
        overallMastery: 79
    },
    subjects = [
        {
            subject: 'Language',
            overallPercent: 82,
            levels: [
                {
                    levelName: 'Level 1',
                    levelDescription: 'Basic Sound & Word Association',
                    levelPercent: 80,
                    breakdown: [
                        { skillName: 'Basic Sound Recognition', percentage: 85, status: 'Mastered' },
                        { skillName: 'Following Simple Directions', percentage: 78, status: 'Mastered' },
                        { skillName: 'Expressing Basic Needs', percentage: 77, status: 'In Progress' }
                    ]
                },
                {
                    levelName: 'Level 2',
                    levelDescription: 'Expressive Communication & Vocabulary',
                    levelPercent: 84,
                    breakdown: [
                        { skillName: 'Oral Vocabulary & Vocabulary Expansion', percentage: 85, status: 'Mastered' },
                        { skillName: 'Following Simple 1-2 Step Instructions', percentage: 80, status: 'Mastered' },
                        { skillName: 'Expressing Needs & Sensory Preferences', percentage: 87, status: 'In Progress' }
                    ]
                }
            ]
        },
        {
            subject: 'Reading and Literacy',
            overallPercent: 85,
            levels: [
                {
                    levelName: 'Level 1',
                    levelDescription: 'Alphabet Recognition & Letter Sounds',
                    levelPercent: 88,
                    breakdown: [
                        { skillName: 'Letter Identification & Alphabetic Principle', percentage: 92, status: 'Mastered' },
                        { skillName: 'Basic Sight Words Recognition', percentage: 85, status: 'Mastered' }
                    ]
                },
                {
                    levelName: 'Level 2',
                    levelDescription: 'Phonics & Sight Word Recognition',
                    levelPercent: 82,
                    breakdown: [
                        { skillName: 'Phonetic Sound Matching & Blending', percentage: 84, status: 'Mastered' },
                        { skillName: 'Audio-Assisted Story Comprehension (TTS)', percentage: 81, status: 'In Progress' }
                    ]
                }
            ]
        },
        {
            subject: 'Mathematics',
            overallPercent: 74,
            levels: [
                {
                    levelName: 'Level 1',
                    levelDescription: 'Number Sense & Pattern Recognition',
                    levelPercent: 74,
                    breakdown: [
                        { skillName: 'Rote & One-to-One Counting (1 to 20)', percentage: 80, status: 'Mastered' },
                        { skillName: 'Basic Shape & Color Pattern Matching', percentage: 75, status: 'In Progress' },
                        { skillName: 'Simple Quantity Comparison (More/Less)', percentage: 67, status: 'Needs Reinforcement' }
                    ]
                },
                {
                    levelName: 'Level 2',
                    levelDescription: 'Simple Addition & Measurement',
                    levelPercent: 72,
                    breakdown: [
                        { skillName: 'Single Digit Addition Visual Puzzles', percentage: 74, status: 'In Progress' },
                        { skillName: 'Basic Size & Length Comparison', percentage: 70, status: 'In Progress' }
                    ]
                }
            ]
        },
        {
            subject: 'Makabansa',
            overallPercent: 78,
            levels: [
                {
                    levelName: 'Level 1',
                    levelDescription: 'Self, Family, and Immediate Community',
                    levelPercent: 78,
                    breakdown: [
                        { skillName: 'Personal Identity & Family Recognition', percentage: 85, status: 'Mastered' },
                        { skillName: 'Understanding Daily Classroom Routines', percentage: 78, status: 'In Progress' },
                        { skillName: 'Community Helpers & Roles Identification', percentage: 71, status: 'In Progress' }
                    ]
                }
            ]
        },
        {
            subject: 'GMRC (Values Education)',
            overallPercent: 88,
            levels: [
                {
                    levelName: 'Level 1',
                    levelDescription: 'Basic Emotional Awareness',
                    levelPercent: 85,
                    breakdown: [
                        { skillName: 'Recognizing Basic Emotions (Happy, Calm, Frustrated)', percentage: 85, status: 'Mastered' }
                    ]
                },
                {
                    levelName: 'Level 2',
                    levelDescription: 'Emotional Regulation & Peer Respect',
                    levelPercent: 90,
                    breakdown: [
                        { skillName: 'Self-Regulation & Sensory Pause Management', percentage: 92, status: 'Mastered' },
                        { skillName: 'Showing Respect & Sharing with Classmates', percentage: 88, status: 'Mastered' }
                    ]
                }
            ]
        }
    ],
    badges = [
        { id: 1, title: 'Phonics Star', description: 'Correctly identified phonetic sound matches using low-stimulation reading mode.', dateEarned: 'Nov 10, 2026', iconText: '⭐' },
        { id: 2, title: 'Sensory Calm Champion', description: 'Successfully utilized the Sensory Pause tool to self-regulate during interactive mini-games.', dateEarned: 'Nov 8, 2026', iconText: '🍃' },
        { id: 3, title: 'Counting Explorer', description: 'Completed all basic number sequencing puzzles for Section 1 Mathematics.', dateEarned: 'Nov 5, 2026', iconText: '🔢' }
    ],
    parentUser = {
        name: 'Roberto Reyes',
        email: 'roberto.reyes@gmail.com',
        role: 'Parent / guardian'
    }
}: ChildProgressProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Level Filter State ('All', 'Level 1', 'Level 2', etc.)
    const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('All');

    // Track expanded state of subjects
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({
        'Reading and Literacy': false
    });

    const toggleSubject = (subjectName: string) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectName]: !prev[subjectName]
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

    // Filter subjects by search and filter levels
    const filteredSubjects = subjects.map(sub => {
        const filteredLevels = sub.levels.filter(lvl => 
            selectedLevelFilter === 'All' || lvl.levelName === selectedLevelFilter
        );
        return {
            ...sub,
            levels: filteredLevels
        };
    }).filter(sub => sub.levels.length > 0);

    return (
        <>
            <Head title="Child Progress & MATATAG Curriculum Analytics — EduQuestAI · San Mateo Elementary School" />
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
                                <Link href="/parent/progress" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Child Progress">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Child Progress</span>}
                                </Link>
                                <Link href="/parent/activities" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Home Activities">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Home Activities</span>}
                                </Link>
                                <Link href="/parent/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
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
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 max-w-7xl mx-auto space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Logistical Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Child Progress / MATATAG Curriculum</span>
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

                    {/* Header & Overall Mastery Card */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-4 sm:p-5 space-y-6 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">MATATAG Curriculum Progress & Analytics</h1>
                            </div>
                            <div className="bg-emerald-50 border border-slate-200/70 px-4 py-3 rounded-xl text-center shrink-0">
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Overall Mastery</span>
                                <span className="text-2xl font-bold text-slate-900">{child.overallMastery}%</span>
                            </div>
                        </div>
                    </div>

                    {/* MATATAG 5 Subjects Collapsible Accordion List (With Level Filter inside the Card Header) */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-4 shadow-sm w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Core MATATAG Learning Areas (Click to Expand Sub-Skills)</h2>
                            
                            {/* Filter curriculum view by level dropdown cleanly integrated here */}
                            <div className="flex items-center gap-2.5">
                                <span className="text-xs font-semibold text-slate-600">Filter curriculum view by level:</span>
                                <div className="relative w-40 text-xs">
                                    <select 
                                        value={selectedLevelFilter}
                                        onChange={(e) => setSelectedLevelFilter(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-400 appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="All">All Levels</option>
                                        <option value="Level 1">Level 1</option>
                                        <option value="Level 2">Level 2</option>
                                    </select>
                                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M19 9l-7 7-7-7"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-1">
                            {filteredSubjects.length === 0 ? (
                                <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                    No MATATAG subjects found matching your search or selected level filter.
                                </div>
                            ) : (
                                filteredSubjects.map((sub, idx) => {
                                    const isExpanded = !!expandedSubjects[sub.subject];
                                    return (
                                        <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs transition-all">
                                            {/* Clickable Header Row */}
                                            <div 
                                                onClick={() => toggleSubject(sub.subject)}
                                                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/60 transition-all select-none"
                                            >
                                                <div className="space-y-0.5 min-w-0">
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="font-bold text-slate-900 text-sm sm:text-base">{sub.subject}</span>
                                                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-slate-200/60 px-2 py-0.5 rounded-md">
                                                            {sub.overallPercent}% Mastery
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-500 block text-[11px] font-medium truncate">
                                                        {sub.levels.map(l => l.levelName).join(' & ')} Available
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 justify-between sm:justify-end">
                                                    <div className="w-24 sm:w-32 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div 
                                                            className="bg-[#4B8B6B] h-full rounded-full transition-all duration-500" 
                                                            style={{ width: `${sub.overallPercent}%` }}
                                                        ></div>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                                        <span>{isExpanded ? 'Hide levels' : 'View levels'}</span>
                                                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Collapsible Levels & Sub-Skill Breakdown Accordion Body */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 bg-slate-50/50 border-t border-slate-100 space-y-4 animate-fadeIn">
                                                    {sub.levels.map((lvl, lIdx) => (
                                                        <div key={lIdx} className="space-y-2 pt-3 first:pt-2">
                                                            <div className="flex items-center justify-between">
                                                                <div>
                                                                    <span className="text-xs font-bold text-slate-900">{lvl.levelName}: </span>
                                                                    <span className="text-[11px] font-medium text-slate-600">{lvl.levelDescription}</span>
                                                                </div>
                                                                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded">
                                                                    {lvl.levelPercent}% Level Mastery
                                                                </span>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                {lvl.breakdown.map((item, i) => (
                                                                    <div key={i} className="bg-white border border-slate-200/70 rounded-xl p-3 space-y-2 shadow-2xs">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <span className="text-[11px] font-semibold text-slate-800 leading-snug">{item.skillName}</span>
                                                                            <span className="text-[11px] font-bold text-slate-900 shrink-0">{item.percentage}%</span>
                                                                        </div>
                                                                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                                            <div 
                                                                                className={`h-full rounded-full ${
                                                                                    item.status === 'Mastered' ? 'bg-emerald-600' :
                                                                                    item.status === 'In Progress' ? 'bg-sky-600' : 'bg-amber-500'
                                                                                }`} 
                                                                                style={{ width: `${item.percentage}%` }}
                                                                            ></div>
                                                                        </div>
                                                                        <div className="flex items-center justify-between text-[10px]">
                                                                            <span className="text-slate-400">Status:</span>
                                                                            <span className={`font-semibold ${
                                                                                item.status === 'Mastered' ? 'text-emerald-700' :
                                                                                item.status === 'In Progress' ? 'text-sky-700' : 'text-amber-700'
                                                                            }`}>{item.status}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Gamified Rewards & Badges Ledger */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 sm:p-8 space-y-6 shadow-sm w-full">
                        <div className="border-b border-slate-100 pb-3">
                            <h2 className="text-sm font-bold text-slate-900">Gamified rewards & badges ledger</h2>
                            <p className="text-[11px] text-slate-500 mt-0.5">Milestones and reward badges unlocked during interactive mini-games.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {badges.map((badge) => (
                                <div key={badge.id} className="p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl space-y-2.5 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl p-2 bg-white rounded-lg border border-slate-200 shadow-2xs">{badge.iconText}</span>
                                        <span className="text-[10px] text-slate-400 font-medium">{badge.dateEarned}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-bold text-slate-900">{badge.title}</h3>
                                        <p className="text-[11px] text-slate-600 leading-relaxed">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
                
            </div>
        </>
    );
}