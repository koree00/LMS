import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface StepItem {
    id: number;
    title: string;
    description: string;
}

interface ChecklistItem {
    id: number;
    label: string;
    checked: boolean;
}

interface ValidationItem {
    id: number;
    studentName: string;
    section: string;
    condition: string;
    subject: string;
    requestType: string;
    submittedBy: string;
    timestamp: string;
    details: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    lessonDetails?: {
        title: string;
        subject: string;
        grade: string;
        steps: StepItem[];
        checklist: ChecklistItem[];
    };
}

interface SnedValidationQueueProps {
    notifications?: NotificationItem[];
    pendingItems?: ValidationItem[];
    user?: {
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
}

export default function SnedValidationQueue({ notifications = [], pendingItems = [], user }: SnedValidationQueueProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Filter states using dropdowns
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('All');
    const [filterSubject, setFilterSubject] = useState<string>('All Subjects');
    const [filterSection, setFilterSection] = useState<string>('All Sections');

    // Default ALL 5 MATATAG subjects to collapsed state to prevent clutter
    const [collapsedSubjects, setCollapsedSubjects] = useState<Record<string, boolean>>({
        'Language': true,
        'Reading and Literacy': true,
        'Mathematics': true,
        'GMRC': true,
        'Makabansa': true
    });

    // Selected item for the detailed review screen view
    const [selectedReviewItem, setSelectedReviewItem] = useState<ValidationItem | null>(null);
    const [reviewerNote, setReviewerNote] = useState<string>('');

    // Tailored Custom Confirmation Modal State
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'approve' | 'reject' | null;
        itemId: number | null;
    }>({
        isOpen: false,
        type: null,
        itemId: null
    });

    const [queueItems, setQueueItems] = useState<ValidationItem[]>(pendingItems.length > 0 ? pendingItems : [
        {
            id: 1,
            studentName: 'Leonardo R. Cruz',
            section: 'Grade 1 — Section 1',
            condition: 'Mild ASD',
            subject: 'Mathematics',
            requestType: 'Counting to 5 Adaptation Review',
            submittedBy: 'Teacher Ana',
            timestamp: 'Today, 9:15 AM',
            details: 'Review lesson adaptation for counting with audio prompts and visual step breakdown.',
            status: 'Pending',
            lessonDetails: {
                title: 'Counting to 5',
                subject: 'Mathematics',
                grade: 'Grade 1',
                steps: [
                    { id: 1, title: 'Count the pictures', description: 'Audio prompt included' },
                    { id: 2, title: 'Choose the number', description: 'Three answer choices' },
                    { id: 3, title: 'Try one more example', description: 'Short, predictable finish' }
                ],
                checklist: [
                    { id: 1, label: 'Subject matches the goal', checked: true },
                    { id: 2, label: 'Steps are short and clear', checked: true },
                    { id: 3, label: 'Audio prompt is available', checked: true },
                    { id: 4, label: 'Pacing allows a break', checked: false },
                    { id: 5, label: 'Learner level is appropriate', checked: true }
                ]
            }
        },
        {
            id: 2,
            studentName: 'Chloe Samantha Tan',
            section: 'Grade 1 — Section 2',
            condition: 'ADHD',
            subject: 'Reading and Literacy',
            requestType: 'Alphabet Phonics & Bionic Reading',
            submittedBy: 'Teacher Juan Dela Cruz',
            timestamp: 'Yesterday, 2:40 PM',
            details: 'Review lesson adaptation for phoneme matching with bionic reading highlights.',
            status: 'Pending',
            lessonDetails: {
                title: 'Alphabet Sound Match',
                subject: 'Reading and Literacy',
                grade: 'Grade 1',
                steps: [
                    { id: 1, title: 'Listen to letter phoneme', description: 'Bionic reading active' },
                    { id: 2, title: 'Match matching card', description: 'Low stimulation pastel layout' }
                ],
                checklist: [
                    { id: 1, label: 'Subject matches the goal', checked: true },
                    { id: 2, label: 'Steps are short and clear', checked: true },
                    { id: 3, label: 'Audio prompt is available', checked: true },
                    { id: 4, label: 'Pacing allows a break', checked: true },
                    { id: 5, label: 'Learner level is appropriate', checked: true }
                ]
            }
        },
        {
            id: 3,
            studentName: 'Marcus Aurelius Lim',
            section: 'Grade 1 — Section 1',
            condition: 'Mild ASD',
            subject: 'Makabansa',
            requestType: 'Pamilya Ko Lesson Adaptation',
            submittedBy: 'Teacher Maria Santos',
            timestamp: 'Nov 11, 11:20 AM',
            details: 'Review lesson adaptation for family members identification with high-contrast icons.',
            status: 'Approved',
            lessonDetails: {
                title: 'Pamilya Ko',
                subject: 'Makabansa',
                grade: 'Grade 1',
                steps: [
                    { id: 1, title: 'Identify family roles', description: 'Visual icons provided' }
                ],
                checklist: [
                    { id: 1, label: 'Subject matches the goal', checked: true },
                    { id: 2, label: 'Steps are short and clear', checked: true },
                    { id: 3, label: 'Audio prompt is available', checked: true },
                    { id: 4, label: 'Pacing allows a break', checked: true },
                    { id: 5, label: 'Learner level is appropriate', checked: true }
                ]
            }
        },
        {
            id: 4,
            studentName: 'Sofia Beatrice Reyes',
            section: 'Grade 1 — Section 1',
            condition: 'Mild ASD',
            subject: 'Language',
            requestType: 'Pagbati at Pagkilala Adaptation',
            submittedBy: 'Teacher Ana',
            timestamp: 'Nov 12, 10:00 AM',
            details: 'Review polite greetings vocabulary cards with large touch targets.',
            status: 'Pending',
            lessonDetails: {
                title: 'Magalang na Pananalita',
                subject: 'Language',
                grade: 'Grade 1',
                steps: [
                    { id: 1, title: 'Tap the greeting', description: 'Audio pronunciation enabled' }
                ],
                checklist: [
                    { id: 1, label: 'Subject matches the goal', checked: true },
                    { id: 2, label: 'Steps are short and clear', checked: true },
                    { id: 3, label: 'Audio prompt is available', checked: true },
                    { id: 4, label: 'Pacing allows a break', checked: true },
                    { id: 5, label: 'Learner level is appropriate', checked: true }
                ]
            }
        },
        {
            id: 5,
            studentName: 'Lucas Gabriel Mendoza',
            section: 'Grade 1 — Section 2',
            condition: 'ADHD',
            subject: 'GMRC',
            requestType: 'Pagmamahal sa Pamilya Values Check',
            submittedBy: 'Teacher Juan Dela Cruz',
            timestamp: 'Nov 10, 1:15 PM',
            details: 'Review values scenario story cards with short interactive choices.',
            status: 'Pending',
            lessonDetails: {
                title: 'Tulong-tulong sa Tahanan',
                subject: 'GMRC',
                grade: 'Grade 1',
                steps: [
                    { id: 1, title: 'Read situation', description: 'Bionic highlight active' }
                ],
                checklist: [
                    { id: 1, label: 'Subject matches the goal', checked: true },
                    { id: 2, label: 'Steps are short and clear', checked: true },
                    { id: 3, label: 'Audio prompt is available', checked: true },
                    { id: 4, label: 'Pacing allows a break', checked: true },
                    { id: 5, label: 'Learner level is appropriate', checked: true }
                ]
            }
        }
    ]);

    const handleChecklistToggle = (checkId: number) => {
        if (!selectedReviewItem || !selectedReviewItem.lessonDetails) return;
        const updatedChecklist = selectedReviewItem.lessonDetails.checklist.map(item => 
            item.id === checkId ? { ...item, checked: !item.checked } : item
        );
        setSelectedReviewItem({
            ...selectedReviewItem,
            lessonDetails: {
                ...selectedReviewItem.lessonDetails,
                checklist: updatedChecklist
            }
        });
    };

    const confirmAction = () => {
        if (!modalConfig.itemId || !modalConfig.type) return;

        if (modalConfig.type === 'approve') {
            setQueueItems(prev => prev.map(item => item.id === modalConfig.itemId ? { ...item, status: 'Approved' } : item));
        } else {
            setQueueItems(prev => prev.map(item => item.id === modalConfig.itemId ? { ...item, status: 'Rejected' } : item));
        }

        setSelectedReviewItem(null);
        setReviewerNote('');
        setModalConfig({ isOpen: false, type: null, itemId: null });
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
        { id: 1, text: 'New lesson adaptation pending review', time: '15m ago', unread: true, link: '/sned-coordinator/validation-queue' }
    ]);

    const unreadCount = notifList.length;

    const filteredQueue = queueItems.filter(item => {
        const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
        const matchesSubject = filterSubject === 'All Subjects' || item.subject === filterSubject;
        const matchesSection = filterSection === 'All Sections' || item.section === filterSection;
        
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            item.studentName.toLowerCase().includes(q) || 
            item.submittedBy.toLowerCase().includes(q) || 
            item.requestType.toLowerCase().includes(q);

        return matchesStatus && matchesSubject && matchesSection && matchesSearch;
    });

    const allMatatagSubjects = ['Language', 'Reading and Literacy', 'Mathematics', 'GMRC', 'Makabansa'];
    const activeSubjectsToDisplay = filterSubject === 'All Subjects' ? allMatatagSubjects : [filterSubject];

    const pendingCount = queueItems.filter(i => i.status === 'Pending').length;

    const toggleSubjectCollapse = (subject: string) => {
        setCollapsedSubjects(prev => ({ ...prev, [subject]: !prev[subject] }));
    };

    return (
        <>
            <Head title="Validation Queue — LearnPath SNED Portal"/>
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {sidebarOpen && (
                    <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-900/10 z-40 md:hidden backdrop-blur-3xs transition-opacity" />
                )}

                {/* Highly Tailored Custom Confirmation Modal */}
                {modalConfig.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl max-w-md w-full p-6 space-y-5">
                            <div className="flex items-center gap-3.5">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs ${
                                    modalConfig.type === 'approve' 
                                        ? 'bg-emerald-50 text-emerald-800 border-slate-200/60' 
                                        : 'bg-rose-50 text-rose-800 border-slate-200/60'
                                }`}>
                                    {modalConfig.type === 'approve' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                        {modalConfig.type === 'approve' ? 'Approve Lesson Adaptation' : 'Request Changes'}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">LearnPath SNED Coordinator Validation Review</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/60">
                                {modalConfig.type === 'approve' 
                                    ? 'Are you sure you want to approve this lesson adaptation? This will finalize the review checklist and make the module active for the student.' 
                                    : 'Are you sure you want to request changes for this lesson adaptation? This will send your reviewer notes back to the teacher.'}
                            </p>

                            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                                <button 
                                    onClick={() => setModalConfig({ isOpen: false, type: null, itemId: null })}
                                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-all cursor-pointer shadow-2xs"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={confirmAction}
                                    className={`px-4 py-2 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer ${
                                        modalConfig.type === 'approve' 
                                            ? 'bg-[#4B8B6B] hover:bg-[#3D7257]' 
                                            : 'bg-rose-500 hover:bg-rose-400'
                                    }`}
                                >
                                    {modalConfig.type === 'approve' ? 'Yes, Approve Lesson' : 'Yes, Request Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sidebar Navigation */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0
                    ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}
                `}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">L</div>
                                {sidebarOpen && (
                                    <div className="truncate">
                                        <span className="font-bold text-slate-900 block text-xs leading-tight">LearnPath</span>
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
                                 <Link href="/sned-coordinator/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Learners Profile">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                                                                                    {sidebarOpen && <span>Learners Profile</span>}
                                                                                                </Link> 
                                <Link href="/sned-coordinator/validation-queue" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-100/60 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Validation Queue">
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
                            <span className="text-xs font-semibold text-slate-500 truncate">
                                {selectedReviewItem ? 'Validation queue / Review' : 'Validation queue / SNED'}
                            </span>
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
                                                        onClick={() => router.visit(n.link)}
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

                            {/* User Avatar Badge */}
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs overflow-hidden">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <span>SC</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conditional Rendering: Detailed Review Screen vs Queue List */}
                    {selectedReviewItem && selectedReviewItem.lessonDetails ? (
                        <div className="space-y-6">
                            {/* Breadcrumb & Header */}
                            <div className="space-y-2">
                                <div>
                                    <h1 className="text-base font-bold text-slate-900">Review lesson adaptation</h1>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {selectedReviewItem.lessonDetails.title} · {selectedReviewItem.lessonDetails.subject} · {selectedReviewItem.lessonDetails.grade} · Submitted by {selectedReviewItem.submittedBy}
                                    </p>
                                </div>
                            </div>

                            {/* Two-Column Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                
                                {/* Left Column: Learner-facing steps with bottom-right back button */}
                                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Learner-facing steps</h2>
                                        <div className="space-y-3">
                                            {selectedReviewItem.lessonDetails.steps.map((step, idx) => (
                                                <div 
                                                    key={step.id} 
                                                    className={`p-4 rounded-xl border transition-all ${
                                                        idx === 1 
                                                            ? 'bg-emerald-50/40 border-slate-200/80 shadow-2xs' 
                                                            : 'bg-white border-slate-200/70'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                                            {step.id}
                                                        </span>
                                                        <div>
                                                            <h3 className="text-xs font-bold text-slate-900">{step.title}</h3>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">{step.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Positioned at the very bottom right of the card */}
                                    <div className="mt-8 pt-4 flex justify-end border-t border-slate-100">
                                        <button 
                                            onClick={() => setSelectedReviewItem(null)}
                                            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs"
                                        >
                                            <span>←</span> Back to Validation Queue
                                        </button>
                                    </div>
                                </div>

                                {/* Right Column: Dynamic Review Checklist & Reviewer Actions */}
                                <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-6 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Review checklist</h2>
                                        <div className="space-y-3">
                                            {selectedReviewItem.lessonDetails.checklist.map(check => (
                                                <label key={check.id} className="flex items-center gap-3 text-xs text-slate-700 cursor-pointer select-none">
                                                    <input 
                                                        type="checkbox"
                                                        checked={check.checked}
                                                        onChange={() => handleChecklistToggle(check.id)}
                                                        className="w-4 h-4 rounded border-slate-300 text-[#4B8B6B] focus:ring-emerald-400 cursor-pointer"
                                                    />
                                                    <span className={check.checked ? 'text-slate-900 font-medium' : 'text-slate-500'}>{check.label}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            <label className="text-xs font-bold text-slate-900 block uppercase tracking-wider">Reviewer note</label>
                                            <textarea 
                                                value={reviewerNote}
                                                onChange={(e) => setReviewerNote(e.target.value)}
                                                placeholder="Add a note for the teacher..."
                                                rows={3}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => setModalConfig({ isOpen: true, type: 'reject', itemId: selectedReviewItem.id })}
                                            className="px-4 py-2.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-medium rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer flex items-center justify-center text-center shadow-2xs"
                                        >
                                            Request changes
                                        </button>
                                        <button 
                                            onClick={() => setModalConfig({ isOpen: true, type: 'approve', itemId: selectedReviewItem.id })}
                                            className="px-4 py-2.5 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center text-center"
                                        >
                                            Approve lesson
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Page Header & Logically Placed Search & Dropdown Filters */}
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-sm font-bold text-slate-900">Validation Queue</h1>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Review teacher lesson adaptations, IEP accommodations, and sensory pause thresholds for inclusion students.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-slate-200/60 font-bold text-xs rounded-full">
                                            {pendingCount} Pending Review
                                        </span>
                                    </div>
                                </div>

                                {/* Logically Placed Search Bar inside Content Card */}
                                <div className="pt-2">
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                        </span>
                                        <input 
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by student name, teacher, or request type..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />
                                    </div>
                                </div>

                                {/* Dropdown Selectors for Status, MATATAG Subject, and Section */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Status Filter</label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                        >
                                            <option value="All">All Statuses</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">MATATAG Subject</label>
                                        <select
                                            value={filterSubject}
                                            onChange={(e) => setFilterSubject(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                        >
                                            <option value="All Subjects">All 5 MATATAG Subjects</option>
                                            <option value="Language">Language</option>
                                            <option value="Reading and Literacy">Reading and Literacy</option>
                                            <option value="Mathematics">Mathematics</option>
                                            <option value="GMRC">GMRC</option>
                                            <option value="Makabansa">Makabansa</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-slate-600 mb-1">Class Section</label>
                                        <select
                                            value={filterSection}
                                            onChange={(e) => setFilterSection(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                                        >
                                            <option value="All Sections">All Sections</option>
                                            <option value="Grade 1 — Section 1">Grade 1 — Section 1</option>
                                            <option value="Grade 1 — Section 2">Grade 1 — Section 2</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Subject-First Collapsed by Default Categorization (All 5 Areas) */}
                            <div className="space-y-4">
                                {activeSubjectsToDisplay.map(subjectName => {
                                    const subjectItems = filteredQueue.filter(item => item.subject === subjectName);
                                    const isCollapsed = collapsedSubjects[subjectName] ?? true;

                                    return (
                                        <div key={subjectName} className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
                                            {/* Subject Category Header Accordion Toggle */}
                                            <div 
                                                onClick={() => toggleSubjectCollapse(subjectName)}
                                                className="flex items-center justify-between px-6 py-4 bg-slate-50/80 border-b border-slate-100 cursor-pointer hover:bg-slate-100/60 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                                                    <h2 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                                                        {subjectName} <span className="text-slate-500 font-normal">({subjectItems.length} items)</span>
                                                    </h2>
                                                </div>
                                                <button className="text-xs font-semibold text-slate-500 cursor-pointer">
                                                    {isCollapsed ? 'Expand ▼' : 'Collapse ▲'}
                                                </button>
                                            </div>

                                            {/* Subject Items List (Hidden by default since collapsed is true) */}
                                            {!isCollapsed && (
                                                <div className="p-5 space-y-4">
                                                    {subjectItems.length === 0 ? (
                                                        <div className="p-6 text-center text-slate-400 text-xs italic">
                                                            No adaptation requests found for {subjectName} under current filters.
                                                        </div>
                                                    ) : (
                                                        subjectItems.map(item => (
                                                            <div key={item.id} className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 shadow-2xs space-y-3">
                                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0">
                                                                            {item.studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                                        </div>
                                                                        <div>
                                                                            <h3 className="text-xs font-bold text-slate-900">{item.studentName}</h3>
                                                                            <p className="text-[10px] text-slate-500 font-medium">
                                                                                {item.section} · <span className="text-emerald-700 font-semibold">{item.condition}</span>
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                                            item.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                                                                            item.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                                        }`}>
                                                                            {item.status}
                                                                        </span>
                                                                        <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="text-xs font-bold text-slate-800">{item.requestType}</span>
                                                                        <span className="text-[11px] text-slate-500">Submitted by: <strong className="text-slate-700">{item.submittedBy}</strong></span>
                                                                    </div>
                                                                    <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/60 leading-relaxed">
                                                                        {item.details}
                                                                    </p>
                                                                </div>

                                                                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                                                                    {item.lessonDetails ? (
                                                                        <button 
                                                                            onClick={() => setSelectedReviewItem(item)}
                                                                            className="px-4 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white text-xs font-medium rounded-xl transition-all shadow-sm cursor-pointer"
                                                                        >
                                                                            Review lesson adaptation →
                                                                        </button>
                                                                    ) : (
                                                                        <span className="text-[11px] text-slate-400 italic">No adaptation steps attached</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                </main>
            </div>
        </>
    );
}