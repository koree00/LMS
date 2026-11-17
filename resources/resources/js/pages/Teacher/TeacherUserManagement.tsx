import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
}

interface StudentUser {
    id: number;
    name: string;
    email: string;
    section: 'Section A' | 'Section B';
    supportCondition: string; 
    accommodationNotes: string; 
    parentName: string;
    parentEmail: string;
    linkStatus: 'Linked' | 'Invite Sent';
}

export default function TeacherUserManagement() {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });
    
    // Filter states
    const [selectedSection, setSelectedSection] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Student & Linked Parent Roster State
    const [students, setStudents] = useState<StudentUser[]>([
        { 
            id: 1, 
            name: 'Mia Santos', 
            email: 'mia.santos@eduquest.ai', 
            section: 'Section A', 
            supportCondition: 'Mild Autism', 
            accommodationNotes: 'Requires structured visual schedule and noise-canceling headphones.',
            parentName: 'Maria Santos (Mother)', 
            parentEmail: 'maria.santos@gmail.com', 
            linkStatus: 'Linked' 
        },
        { 
            id: 2, 
            name: 'Noah Perez', 
            email: 'noah.perez@eduquest.ai', 
            section: 'Section A', 
            supportCondition: 'ADHD', 
            accommodationNotes: 'Benefits from movement breaks and frequent redirection.',
            parentName: 'Carlos Perez (Father)', 
            parentEmail: 'carlos.perez@yahoo.com', 
            linkStatus: 'Invite Sent' 
        },
        { 
            id: 3, 
            name: 'Ava Reyes', 
            email: 'ava.reyes@eduquest.ai', 
            section: 'Section B', 
            supportCondition: 'Others: Speech & Language Delay', 
            accommodationNotes: 'Needs extra processing time during oral recitation.',
            parentName: 'Elena Reyes (Guardian)', 
            parentEmail: 'elena.reyes@gmail.com', 
            linkStatus: 'Linked' 
        },
    ]);

    // Modal state for adding new student & parent
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [newName, setNewName] = useState<string>('');
    const [newEmail, setNewEmail] = useState<string>('');
    const [newSection, setNewSection] = useState<'Section A' | 'Section B'>('Section A');
    
    // Support Condition States (Mild Autism, ADHD, or Others with custom input)
    const [newSupportCondition, setNewSupportCondition] = useState<string>('Mild Autism');
    const [otherConditionText, setOtherConditionText] = useState<string>('');
    
    const [newAccommodationNotes, setNewAccommodationNotes] = useState<string>('');
    const [newParentName, setNewParentName] = useState<string>('');
    const [newParentEmail, setNewParentEmail] = useState<string>('');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newParentEmail) return;

        // Finalize support condition string based on selection
        const finalSupportCondition = newSupportCondition === 'Others' 
            ? (otherConditionText ? `Others: ${otherConditionText}` : 'Others') 
            : newSupportCondition;

        const newStudentEntry: StudentUser = {
            id: Date.now(),
            name: newName,
            email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.') }@eduquest.ai`,
            section: newSection,
            supportCondition: finalSupportCondition,
            accommodationNotes: newAccommodationNotes || 'Standard classroom pacing.',
            parentName: newParentName || 'Parent / Guardian',
            parentEmail: newParentEmail,
            linkStatus: 'Invite Sent'
        };

        setStudents([...students, newStudentEntry]);
        setNewName('');
        setNewEmail('');
        setNewSupportCondition('Mild Autism');
        setOtherConditionText('');
        setNewAccommodationNotes('');
        setNewParentName('');
        setNewParentEmail('');
        setIsAddModalOpen(false);
    };

    // Filter logic
    const filteredStudents = students.filter(student => {
        const matchesSection = selectedSection === 'All' || student.section === selectedSection;
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              student.parentEmail.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSection && matchesSearch;
    });

    return (
        <>
            <Head title="User & Roster Management — Teacher Portal · San Mateo Elementary School" />
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
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6h16M4 12h16M4 18h16" /></svg>
                            </button>
                        </div>

                        <div>
                            {sidebarOpen && <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-1">Teacher</div>}
                            <nav className="space-y-1">
                                <Link href="/teacher/overview" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                                    {sidebarOpen && <span>Overview</span>}
                                </Link>
                                 <Link href="/teacher/subjects" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent hover:border-slate-200/70 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                                                                                    <svg className="w-4 h-4 shrink-0 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                                                                                                    {sidebarOpen && <span>Subjects</span>}
                                                                                                </Link>
                                <Link href="/teacher/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>Learners</span>}
                                </Link>
                               
                                <Link href="/teacher/observations" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                                    {sidebarOpen && <span>Observations</span>}
                                </Link>
                                <Link href="/teacher/reports" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                    {sidebarOpen && <span>Reports</span>}
                                </Link>
                                <Link href="/teacher/messages" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
                                    {sidebarOpen && <span>Messages</span>}
                                </Link>

                                {/* User Management (Placed right before Schedule) */}
                                <Link href="/teacher/users" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
                                    <svg className="w-4 h-4 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>User Management</span>}
                                </Link>

                                <Link href="/teacher/schedule" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 font-medium text-xs border border-transparent transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`}>
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
                            <span className="text-xs font-semibold text-slate-500 truncate">User Management / Teacher</span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                TA
                            </div>
                        </div>
                    </div>

                    {/* Header & Add Button */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Grade 1 Student Roster & SNED Conditions</h1>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage student support profiles (Mild Autism, ADHD, Others) and linked parent accounts.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-[#4B8B6B] hover:bg-[#3D7257] text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer w-fit"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                            <span>Add Student & Parent Account</span>
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by student name or parent email..." 
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        />
                        <select 
                            value={selectedSection}
                            onChange={(e) => setSelectedSection(e.target.value)}
                            className="w-full bg-slate-50/50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        >
                            <option value="All">All Sections (Grade 1)</option>
                            <option value="Section A">Section A</option>
                            <option value="Section B">Section B</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl border border-slate-200/70 p-6 space-y-4 shadow-sm w-full">
                        <h2 className="text-sm font-bold text-slate-900">Enrolled Roster ({filteredStudents.length})</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                                        <th className="pb-3 uppercase tracking-wider text-[10px]">Student Name</th>
                                        <th className="pb-3 uppercase tracking-wider text-[10px]">Section & Support Condition</th>
                                        <th className="pb-3 uppercase tracking-wider text-[10px]">Linked Parent / Guardian</th>
                                        <th className="pb-3 uppercase tracking-wider text-[10px]">Account Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredStudents.map((student) => (
                                        <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5">
                                                <span className="font-bold text-slate-900 block">{student.name}</span>
                                                <span className="text-[11px] text-slate-400">{student.email}</span>
                                            </td>
                                            <td className="py-3.5">
                                                <span className="font-semibold text-slate-700 block">{student.section}</span>
                                                <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200 inline-block mt-0.5 font-medium">
                                                    {student.supportCondition}
                                                </span>
                                            </td>
                                            <td className="py-3.5">
                                                <span className="font-semibold text-slate-800 block">{student.parentName}</span>
                                                <span className="text-[11px] text-slate-500">{student.parentEmail}</span>
                                            </td>
                                            <td className="py-3.5">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                                                    student.linkStatus === 'Linked' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                                                }`}>
                                                    {student.linkStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add Modal with Mild Autism, ADHD, and Others Condition */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-3xs">
                            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <h3 className="font-bold text-slate-900 text-sm">Add Student & Support Condition</h3>
                                    <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                                    </button>
                                </div>

                                <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block font-medium text-slate-700 mb-1">Student Full Name</label>
                                            <input type="text" required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Leo Cruz" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                                        </div>
                                        <div>
                                            <label className="block font-medium text-slate-700 mb-1">Section</label>
                                            <select value={newSection} onChange={(e) => setNewSection(e.target.value as 'Section A' | 'Section B')} className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                                <option value="Section A">Section A</option>
                                                <option value="Section B">Section B</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Support Condition Dropdown */}
                                    <div>
                                        <label className="block font-medium text-slate-700 mb-1">Learner Support Condition</label>
                                        <select 
                                            value={newSupportCondition}
                                            onChange={(e) => setNewSupportCondition(e.target.value)}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-white"
                                        >
                                            <option value="Mild Autism">Mild Autism</option>
                                            <option value="ADHD">ADHD</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>

                                    {/* Conditional Text Box if "Others" is selected */}
                                    {newSupportCondition === 'Others' && (
                                        <div>
                                            <label className="block font-medium text-slate-700 mb-1">Specify Other Condition</label>
                                            <input 
                                                type="text"
                                                required
                                                value={otherConditionText}
                                                onChange={(e) => setOtherConditionText(e.target.value)}
                                                placeholder="e.g. Speech Delay, Visual Impairment..."
                                                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                            />
                                        </div>
                                    )}

                                    {/* Accommodation Request Box */}
                                    <div>
                                        <label className="block font-medium text-slate-700 mb-1">Special Accommodations / Teacher Notes</label>
                                        <textarea 
                                            rows={2}
                                            value={newAccommodationNotes}
                                            onChange={(e) => setNewAccommodationNotes(e.target.value)}
                                            placeholder="e.g. Requires audio prompts or structured visual schedules..."
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                                        />
                                    </div>

                                    <div className="pt-2 border-t border-slate-100 space-y-3">
                                        <span className="font-bold text-slate-900 block text-xs">Parent / Guardian Connection</span>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block font-medium text-slate-700 mb-1">Parent Name & Relation</label>
                                                <input type="text" value={newParentName} onChange={(e) => setNewParentName(e.target.value)} placeholder="e.g. Father" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                                            </div>
                                            <div>
                                                <label className="block font-medium text-slate-700 mb-1">Parent Email (Invite Key)</label>
                                                <input type="email" required value={newParentEmail} onChange={(e) => setNewParentEmail(e.target.value)} placeholder="parent@gmail.com" className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-3">
                                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 cursor-pointer">Cancel</button>
                                        <button type="submit" className="px-4 py-2 bg-[#4B8B6B] text-white font-medium rounded-lg hover:bg-[#3D7257] cursor-pointer shadow-sm">Save Student Record</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}