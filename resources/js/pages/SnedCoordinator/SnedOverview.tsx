import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface ValidationQueueItem {
    id: number;
    lesson: string;
    teacher: string;
    status: 'Needs review' | 'Updated' | 'Approved';
}

interface SubjectMilestone {
    subject: string;
    completed: number;
    total: number;
    masteryPercentage: number;
}

interface StudentInclusionRecord {
    id: number;
    name: string;
    section: string;
    condition: string;
    iepStatus: 'Compliant' | 'Review Needed' | 'Pending Update';
    sensoryPausesToday: number;
    readingPace: string;
    audioEngagement: string;
}

interface SnedOverviewProps {
    notifications?: NotificationItem[];
    students?: StudentInclusionRecord[];
    pendingValidation?: ValidationQueueItem[];
    milestones?: SubjectMilestone[];
    user?: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

export default function SnedOverview({ notifications = [], students = [], pendingValidation = [], milestones = [], user }: SnedOverviewProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<number>(1);

    // Filter state for Subject Milestones (Default is 'General' with percentage included)
    const [milestoneViewMode, setMilestoneViewMode] = useState<'General' | 'Proficiency'>('General');

    const inclusionRecords: StudentInclusionRecord[] = students.length > 0 ? students : [
        { id: 1, name: 'Leonardo R. Cruz', section: 'Grade 1 — Section 1', condition: 'Mild ASD', iepStatus: 'Compliant', sensoryPausesToday: 3, readingPace: '1.2x (Assisted)', audioEngagement: '85%' },
        { id: 2, name: 'Chloe Samantha Tan', section: 'Grade 1 — Section 2', condition: 'ADHD', iepStatus: 'Review Needed', sensoryPausesToday: 6, readingPace: '1.0x (Standard)', audioEngagement: '92%' },
        { id: 3, name: 'Marcus Aurelius Lim', section: 'Grade 1 — Section 1', condition: 'Mild ASD', iepStatus: 'Compliant', sensoryPausesToday: 1, readingPace: '1.5x (Bionic)', audioEngagement: '78%' },
    ];

    const queueItems: ValidationQueueItem[] = pendingValidation.length > 0 ? pendingValidation : [
        { id: 1, lesson: 'Counting to 5', teacher: 'Teacher Ana', status: 'Needs review' },
        { id: 2, lesson: 'Letter sounds', teacher: 'Teacher Ben', status: 'Needs review' },
        { id: 3, lesson: 'Plant parts', teacher: 'Teacher Ana', status: 'Updated' },
    ];

    const subjectProgress: SubjectMilestone[] = milestones.length > 0 ? milestones : [
        { subject: 'Math', completed: 4, total: 5, masteryPercentage: 88 },
        { subject: 'Reading', completed: 3, total: 5, masteryPercentage: 82 },
        { subject: 'Science', completed: 4, total: 5, masteryPercentage: 90 },
        { subject: 'Filipino', completed: 2, total: 5, masteryPercentage: 75 },
    ];

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

    const [notifList, setNotifList] = useState<NotificationItem[]>(notifications.length > 0 ? notifications : [
        { id: 1, text: 'Student Chloe Tan exceeded sensory pause threshold (6 today)', time: '10m ago', unread: true, link: '/sned-coordinator/overview' }
    ]);

    const unreadCount = notifList.length;

    const handleReviewSelected = () => {
        router.visit('/sned-coordinator/validation-queue');
    };

    return (
        <>
            <Head title="Validation and learner trends — SNED Portal"/>
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
                                <Link href="/sned-coordinator/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Overview">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
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
                                <Link href="/sned-coordinator/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
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
                            <span className="text-xs font-semibold text-slate-500 truncate">SNED Portal / Overview & Telemetry</span>
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
                                                        onClick={() => router.visit(n.link)}
                                                        className="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-2.5"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 mt-1 shrink-0"></span>
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
                                <span>ER</span>
                            </div>
                        </div>
                    </div>

                    {/* Wrapped Text Card Header & 4 Metric Cards Banner */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-5">
                        <div className="space-y-1">
                            <h1 className="text-sm font-bold text-slate-900">Validation and learner trends</h1>
                            <p className="text-[11px] text-slate-500">Review adapted lessons, milestone patterns, and follow-up needs.</p>
                        </div>

                        {/* Line Divider */}
                        <hr className="border-slate-200/70 my-3" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                            <div className="bg-[#FFF8F0] p-4 rounded-xl border border-slate-200/60 shadow-2xs space-y-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Awaiting validation</span>
                                <div className="text-lg font-extrabold text-slate-900">6</div>
                                <span className="text-[10px] text-slate-500 font-medium block">Across 3 teachers</span>
                            </div>
                            <div className="bg-slate-50/60 p-4 rounded-xl border border-slate-200/70 shadow-2xs space-y-1">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Milestones met</span>
                                <div className="text-lg font-extrabold text-slate-900">82%</div>
                                <span className="text-[10px] text-slate-400 font-medium block">Across active learning plans</span>
                            </div>
                            <div className="bg-[#EBF5EE] p-4 rounded-xl border border-emerald-200/60 shadow-2xs space-y-1">
                                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">ILP progress</span>
                                <div className="text-lg font-extrabold text-emerald-950">74%</div>
                                <span className="text-[10px] text-emerald-800 font-medium block">Updated this term</span>
                            </div>
                            <div className="bg-[#F3F0F8] p-4 rounded-xl border border-purple-200/60 shadow-2xs space-y-1">
                                <span className="text-[10px] font-bold text-purple-900 uppercase tracking-wider block">Needs follow-up</span>
                                <div className="text-lg font-extrabold text-purple-950">3</div>
                                <span className="text-[10px] text-purple-800 font-medium block">Learners flagged</span>
                            </div>
                        </div>
                    </div>

                    {/* Two-Column Layout: Validation queue & Subject milestones */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Left Column (2 span): Validation Queue table view with line divider */}
                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Validation queue</h2>
                                <hr className="border-slate-200/70 my-2" />
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                                                <th className="pb-3 pl-2">Lesson</th>
                                                <th className="pb-3">Teacher</th>
                                                <th className="pb-3">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {queueItems.map(item => (
                                                <tr 
                                                    key={item.id} 
                                                    onClick={() => setSelectedLessonId(item.id)}
                                                    className={`cursor-pointer transition-all ${
                                                        selectedLessonId === item.id ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <td className="py-3.5 pl-2 font-bold text-slate-900 flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${selectedLessonId === item.id ? 'bg-[#4B8B6B]' : 'bg-transparent'}`} />
                                                        {item.lesson}
                                                    </td>
                                                    <td className="py-3.5 text-slate-600 font-medium">{item.teacher}</td>
                                                    <td className="py-3.5">
                                                        <span className={`text-[11px] font-semibold ${
                                                            item.status === 'Needs review' ? 'text-amber-500' : 'text-emerald-700'
                                                        }`}>
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="pt-2">
                                <button 
                                    onClick={handleReviewSelected}
                                    className="w-full sm:w-auto px-6 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-xl transition-all shadow-sm cursor-pointer text-center"
                                >
                                    Review selected lesson
                                </button>
                            </div>
                        </div>

                        {/* Right Column (1 span): Subject Milestones with Filter & Line Divider */}
                        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Subject milestones</h2>
                                <select 
                                    value={milestoneViewMode}
                                    onChange={(e) => setMilestoneViewMode(e.target.value as 'General' | 'Proficiency')}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                                >
                                    <option value="General">View: General (%)</option>
                                    <option value="Proficiency">View: Mastery Rate</option>
                                </select>
                            </div>

                            <hr className="border-slate-200/70 my-2" />

                            <div className="space-y-4 pt-1">
                                {subjectProgress.map((prog, idx) => {
                                    const progressPercentage = Math.round((prog.completed / prog.total) * 100);
                                    return (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-bold text-slate-800">{prog.subject}</span>
                                                <span className="text-slate-500 font-semibold">
                                                    {milestoneViewMode === 'General' 
                                                        ? `${prog.completed} / ${prog.total} (${progressPercentage}%)` 
                                                        : `${prog.masteryPercentage}% Mastery Efficiency`}
                                                </span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div 
                                                    className="bg-[#4B8B6B] h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${milestoneViewMode === 'General' ? progressPercentage : prog.masteryPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* Active IEP & Real-Time Telemetry Table */}
                    <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200/70 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active IEP & Real-Time Telemetry Logs</h2>
                            <span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary School · Inclusion Wing</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-200/70 text-[10px]">
                                    <tr>
                                        <th className="p-3.5 pl-5">Student Name</th>
                                        <th className="p-3.5">Section</th>
                                        <th className="p-3.5">Condition</th>
                                        <th className="p-3.5">IEP Status</th>
                                        <th className="p-3.5">Sensory Pauses</th>
                                        <th className="p-3.5">Audio & Reading Engagement</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {inclusionRecords.map(student => (
                                        <tr key={student.id} className="hover:bg-slate-50/60 transition-all">
                                            <td className="p-3.5 pl-5 font-bold text-slate-900">{student.name}</td>
                                            <td className="p-3.5 text-slate-600">{student.section}</td>
                                            <td className="p-3.5">
                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 font-semibold text-[10px] rounded-full border border-emerald-200/50">
                                                    {student.condition}
                                                </span>
                                            </td>
                                            <td className="p-3.5">
                                                <span className={`px-2 py-0.5 font-semibold text-[10px] rounded-full ${
                                                    student.iepStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {student.iepStatus}
                                                </span>
                                            </td>
                                            <td className="p-3.5 font-bold text-slate-800">{student.sensoryPausesToday} triggers</td>
                                            <td className="p-3.5 text-slate-600">{student.audioEngagement} engagement ({student.readingPace})</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </main>
            </div>
        </>
    );
}