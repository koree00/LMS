import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface InterventionLog {
    id: number;
    studentId: number;
    studentName: string;
    section: string;
    flagType: string;
    severity: 'High' | 'Medium' | 'Low';
    triggerCount: number;
    recommendedAction: string;
    status: 'Pending Review' | 'Adjusted & Resolved';
    date: string;
}

interface SnedInterventionLogsProps {
    notifications?: NotificationItem[];
    logs?: InterventionLog[];
}

export default function SnedInterventionLogs({ notifications = [], logs = [] }: SnedInterventionLogsProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Section Selection State (null means showing section cards overview)
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    // Filtering states inside the selected section pool
    const [activeTab, setActiveTab] = useState<'All' | 'Pending Review' | 'Adjusted & Resolved'>('Pending Review');
    const [severityFilter, setSeverityFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Modal States for Custom Pop-ups
    const [selectedLogForAction, setSelectedLogForAction] = useState<InterventionLog | null>(null);
    const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);

    // Manual adjustment form fields
    const [manualAudioVolume, setManualAudioVolume] = useState<string>('Medium (60%)');
    const [manualReadingPacing, setManualReadingPacing] = useState<string>('1.2x Bionic Pacing');
    const [manualSingleColumn, setManualSingleColumn] = useState<boolean>(true);
    const [manualCoordinatorNotes, setManualCoordinatorNotes] = useState<string>('');

    const [interventionLogs, setInterventionLogs] = useState<InterventionLog[]>(logs.length > 0 ? logs : [
        {
            id: 1,
            studentId: 2,
            studentName: 'Chloe Samantha Tan',
            section: 'Grade 1 — Section 2',
            flagType: 'Exceeded Sensory Pause Threshold (6 pauses)',
            severity: 'High',
            triggerCount: 6,
            recommendedAction: 'Reduce audio volume intensity and enable simplified single-column pastel card view.',
            status: 'Pending Review',
            date: 'Today, 11:15 AM'
        },
        {
            id: 2,
            studentId: 1,
            studentName: 'Ronardo R. Cra',
            section: 'Grade 1 — Section 1',
            flagType: 'Milestone Progression Reached (Reading Comprehension Tier 1)',
            severity: 'Low',
            triggerCount: 1,
            recommendedAction: 'Advance bionic reading pace slider to intermediate level.',
            status: 'Adjusted & Resolved',
            date: 'Yesterday, 3:20 PM'
        },
        {
            id: 3,
            studentId: 3,
            studentName: 'Marcus Aurelius Lim',
            section: 'Grade 1 — Section 1',
            flagType: 'Repeated Audio Prompt Replay (5+ replays)',
            severity: 'Medium',
            triggerCount: 5,
            recommendedAction: 'Verify headphone volume settings and check for auditory processing friction.',
            status: 'Pending Review',
            date: 'Today, 8:40 AM'
        }
    ]);

    // Handle direct application of recommended settings
    const handleApplyRecommendationDirectly = () => {
        if (!selectedLogForAction) return;
        setInterventionLogs(prev => prev.map(item => item.id === selectedLogForAction.id ? { ...item, status: 'Adjusted & Resolved' } : item));
        setSelectedLogForAction(null);
    };

    // Handle saving manual adjustments
    const handleSaveManualAdjustment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLogForAction) return;
        setInterventionLogs(prev => prev.map(item => item.id === selectedLogForAction.id ? { ...item, status: 'Adjusted & Resolved' } : item));
        setIsManualModalOpen(false);
        setSelectedLogForAction(null);
        setManualCoordinatorNotes('');
    };

    const handleRedirectToStudentPool = (studentId: number) => {
        router.visit(`/sned-coordinator/learners?student_id=${studentId}`);
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

    const [notifList, setNotifList] = useState<NotificationItem[]>(notifications.length > 0 ? notifications : [
        { id: 1, text: 'Automated flag: Chloe Tan exceeded pause limit', time: '10m ago', unread: true, link: '/sned-coordinator/intervention-logs' }
    ]);

    const unreadCount = notifList.length;

    // Extract unique sections dynamically from logs
    const availableSections = Array.from(new Set(interventionLogs.map(log => log.section)));

    // Filtered logs calculation for when a section is chosen
    const filteredLogs = interventionLogs.filter(log => {
        const matchesSection = selectedSection ? log.section === selectedSection : true;
        const matchesTab = activeTab === 'All' || log.status === activeTab;
        const matchesSeverity = severityFilter === 'All' || log.severity === severityFilter;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            log.studentName.toLowerCase().includes(q) || 
            log.flagType.toLowerCase().includes(q);
        return matchesSection && matchesTab && matchesSeverity && matchesSearch;
    });

    const totalPendingCount = interventionLogs.filter(i => i.status === 'Pending Review').length;

    return (
        <>
            <Head title="Intervention & Flag Management · SNED Portal"/>
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
                                <Link href="/sned-coordinator/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
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
                                <Link href="/sned-coordinator/intervention-logs" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Intervention & Flags">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">SNED Portal / Intervention & Flag Management</span>
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

                    {/* STAGE 1: SECTION SELECTION CARDS */}
                    {!selectedSection && (
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-sm font-bold text-slate-900">Behavioral Telemetry & Automated Alert Flags</h1>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Select a class section below to review pending intervention flags and learner telemetry.</p>
                                </div>
                                <span className="px-3 py-1 bg-amber-50 text-slate border border-slate-200/60 font-bold text-xs rounded-full">
                                    {totalPendingCount} Total Pending Review
                                </span>
                            </div>

                            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">Select Class Section</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableSections.map(sectionName => {
                                    const sectionLogs = interventionLogs.filter(l => l.section === sectionName);
                                    const pendingInSec = sectionLogs.filter(l => l.status === 'Pending Review').length;
                                    const highCount = sectionLogs.filter(l => l.severity === 'High' && l.status === 'Pending Review').length;
                                    const medCount = sectionLogs.filter(l => l.severity === 'Medium' && l.status === 'Pending Review').length;
                                    const lowCount = sectionLogs.filter(l => l.severity === 'Low' && l.status === 'Pending Review').length;

                                    return (
                                        <div 
                                            key={sectionName}
                                            onClick={() => setSelectedSection(sectionName)}
                                            className="bg-white p-6 rounded-2xl border border-slate-200/70 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer space-y-4 group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 border border-slate-200/60 flex items-center justify-center font-bold text-xs group-hover:bg-[#4B8B6B] group-hover:text-white transition-all">
                                                        🏫
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#4B8B6B] transition-all">{sectionName}</h3>
                                                        <span className="text-[10px] text-slate-400">{sectionLogs.length} total logged entries</span>
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                    pendingInSec > 0 ? 'bg-amber-100 text-slate' : 'bg-slate-100 text-emerald-800'
                                                }`}>
                                                    {pendingInSec} Pending
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                                                <div className="bg-rose-50/60 border border-slate-200/50 rounded-xl p-2">
                                                    <span className="text-[9px] font-bold text-rose-700 uppercase block">High Priority</span>
                                                    <span className="text-sm font-extrabold text-rose-900">{highCount}</span>
                                                </div>
                                                <div className="bg-amber-50/60 border border-slate-200/50 rounded-xl p-2">
                                                    <span className="text-[9px] font-bold text-slate-700 uppercase block">Medium</span>
                                                    <span className="text-sm font-extrabold text-slate-900">{medCount}</span>
                                                </div>
                                                <div className="bg-emerald-50/60 border border-slate-200/50 rounded-xl p-2">
                                                    <span className="text-[9px] font-bold text-emerald-700 uppercase block">Low</span>
                                                    <span className="text-sm font-extrabold text-emerald-900">{lowCount}</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-1">
                                                <span className="text-[11px] font-semibold text-[#4B8B6B] group-hover:underline">View Section Pool →</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STAGE 2: SECTION POOL & FILTERED ENTRIES */}
                    {selectedSection && (
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setSelectedSection(null)}
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            ← Back
                                        </button>
                                        <div>
                                            <h1 className="text-sm font-bold text-slate-900">{selectedSection} — Active Flag Pool</h1>
                                            <p className="text-[11px] text-slate-500">Showing intervention records for this specific section.</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-slate-200 font-semibold text-xs rounded-full">
                                        {filteredLogs.length} Entries Matching Filter
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div className="sm:col-span-2 relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                        </span>
                                        <input 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by student name or flag description..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                    <div>
                                        <select 
                                            value={severityFilter}
                                            onChange={(e) => setSeverityFilter(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                        >
                                            <option value="All">Severity: All Levels</option>
                                            <option value="High">High Priority ⚠️</option>
                                            <option value="Medium">Medium Priority ⚡</option>
                                            <option value="Low">Low Priority ✓</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                                    <button
                                        onClick={() => setActiveTab('Pending Review')}
                                        className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                                            activeTab === 'Pending Review' 
                                                ? 'bg-[#4B8B6B] text-white shadow-sm' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                                        }`}
                                    >
                                        Pending Review
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('Adjusted & Resolved')}
                                        className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                                            activeTab === 'Adjusted & Resolved' 
                                                ? 'bg-[#4B8B6B] text-white shadow-sm' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                                        }`}
                                    >
                                        Resolved
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('All')}
                                        className={`px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer ${
                                            activeTab === 'All' 
                                                ? 'bg-[#4B8B6B] text-white shadow-sm' 
                                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
                                        }`}
                                    >
                                        All Logs
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {filteredLogs.length === 0 ? (
                                    <div className="bg-white p-10 rounded-2xl border border-slate-200/70 text-center text-slate-400 text-xs">
                                        No intervention logs found matching your criteria in {selectedSection}.
                                    </div>
                                ) : (
                                    filteredLogs.map(log => (
                                        <div key={log.id} className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center border shrink-0 ${
                                                        log.severity === 'High' ? 'bg-rose-100 text-rose-900 border-slate-200' :
                                                        log.severity === 'Medium' ? 'bg-amber-100 text-slate-900 border-slate-200' :
                                                        'bg-emerald-100 text-emerald-900 border-slate-200'
                                                    }`}>
                                                        {log.severity === 'High' ? '⚠️' : log.severity === 'Medium' ? '⚡' : '✓'}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => handleRedirectToStudentPool(log.studentId)}
                                                                className="text-xs font-bold text-slate-900 hover:text-[#4B8B6B] hover:underline transition-all cursor-pointer text-left"
                                                                title="View student profile in student pool"
                                                            >
                                                                {log.studentName} ↗
                                                            </button>
                                                            <span className="text-[10px] text-slate-500 font-medium">({log.section})</span>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400">{log.date}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        log.severity === 'High' ? 'bg-rose-50 text-rose-700 border border-slate-200/60' :
                                                        log.severity === 'Medium' ? 'bg-amber-50 text-slate-700 border border-slate-200/60' :
                                                        'bg-emerald-50 text-emerald-700 border border-slate-200/60'
                                                    }`}>
                                                        {log.severity} Priority
                                                    </span>
                                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                        log.status === 'Pending Review' ? 'bg-amber-100 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {log.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <span className="text-xs font-bold text-slate-800 block">{log.flagType}</span>
                                                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                                    <strong>Recommended Adjustment:</strong> {log.recommendedAction}
                                                </p>
                                            </div>

                                            {log.status === 'Pending Review' && (
                                                <div className="flex justify-end pt-2 border-t border-slate-100">
                                                    <button 
                                                        onClick={() => setSelectedLogForAction(log)}
                                                        className="px-5 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-xl transition-all shadow-sm cursor-pointer"
                                                    >
                                                        Apply Recommendation & Resolve
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* POP-UP 1: CHOOSING BETWEEN IMMEDIATE APPLY OR MANUAL ADJUSTMENT */}
            {selectedLogForAction && !isManualModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Intervention Action — {selectedLogForAction.studentName}</h3>
                            <button 
                                onClick={() => setSelectedLogForAction(null)}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <div className="space-y-3 text-xs">
                            <p className="text-slate-600 leading-relaxed">
                                You are about to review the intervention flag for <strong className="text-slate-900">{selectedLogForAction.studentName}</strong>. How would you like to proceed with the recommendation?
                            </p>
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-slate-700">
                                <strong>System Recommendation:</strong> {selectedLogForAction.recommendedAction}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
    <button 
        onClick={() => setSelectedLogForAction(null)}
        className="w-full sm:flex-1 h-10 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap"
    >
        Cancel
    </button>
    <button 
        onClick={() => setIsManualModalOpen(true)}
        className="w-full sm:flex-1 h-10 px-4 bg-amber-50 hover:bg-amber-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200/60 transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap overflow-hidden text-ellipsis"
    >
        Manually Adjust
    </button>
    <button 
        onClick={handleApplyRecommendationDirectly}
        className="w-full sm:flex-1 h-10 px-4 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center text-center whitespace-nowrap"
    >
        Apply Immediately
    </button>
</div>
                    </div>
                </div>
            )}

            {/* POP-UP 2: MANUAL ADJUSTMENT FORM MODAL */}
            {isManualModalOpen && selectedLogForAction && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Manual Intervention Adjustments — {selectedLogForAction.studentName}</h3>
                            <button 
                                onClick={() => { setIsManualModalOpen(false); setSelectedLogForAction(null); }}
                                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveManualAdjustment} className="space-y-4 text-xs">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 block">Audio Volume Intensity</label>
                                <select 
                                    value={manualAudioVolume}
                                    onChange={(e) => setManualAudioVolume(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                >
                                    <option value="Low (30%)">Low (30%) — Sensory Safe</option>
                                    <option value="Medium (60%)">Medium (60%) — Balanced</option>
                                    <option value="High (90%)">High (90%) — Standard</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 block">Bionic Reading Pacing Speed</label>
                                <select 
                                    value={manualReadingPacing}
                                    onChange={(e) => setManualReadingPacing(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                >
                                    <option value="1.0x Standard Pacing">1.0x Standard Pacing</option>
                                    <option value="1.2x Bionic Pacing">1.2x Bionic Pacing (Recommended)</option>
                                    <option value="1.5x Advanced Pacing">1.5x Advanced Pacing</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-1">
                                <input 
                                    type="checkbox"
                                    id="singleColToggle"
                                    checked={manualSingleColumn}
                                    onChange={(e) => setManualSingleColumn(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#4B8B6B] focus:ring-emerald-400 border-slate-300 cursor-pointer"
                                />
                                <label htmlFor="singleColToggle" className="font-medium text-slate-700 cursor-pointer">
                                    Enable Simplified Single-Column Pastel Card Layout
                                </label>
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="font-bold text-slate-800 block">Coordinator Notes & Justification</label>
                                <textarea 
                                    rows={3}
                                    value={manualCoordinatorNotes}
                                    onChange={(e) => setManualCoordinatorNotes(e.target.value)}
                                    placeholder="Enter custom telemetry adjustments or remarks for IEP records..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                ></textarea>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => { setIsManualModalOpen(false); setSelectedLogForAction(null); }}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="px-5 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
                                >
                                    Save & Resolve Flag
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}