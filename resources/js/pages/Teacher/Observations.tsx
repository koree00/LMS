import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
}

interface StudentOption {
    id: string;
    name: string;
    section: string;
    condition: 'Mild ASD' | 'ADHD';
}

interface ObservationItem {
    id: string;
    studentId: string;
    studentName: string;
    section: string;
    source: 'Automated Telemetry' | 'Teacher Log';
    note: string;
    statusBadge: string;
    statusType: 'amber' | 'emerald' | 'blue';
    timestamp: string;
}

interface TeacherObservationsProps {
    assignedSections?: string[];
    students?: StudentOption[];
}

export default function TeacherObservations({
    assignedSections = ['Section 1 - Emerald', 'Section 2 - Sapphire'],
    students = [
        { id: '1', name: 'Mia Santos', section: 'Section 1 - Emerald', condition: 'Mild ASD' },
        { id: '2', name: 'Noah Perez', section: 'Section 1 - Emerald', condition: 'ADHD' },
        { id: '3', name: 'Ava Reyes', section: 'Section 2 - Sapphire', condition: 'Mild ASD' },
        { id: '4', name: 'Liam Turner', section: 'Section 2 - Sapphire', condition: 'ADHD' },
    ]
}: TeacherObservationsProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    
    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Section Dropdown Filter State ('All' or specific section name)
    const [selectedSectionFilter, setSelectedSectionFilter] = useState<string>('All');

    // Modal state for logging new observations
    const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
    const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

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
        { id: 1, text: 'Auto-telemetry flagged prolonged pause for Mia S.', time: '10m ago', unread: true },
        { id: 2, text: 'SNED validation review completed for Grade 1 math', time: '1h ago', unread: true },
    ]);

    const unreadCount = notifications.filter(n => n.unread).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, unread: false })));
    };

    // Review Queue Items linked directly to student records via studentId
    const [observationsList, setObservationsList] = useState<ObservationItem[]>([
        {
            id: 'obs-1',
            studentId: '1',
            studentName: 'Mia Santos',
            section: 'Section 1 - Emerald',
            source: 'Automated Telemetry',
            note: 'Extended 18s idle pause detected on Level 2 number sequencing. Audio assist requested twice.',
            statusBadge: 'Check-in suggested',
            statusType: 'amber',
            timestamp: 'Today - 10:12 AM'
        },
        {
            id: 'obs-2',
            studentId: '2',
            studentName: 'Noah Perez',
            section: 'Section 1 - Emerald',
            source: 'Automated Telemetry',
            note: 'High-frequency tap pattern detected; repeated prompt replay successfully resolved item.',
            statusBadge: 'Audio prompt helped',
            statusType: 'emerald',
            timestamp: 'Today - 9:48 AM'
        },
        {
            id: 'obs-3',
            studentId: '3',
            studentName: 'Ava Reyes',
            section: 'Section 2 - Sapphire',
            source: 'Automated Telemetry',
            note: 'Completed counting module 25% faster than average baseline with zero errors.',
            statusBadge: 'On track',
            statusType: 'emerald',
            timestamp: 'Yesterday - 1:20 PM'
        },
        {
            id: 'obs-4',
            studentId: '4',
            studentName: 'Liam Turner',
            section: 'Section 2 - Sapphire',
            source: 'Teacher Log',
            note: 'Teacher intervened for a short sensory breathing pause before returning to task successfully.',
            statusBadge: 'On track',
            statusType: 'emerald',
            timestamp: 'Yesterday - 10:05 AM'
        }
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id: '',
        focus_duration: '10-15 mins',
        engagement_level: 'Moderate',
        sensory_cue_used: false,
        notes: '',
    });

    const handleSubmitObservation = (e: React.FormEvent) => {
        e.preventDefault();
        post('/teacher/observations', {
            onSuccess: () => {
                setSubmittedSuccess(true);
                reset();
                setTimeout(() => {
                    setSubmittedSuccess(false);
                    setIsLogModalOpen(false);
                }, 2000);
            }
        });
    };

    const filteredObservations = observationsList.filter(obs => 
        selectedSectionFilter === 'All' || obs.section === selectedSectionFilter
    );

    return (
        <>
            <Head title="Observations and Check-ins — Teacher Portal · San Mateo Elementary School" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
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
                                    Teacher Portal
                                </div>
                            )}

                            <nav className="space-y-1">
                                <Link href="/teacher/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                <Link href="/teacher/subjects" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                    {sidebarOpen && <span>Subjects</span>}
                                </Link>
                                <Link href="/teacher/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>Learners</span>}
                                </Link>
                                <Link href="/teacher/observations" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-emerald-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    {sidebarOpen && <span>Observations</span>}
                                </Link>
                                <Link href="/teacher/reports" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Reports</span>}
                                </Link>
                                <Link href="/teacher/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-500 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Messages">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>
                                <Link href="/teacher/teacherusermanagement" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>User Management</span>}
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
                            <svg className="w-4 h-4 shrink-0 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                            {sidebarOpen && <span>Sign out</span>}
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Top Bar Header */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full box-border">
                        <div className="flex items-center gap-3 min-w-0">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-50 border border-slate-200 cursor-pointer shrink-0">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                            <span className="text-xs font-semibold text-slate-500 truncate">Observations / Teacher</span>
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
                                                <button onClick={markAllAsRead} className="text-[11px] text-emerald-700 hover:underline font-medium cursor-pointer">Mark all read</button>
                                            )}
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-2.5 ${n.unread ? 'bg-emerald-50/40' : ''}`}>
                                                        <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
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

                    {/* Page Header */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Observations and Check-ins</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Automated game telemetry & qualitative logs categorized by assigned sections.</p>
                        </div>
                        <button
                            onClick={() => setIsLogModalOpen(true)}
                            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors cursor-pointer shrink-0 flex items-center gap-2"
                        >
                            <span>+ Add Qualitative Note</span>
                        </button>
                    </div>

                    {/* Observations Review Queue Card with Section Dropdown Filter */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-4 shadow-sm w-full">
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900">Telemetry & Observation Stream</h2>
                                <p className="text-xs text-slate-500">Includes real-time auto-flagged game pauses, audio requests, and manual logs.</p>
                            </div>
                            
                            {/* Section Dropdown Filter */}
                            <div className="flex items-center gap-2 text-xs">
                                <label className="font-semibold text-slate-500">Filter Section:</label>
                                <select
                                    value={selectedSectionFilter}
                                    onChange={(e) => setSelectedSectionFilter(e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                >
                                    <option value="All">All Assigned Sections</option>
                                    {assignedSections.map(sec => (
                                        <option key={sec} value={sec}>{sec}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Filtered Observations List with Predictable Student Link Routing */}
                        <div className="space-y-3">
                            {filteredObservations.length > 0 ? (
                                filteredObservations.map(obs => (
                                    <div 
                                        key={obs.id} 
                                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                                            obs.statusType === 'amber' ? 'bg-amber-50/50 border-amber-200/70' : 'bg-white border-slate-200/70'
                                        }`}
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={`/teacher/learner-record?student=${obs.studentId}`} 
                                                    className="font-bold text-slate-900 text-sm hover:text-emerald-700 hover:underline cursor-pointer"
                                                >
                                                    {obs.studentName} →
                                                </Link>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{obs.section}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${obs.source === 'Automated Telemetry' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {obs.source}
                                                </span>
                                            </div>
                                            <p className="text-slate-700 font-medium">{obs.note}</p>
                                            <span className={`font-semibold block pt-0.5 ${obs.statusType === 'amber' ? 'text-amber-800' : 'text-emerald-700'}`}>
                                                {obs.statusBadge}
                                            </span>
                                        </div>
                                        <span className="text-slate-400 text-[11px] shrink-0">{obs.timestamp}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400">No observations found for this section.</div>
                            )}
                        </div>
                    </div>

                </main>
            </div>

            {/* Log New Observation Modal */}
            {isLogModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs">
                    <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-2xl shadow-xl border border-slate-200 space-y-6 text-xs max-h-[95vh] overflow-y-auto">
                        
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Add Qualitative Observation Note</h3>
                                <p className="text-slate-500 text-xs">San Mateo Elementary School — Complement automated telemetry with teacher insights</p>
                            </div>
                            <button onClick={() => setIsLogModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">✕</button>
                        </div>

                        {submittedSuccess && (
                            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-center space-x-3 text-xs font-medium">
                                <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                <span>Observation successfully logged and categorized!</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmitObservation} className="space-y-5">
                            <div>
                                <label className="block font-semibold text-slate-800 mb-1.5 text-xs">
                                    Select Student (Scoped to Assigned Sections)
                                </label>
                                <select
                                    value={data.student_id}
                                    onChange={e => setData('student_id', e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                                    required
                                >
                                    <option value="">-- Choose Learner --</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>
                                            {student.name} ({student.section} — {student.condition})
                                        </option>
                                    ))}
                                </select>
                                {errors.student_id && <div className="text-rose-600 text-[11px] mt-1">{errors.student_id}</div>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold text-slate-800 mb-1.5 text-xs">
                                        Estimated Focus Duration
                                    </label>
                                    <select
                                        value={data.focus_duration}
                                        onChange={e => setData('focus_duration', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                                    >
                                        <option value="Under 5 mins">Under 5 minutes</option>
                                        <option value="5-10 mins">5 to 10 minutes</option>
                                        <option value="10-15 mins">10 to 15 minutes</option>
                                        <option value="15+ mins">15+ minutes (Extended)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-800 mb-1.5 text-xs">
                                        Engagement Level
                                    </label>
                                    <select
                                        value={data.engagement_level}
                                        onChange={e => setData('engagement_level', e.target.value)}
                                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                                    >
                                        <option value="High">High (Active participation)</option>
                                        <option value="Moderate">Moderate (Responsive with prompts)</option>
                                        <option value="Distracted">Distracted (Required sensory pause)</option>
                                        <option value="Overwhelmed">Overwhelmed / Sensory overload</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-slate-900 text-xs">Sensory Break / Pause Triggered?</h4>
                                    <p className="text-[11px] text-slate-500">Did the student require a low-stimulation breathing pause during this module?</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.sensory_cue_used}
                                        onChange={e => setData('sensory_cue_used', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>

                            <div>
                                <label className="block font-semibold text-slate-800 mb-1.5 text-xs">
                                    Qualitative Observation Notes (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Note specific social cues, peer interactions, or response to bionic reading elements..."
                                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-xs"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsLogModalOpen(false)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition-colors flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
                                >
                                    <span>{processing ? 'Saving...' : 'Submit Observation'}</span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </>
    );
}