import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface SubjectItem {
    id: string;
    name: string;
    code: string;
    description: string;
    iconColor: string;
    enrolledCount: number;
}

interface UploadedModule {
    id: number;
    quarter: string;
    levelName: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
}

interface ValidationRecord {
    id: number;
    quarter: string;
    levelName: string;
    moduleTitle: string;
    validatedBy: string; // SNED Coordinator exclusively
    status: 'Approved' | 'Pending SNED Review' | 'Revision Requested';
    date: string;
}

interface StudentItemBreakdown {
    levelTitle: string;
    items: { prompt: string; result: 'Correct' | 'Needs Support'; timeSpent: string }[];
}

interface StudentProfile {
    id: number;
    name: string;
    section: 'Section A' | 'Section B';
    supportCondition: string;
    accommodationNotes: string;
    parentName: string;
    parentEmail: string;
    overallMastery: number;
    diagnosticInsights: string; // AI behavioral & learning pattern evaluation
    levelBreakdowns: StudentItemBreakdown[];
}

export default function Subjects() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
    
    // Subject Cards (Landing Page Data definition needed early for lazy initial state)
    const subjects: SubjectItem[] = [
        { id: 'math', name: 'Mathematics', code: 'MATH-1', description: 'Number sense, addition, subtraction, and basic geometry tailored for Grade 1.', iconColor: 'bg-emerald-100 text-emerald-800', enrolledCount: 72 },
        { id: 'reading', name: 'Reading & Literacy', code: 'RL-1', description: 'Phonological awareness, alphabet knowledge, and vocabulary building.', iconColor: 'bg-blue-100 text-blue-800', enrolledCount: 72 },
        { id: 'language', name: 'Language', code: 'LANG-1', description: 'Oral language proficiency and foundational grammar concepts.', iconColor: 'bg-amber-100 text-amber-800', enrolledCount: 72 },
        { id: 'makabansa', name: 'Makabansa', code: 'MAK-1', description: 'Civics, cultural awareness, health, and local heritage studies.', iconColor: 'bg-purple-100 text-purple-800', enrolledCount: 72 },
        { id: 'gmrc', name: 'GMRC', code: 'GMRC-1', description: 'Values education, moral character, and emotional regulation.', iconColor: 'bg-rose-100 text-rose-800', enrolledCount: 72 },
    ];

    // Lazy initial state reads the URL parameter synchronously on first render (eliminates the flash glitch)
    const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const subjectParam = params.get('subject');
            if (subjectParam) {
                return subjects.find(s => s.id === subjectParam) || null;
            }
        }
        return null;
    });
    
    // Tracks which lettered section is currently open ('modules', 'uploads', 'validation', 'learners', 'preview')
    const [activeSection, setActiveSection] = useState<string | null>(null);

    // Categorization states for Uploaded Modules & Validation History
    const [selectedQuarterUpload, setSelectedQuarterUpload] = useState<string>('All');
    const [selectedQuarterValidation, setSelectedQuarterValidation] = useState<string>('All');

    // Learners & Deep Dive Profile State
    const [learnerSectionFilter, setLearnerSectionFilter] = useState<string>('All');
    const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

    // Mock Uploaded Modules categorized by Quarter and Level
    const mockUploadedModules: UploadedModule[] = [
        { id: 1, quarter: 'Quarter 1', levelName: 'Level 1: Counting Objects 1-5', fileName: 'Q1_L1_Math_Source.pdf', fileSize: '2.4 MB', uploadedAt: 'Oct 12, 2026' },
        { id: 2, quarter: 'Quarter 1', levelName: 'Level 2: Number Sequencing 6-10', fileName: 'Q1_L2_Math_Source.pdf', fileSize: '3.1 MB', uploadedAt: 'Oct 15, 2026' },
        { id: 3, quarter: 'Quarter 2', levelName: 'Level 1: Basic Addition Concepts', fileName: 'Q2_L1_Math_Source.pdf', fileSize: '4.0 MB', uploadedAt: 'Nov 02, 2026' },
    ];

    // Mock Validation History (Validated Exclusively by SNED Coordinator)
    const mockValidations: ValidationRecord[] = [
        { id: 1, quarter: 'Quarter 1', levelName: 'Level 1: Counting Objects 1-5', moduleTitle: 'Counting Game Module v1', validatedBy: 'Dr. Evelyn Santos (SNED Coordinator)', status: 'Approved', date: 'Oct 14, 2026' },
        { id: 2, quarter: 'Quarter 1', levelName: 'Level 2: Number Sequencing 6-10', moduleTitle: 'Number Sequencing Game Module', validatedBy: 'Dr. Evelyn Santos (SNED Coordinator)', status: 'Approved', date: 'Oct 18, 2026' },
        { id: 3, quarter: 'Quarter 2', levelName: 'Level 1: Basic Addition Concepts', moduleTitle: 'Addition Visuals Module', validatedBy: 'Dr. Evelyn Santos (SNED Coordinator)', status: 'Pending SNED Review', date: 'Nov 04, 2026' },
    ];

    // Mock Students Data Profiles with Itemized Breakdown & Diagnostic Insights
    const mockStudents: StudentProfile[] = [
        {
            id: 1,
            name: 'Mia Santos',
            section: 'Section A',
            supportCondition: 'Mild Autism',
            accommodationNotes: 'Requires structured visual schedule and noise-canceling headphones.',
            parentName: 'Maria Santos (Mother)',
            parentEmail: 'maria.santos@gmail.com',
            overallMastery: 85,
            diagnosticInsights: 'Exhibits strong pattern recognition with visual aids. Tends to hesitate on text-heavy multiple-choice prompts but performs instantly when audio assist is active. Recommended activity type: Audio-assisted drag-and-drop matching games.',
            levelBreakdowns: [
                {
                    levelTitle: 'Level 1: Counting Objects 1 to 5',
                    items: [
                        { prompt: 'Count the apples: 🍎 🍎', result: 'Correct', timeSpent: '4s' },
                        { prompt: 'Match number to quantity: 3 stars', result: 'Correct', timeSpent: '6s' },
                        { prompt: 'Audio Prompt: Select number 4', result: 'Correct', timeSpent: '3s' },
                    ]
                },
                {
                    levelTitle: 'Level 2: Number Sequencing 6 to 10',
                    items: [
                        { prompt: 'What comes after 7? [ _ ]', result: 'Needs Support', timeSpent: '18s' },
                        { prompt: 'Order numbers from least to greatest', result: 'Correct', timeSpent: '12s' },
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Noah Perez',
            section: 'Section A',
            supportCondition: 'ADHD',
            accommodationNotes: 'Benefits from micro-breaks and gamified immediate rewards.',
            parentName: 'Carlos Perez (Father)',
            parentEmail: 'carlos.perez@yahoo.com',
            overallMastery: 68,
            diagnosticInsights: 'High engagement during fast-paced item interactions, but completion accuracy drops on items requiring prolonged counting. Recommended activity type: High-stimulus short bursts with immediate audio feedback.',
            levelBreakdowns: [
                {
                    levelTitle: 'Level 1: Counting Objects 1 to 5',
                    items: [
                        { prompt: 'Count the apples: 🍎 🍎', result: 'Correct', timeSpent: '3s' },
                        { prompt: 'Match number to quantity: 3 stars', result: 'Needs Support', timeSpent: '14s' },
                        { prompt: 'Audio Prompt: Select number 4', result: 'Correct', timeSpent: '5s' },
                    ]
                }
            ]
        }
    ];

    return (
        <>
            <Head title="Subjects & Modules Hub — Teacher Portal" />
            <div className="min-h-screen bg-slate-50/50 flex text-slate-700 w-full overflow-x-hidden relative font-sans box-border">
                
                {/* Sidebar Navigation */}
                <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200/70 p-4 md:p-5 flex flex-col justify-between transition-all duration-200 shrink-0 ${sidebarOpen ? 'w-64 shadow-sm md:shadow-none translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20'}`}>
                    <div className="space-y-6 overflow-y-auto overflow-x-hidden flex-1 pr-1">
                        <div className={`flex items-center pb-4 border-b border-slate-100 ${sidebarOpen ? 'justify-between' : 'flex-col gap-3'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 border border-slate-200/70 flex items-center justify-center font-bold text-xs shrink-0">SM</div>
                                {sidebarOpen && (<div className="truncate"><span className="font-bold text-slate-900 block text-xs leading-tight">EduQuestAI</span><span className="text-[11px] text-slate-500 font-medium">San Mateo Elementary</span></div>)}
                            </div>
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer border border-transparent hover:border-slate-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16"/></svg>
                            </button>
                        </div>
                        <nav className="space-y-1">
                            <Link href="/teacher/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                {sidebarOpen && <span>Overview</span>}
                            </Link> 
                            <Link href="/teacher/subjects" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                {sidebarOpen && <span>Subjects</span>}
                            </Link>
                            <Link href="/teacher/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                {sidebarOpen && <span>Learners</span>}
                            </Link>
                            <Link href="/teacher/observations" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
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
                </aside>

                {/* Main Workspace */}
                <main className={`flex-1 w-full min-w-0 py-5 px-4 sm:px-8 lg:px-10 space-y-6 transition-all duration-200 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                    
                    {/* Header Bar */}
                    <div className="flex items-center justify-between bg-white p-3.5 sm:px-6 rounded-xl border border-slate-200/70 shadow-sm w-full">
                        <span className="text-xs font-semibold text-slate-500">
                            <button onClick={() => { setSelectedSubject(null); setActiveSection(null); }} className="text-emerald-700 hover:underline cursor-pointer">Subjects Hub</button> 
                            {selectedSubject && ` / ${selectedSubject.name}`}
                            {activeSection && ` / Section ${activeSection.toUpperCase()}`}
                        </span>
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200">TA</div>
                    </div>

                    {!selectedSubject ? (
                        /* VIEW 1: SUBJECT CARDS GRID LANDING PAGE */
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Grade 1 Learning Areas & Subjects</h1>
                                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Select a subject card below to open its dedicated workspace.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {subjects.map((subj) => (
                                    <div 
                                        key={subj.id}
                                        onClick={() => { setSelectedSubject(subj); setActiveSection(null); }}
                                        className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${subj.iconColor}`}>{subj.code}</span>
                                                <span className="text-[11px] font-semibold text-slate-400">{subj.enrolledCount} Learners</span>
                                            </div>
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">{subj.name}</h3>
                                            <p className="text-xs text-slate-500 leading-relaxed">{subj.description}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-emerald-700">
                                            <span>Open Subject Workspace</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : activeSection === null ? (
                        /* VIEW 2: SUBJECT DASHBOARD WITH STACKED LETTERED TITLE CARDS */
                        <div className="space-y-6">
                            
                            {/* Subject Header Banner */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{selectedSubject.code}</span>
                                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{selectedSubject.name} Workspace</h1>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">{selectedSubject.description}</p>
                                </div>
                                <button onClick={() => setSelectedSubject(null)} className="px-3.5 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-xs font-medium cursor-pointer w-fit">
                                    ← Back to Subject Cards
                                </button>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Sections & Modules</h3>
                                
                                {/* Stacked Lettered Title Cards Menu */}
                                <div className="space-y-3">
                                    
                                    {/* Card A: Dynamically passes the selected subject ID to Lesson Studio */}
                                    <Link 
                                        href={`/lessons?subject=${selectedSubject.id}`}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group block"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">a</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">Lesson Studio</h4>
                                                <p className="text-xs text-slate-500">Draft daily lesson plans and learning objectives bound specifically to this learning area.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </Link>

                                    {/* Card B */}
                                    <div 
                                        onClick={() => setActiveSection('modules')}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">b</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">Adapted Game Modules (Levels as Subtopics)</h4>
                                                <p className="text-xs text-slate-500">Game progression levels functioning as subtopics containing interactive items.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </div>

                                    {/* Card C */}
                                    <div 
                                        onClick={() => setActiveSection('uploads')}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">c</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">Uploaded Source Modules Repository</h4>
                                                <p className="text-xs text-slate-500">Categorized by Quarters and Levels.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </div>

                                    {/* Card D */}
                                    <div 
                                        onClick={() => setActiveSection('validation')}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">d</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">SNED Coordinator Validation History</h4>
                                                <p className="text-xs text-slate-500">Modules reviewed and validated exclusively by the SNED Coordinator, categorized by Quarter and Level.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </div>

                                    {/* Card E */}
                                    <div 
                                        onClick={() => setActiveSection('learners')}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">e</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">Enrolled Students & Behavioral Diagnostics</h4>
                                                <p className="text-xs text-slate-500">Student data profiles, itemized level performance, and AI behavioral/diagnostic evaluations.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </div>

                                    {/* Card F */}
                                    <div 
                                        onClick={() => setActiveSection('preview')}
                                        className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/20 transition-all cursor-pointer flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200 shrink-0">f</span>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-900">Student Activity Preview (Game Client Simulator)</h4>
                                                <p className="text-xs text-slate-500">Preview how activities appear on the student side with SNED audio options.</p>
                                            </div>
                                        </div>
                                        <span className="text-slate-400 group-hover:text-emerald-700 font-bold text-sm">→</span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ) : (
                        /* VIEW 3: SPECIFIC SECTION CONTENT VIEW */
                        <div className="space-y-6">
                            
                            {/* Section Navigation Header */}
                            <div className="bg-white p-4 sm:px-6 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                                        Section {activeSection.toUpperCase()}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => setActiveSection(null)} 
                                    className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                                >
                                    ← Back to Sections Menu
                                </button>
                            </div>

                            {/* SECTION B CONTENT */}
                            {activeSection === 'modules' && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">b. Adapted Game Modules (Levels as Subtopics)</h3>
                                            <p className="text-xs text-slate-500">Game progression levels functioning as subtopics containing interactive items.</p>
                                        </div>
                                        <button className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100 cursor-pointer">+ Adapt New Module</button>
                                    </div>

                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                            <span className="text-xs font-bold text-slate-800">Quarter 1: Recognizing Numbers 1 to 20</span>
                                            <span className="text-[11px] text-slate-500 font-semibold">Active Game Module</span>
                                        </div>
                                        <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2 text-xs">
                                            <span className="font-bold text-emerald-900 block">Level 1: Counting Objects 1 to 5 (Subtopic)</span>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                                    <strong className="text-emerald-800 block">Item #1 (Multiple Choice)</strong>
                                                    <span className="text-slate-500 truncate block">Count apples: 🍎 🍎</span>
                                                </div>
                                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                                    <strong className="text-emerald-800 block">Item #2 (Drag & Drop)</strong>
                                                    <span className="text-slate-500 truncate block">Match number to quantity</span>
                                                </div>
                                                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                                                    <strong className="text-emerald-800 block">Item #3 (Audio Assist)</strong>
                                                    <span className="text-slate-500 truncate block">Select number 4 by audio prompt</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SECTION C CONTENT */}
                            {activeSection === 'uploads' && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">c. Uploaded Source Modules Repository</h3>
                                            <p className="text-xs text-slate-500">Categorized by Quarters and Levels.</p>
                                        </div>
                                        <select 
                                            value={selectedQuarterUpload}
                                            onChange={(e) => setSelectedQuarterUpload(e.target.value)}
                                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 w-fit"
                                        >
                                            <option value="All">All Quarters</option>
                                            <option value="Quarter 1">Quarter 1</option>
                                            <option value="Quarter 2">Quarter 2</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        {mockUploadedModules
                                            .filter(m => selectedQuarterUpload === 'All' || m.quarter === selectedQuarterUpload)
                                            .map(mod => (
                                                <div key={mod.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{mod.quarter}</span>
                                                            <span className="font-bold text-slate-900">{mod.levelName}</span>
                                                        </div>
                                                        <span className="text-slate-500 block">File: <em className="text-slate-700">{mod.fileName}</em> ({mod.fileSize}) • Uploaded {mod.uploadedAt}</span>
                                                    </div>
                                                    <button className="text-emerald-700 font-semibold hover:underline cursor-pointer">Download File</button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION D CONTENT */}
                            {activeSection === 'validation' && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">d. SNED Coordinator Validation History</h3>
                                            <p className="text-xs text-slate-500">Modules reviewed and validated exclusively by the SNED Coordinator, categorized by Quarter and Level.</p>
                                        </div>
                                        <select 
                                            value={selectedQuarterValidation}
                                            onChange={(e) => setSelectedQuarterValidation(e.target.value)}
                                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50 w-fit"
                                        >
                                            <option value="All">All Quarters</option>
                                            <option value="Quarter 1">Quarter 1</option>
                                            <option value="Quarter 2">Quarter 2</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        {mockValidations
                                            .filter(v => selectedQuarterValidation === 'All' || v.quarter === selectedQuarterValidation)
                                            .map(val => (
                                                <div key={val.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">{val.quarter}</span>
                                                            <span className="font-bold text-slate-900">{val.levelName}</span>
                                                        </div>
                                                        <span className="text-slate-600 block">Module: <strong>{val.moduleTitle}</strong></span>
                                                        <span className="text-slate-400">Validated by: {val.validatedBy} ({val.date})</span>
                                                    </div>
                                                    <span className={`px-2.5 py-1 rounded-full font-semibold border ${
                                                        val.status === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                                    }`}>
                                                        {val.status}
                                                    </span>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION E CONTENT */}
                            {activeSection === 'learners' && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900">e. Enrolled Students & Behavioral Diagnostics</h3>
                                            <p className="text-xs text-slate-500">Student data profiles, itemized level performance, and AI behavioral/diagnostic evaluations.</p>
                                        </div>
                                        <select 
                                            value={learnerSectionFilter}
                                            onChange={(e) => setLearnerSectionFilter(e.target.value)}
                                            className="border border-slate-200 rounded-lg px-3 py-1.5 text-xs bg-slate-50"
                                        >
                                            <option value="All">All Sections</option>
                                            <option value="Section A">Section A</option>
                                            <option value="Section B">Section B</option>
                                        </select>
                                    </div>

                                    <div className="space-y-3">
                                        {mockStudents.map(student => (
                                            <div key={student.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm block">{student.name}</span>
                                                    <span className="text-slate-500">{student.section} • Condition: <strong className="text-emerald-700">{student.supportCondition}</strong></span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">{student.overallMastery}% Mastery</span>
                                                    <button 
                                                        onClick={() => setSelectedStudent(student)}
                                                        className="px-3.5 py-2 bg-[#4B8B6B] hover:bg-[#3D7257] text-white rounded-lg font-medium cursor-pointer"
                                                    >
                                                        View Data Profile & Diagnostics
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SECTION F CONTENT */}
                            {activeSection === 'preview' && (
                                <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
                                    <div className="border-b border-slate-100 pb-3">
                                        <h3 className="text-sm font-bold text-slate-900">f. Student Activity Preview (Game Client Simulator)</h3>
                                        <p className="text-xs text-slate-500">Preview how activities appear on the student side with SNED audio options.</p>
                                    </div>
                                    <div className="p-6 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/20 space-y-4">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-emerald-200 text-xs">
                                            <span className="font-bold text-emerald-900">🔊 Audio Assist: "Count the apples in the basket."</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Level 1: Counting Objects</span>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3">
                                            <span className="text-sm font-bold text-slate-800 block">Item #1: How many apples are shown?</span>
                                            <div className="flex justify-center gap-2 text-2xl">🍎 🍎</div>
                                            <div className="flex justify-center gap-3 pt-2">
                                                {['1', '2', '3'].map((opt) => (
                                                    <button key={opt} className="w-12 h-12 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer">{opt}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {/* Student Data Profile & Diagnostics Modal */}
                    {selectedStudent && (
                        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl border border-slate-200 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
                                
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900 text-base">{selectedStudent.name}'s Data Profile & Diagnostics</h3>
                                        <span className="text-slate-500">{selectedStudent.section} • Support Condition: <strong className="text-emerald-700">{selectedStudent.supportCondition}</strong></span>
                                    </div>
                                    <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer text-lg font-bold">✕</button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div>
                                        <span className="font-bold text-slate-700 block">Parent / Guardian:</span>
                                        <span className="text-slate-600">{selectedStudent.parentName} ({selectedStudent.parentEmail})</span>
                                    </div>
                                    <div>
                                        <span className="font-bold text-slate-700 block">Accommodations & Notes:</span>
                                        <span className="text-slate-600">{selectedStudent.accommodationNotes}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                                    <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                                        🧠 AI Behavioral & Diagnostic Insights
                                    </span>
                                    <p className="text-emerald-800 leading-relaxed">{selectedStudent.diagnosticInsights}</p>
                                </div>

                                <div className="space-y-3">
                                    <span className="font-bold text-slate-900 block text-sm">Itemized Level & Interaction Breakdown:</span>
                                    {selectedStudent.levelBreakdowns.map((lvl, lIdx) => (
                                        <div key={lIdx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                                            <span className="font-bold text-slate-800 block text-xs">{lvl.levelTitle}</span>
                                            <div className="space-y-1.5">
                                                {lvl.items.map((item, iIdx) => (
                                                    <div key={iIdx} className="flex justify-between items-center p-2 bg-slate-50 rounded border border-slate-100 text-[11px]">
                                                        <span className="text-slate-700 truncate pr-2">🔹 {item.prompt}</span>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <span className="text-slate-400">{item.timeSpent}</span>
                                                            <span className={`px-2 py-0.5 rounded font-semibold ${
                                                                item.result === 'Correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                            }`}>
                                                                {item.result}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button onClick={() => setSelectedStudent(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium cursor-pointer">Close Profile</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}