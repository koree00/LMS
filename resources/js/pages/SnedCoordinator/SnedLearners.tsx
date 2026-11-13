import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';

interface NotificationItem {
    id: number;
    text: string;
    time: string;
    unread: boolean;
    link: string;
}

interface BadgeItem {
    id: number;
    title: string;
    description: string;
    dateEarned: string;
    icon: string;
}

interface FeedbackItem {
    id: number;
    author: string;
    role: string;
    comment: string;
    timestamp: string;
}

interface LevelItem {
    levelNumber: number;
    levelName: string;
    status: 'Completed' | 'In Progress' | 'Locked';
    score: number;
    triggersCount: number;
    notes: string;
}

interface TopicSection {
    topicId: number;
    topicTitle: string;
    levels: LevelItem[];
}

interface SubjectPerformance {
    subject: string;
    topics: TopicSection[];
    behavioralImpact: string;
}

interface StudentProfile {
    id: number;
    name: string;
    section: string;
    condition: string;
    iepStatus: 'Compliant' | 'Review Needed' | 'Pending Update';
    age: number;
    gender: string;
    guardian: string;
    avatarInitials: string;
    badges: BadgeItem[];
    feedbackHistory: FeedbackItem[];
    subjects: SubjectPerformance[];
}

interface SnedLearnersProps {
    notifications?: NotificationItem[];
    students?: StudentProfile[];
}

export default function SnedLearners({ notifications = [], students = [] }: SnedLearnersProps) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    const [notifOpen, setNotifOpen] = useState<boolean>(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Navigation drill-down states
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Accordion states for expanding subjects and topics
    const [expandedSubject, setExpandedSubject] = useState<string | null>('Mathematics');
    const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({
        'Math-Topic-1': true,
        'Math-Topic-2': true
    });

    const toggleTopicCollapse = (topicKey: string) => {
        setExpandedTopics(prev => ({ ...prev, [topicKey]: !prev[topicKey] }));
    };

    const studentRecords: StudentProfile[] = students.length > 0 ? students : [
        {
            id: 1,
            name: 'Leonardo R. Cruz',
            section: 'Grade 1 — Section 1',
            condition: 'Mild ASD',
            iepStatus: 'Compliant',
            age: 6,
            gender: 'Male',
            guardian: 'Elena Cruz (Mother)',
            avatarInitials: 'LC',
            badges: [
                { id: 1, title: 'Counting Pioneer', description: 'Completed Math Tier 1 with zero sensory pauses.', dateEarned: 'Nov 10, 2026', icon: '🔢' },
                { id: 2, title: 'Bionic Reader Star', description: 'Maintained 1.2x pacing across reading comprehension.', dateEarned: 'Nov 12, 2026', icon: '⭐' }
            ],
            feedbackHistory: [
                { id: 1, author: 'Teacher Ana', role: 'Inclusive Teacher', comment: 'Leonardo responded very well to pastel card styling during the Math sorting exercise.', timestamp: 'Yesterday, 10:30 AM' },
                { id: 2, author: 'Elena Robles', role: 'SNED Coordinator', comment: 'Audio volume intensity adjusted successfully. Sensory pause triggers dropped by 40%.', timestamp: 'Nov 11, 2026' }
            ],
            subjects: [
                {
                    subject: 'Mathematics',
                    behavioralImpact: 'Exceptional pattern recognition speed and high focus on visual counting prompts.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Numbers & Quantity (1 to 5)',
                            levels: [
                                { levelNumber: 1, levelName: 'Counting 1 to 5 Objects', status: 'Completed', score: 95, triggersCount: 0, notes: 'Completed smoothly with audio prompts.' },
                                { levelNumber: 2, levelName: 'Number Recognition & Matching', status: 'Completed', score: 92, triggersCount: 0, notes: 'Fast response time on pastel cards.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Basic Arithmetic Operations',
                            levels: [
                                { levelNumber: 3, levelName: 'Simple Addition Concepts', status: 'Completed', score: 90, triggersCount: 1, notes: 'Used 1 sensory pause during sequence.' },
                                { levelNumber: 4, levelName: 'Subtractions Basics', status: 'Completed', score: 88, triggersCount: 0, notes: 'Maintained steady engagement.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Patterns & Sequencing',
                            levels: [
                                { levelNumber: 5, levelName: 'Math Pattern Mastery', status: 'Completed', score: 98, triggersCount: 0, notes: 'Earned Counting Pioneer badge.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Reading and Literacy',
                    behavioralImpact: 'Responds well to bionic highlighting; occasional pause needed during long paragraphs.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Alphabet & Phonemic Awareness',
                            levels: [
                                { levelNumber: 1, levelName: 'Alphabet Letter Sounds', status: 'Completed', score: 88, triggersCount: 1, notes: 'Audio replay used once.' },
                                { levelNumber: 2, levelName: 'Phoneme Matching Tier 1', status: 'Completed', score: 85, triggersCount: 1, notes: 'Good pace with single-column view.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Sight Words & Vocabulary',
                            levels: [
                                { levelNumber: 3, levelName: 'Sight Words Identification', status: 'Completed', score: 82, triggersCount: 2, notes: 'Triggered sensory pause at item 8.' },
                                { levelNumber: 4, levelName: 'Short Sentence Comprehension', status: 'In Progress', score: 75, triggersCount: 2, notes: 'Currently reviewing bionic pace.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Reading Comprehension',
                            levels: [
                                { levelNumber: 5, levelName: 'Story Reader Adventure', status: 'Locked', score: 0, triggersCount: 0, notes: 'Unlocks after Level 4 completion.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Language',
                    behavioralImpact: 'High focus during audio greetings; minimal fidgeting.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Oral Communication & Greetings',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagbati at Magalang na Pananalita', status: 'Completed', score: 90, triggersCount: 0, notes: 'Great accuracy on polite greetings.' },
                                { levelNumber: 2, levelName: 'Pagtukoy sa mga Bagay sa Paligid', status: 'Completed', score: 88, triggersCount: 1, notes: 'Standard session.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Following Directions & Family',
                            levels: [
                                { levelNumber: 3, levelName: 'Pagsunod sa Simpleng Utos', status: 'Completed', score: 85, triggersCount: 0, notes: 'Completed without issues.' },
                                { levelNumber: 4, levelName: 'Pagkilala sa Sariling Pamilya', status: 'Completed', score: 89, triggersCount: 0, notes: 'Matched family role icons instantly.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Stories & Narration',
                            levels: [
                                { levelNumber: 5, levelName: 'Kuwentuhang Pambata', status: 'In Progress', score: 70, triggersCount: 1, notes: 'Active module.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'GMRC',
                    behavioralImpact: 'Engaged enthusiastically with value story cards and interactive choices.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Pagmamahal sa Pamilya',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagmamahal sa Pamilya', status: 'Completed', score: 92, triggersCount: 0, notes: 'Excellent understanding of home roles.' },
                                { levelNumber: 2, levelName: 'Pagiging Matulungin sa Tahanan', status: 'Completed', score: 90, triggersCount: 0, notes: 'Completed quickly.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Paggalang at Katapatan',
                            levels: [
                                { levelNumber: 3, levelName: 'Paggalang sa Nakatatanda', status: 'Completed', score: 88, triggersCount: 1, notes: 'Brief pause taken.' },
                                { levelNumber: 4, levelName: 'Pagiging Tapat at Makatotoo', status: 'Completed', score: 91, triggersCount: 0, notes: 'Strong moral scenario choices.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Pakikipagkapwa-tao',
                            levels: [
                                { levelNumber: 5, levelName: 'Pagpapahalaga sa Kapwa', status: 'In Progress', score: 80, triggersCount: 0, notes: 'Ongoing practice.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Makabansa',
                    behavioralImpact: 'Visual icon cards effectively reduced cognitive load during community lessons.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Ang Aking Sarili at Paaralan',
                            levels: [
                                { levelNumber: 1, levelName: 'Ang Aking Paaralan', status: 'Completed', score: 88, triggersCount: 0, notes: 'School facilities identification.' },
                                { levelNumber: 2, levelName: 'Mga Guro at Kawani ng Paaralan', status: 'Completed', score: 86, triggersCount: 1, notes: 'Matched staff roles.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Komunidad at Kaligtasan',
                            levels: [
                                { levelNumber: 3, levelName: 'Tungkulin sa Paaralan', status: 'Completed', score: 85, triggersCount: 0, notes: 'Clean run.' },
                                { levelNumber: 4, levelName: 'Paggalang sa Watawat', status: 'Completed', score: 90, triggersCount: 0, notes: 'Patriotic values module.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Kaligtasan sa Tahanan at Paaralan',
                            levels: [
                                { levelNumber: 5, levelName: 'Ligtas na Tahanan at Paaralan', status: 'In Progress', score: 78, triggersCount: 1, notes: 'Safety checklist module.' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Chloe Samantha Tan',
            section: 'Grade 1 — Section 2',
            condition: 'ADHD',
            iepStatus: 'Review Needed',
            age: 7,
            gender: 'Female',
            guardian: 'Mark Tan (Father)',
            avatarInitials: 'CT',
            badges: [
                { id: 1, title: 'Focus Champion', description: 'Completed 3 consecutive sessions using single-column view.', dateEarned: 'Nov 09, 2026', icon: '🎯' }
            ],
            feedbackHistory: [
                { id: 1, author: 'Teacher Juan Dela Cruz', role: 'Inclusive Teacher', comment: 'Exceeded sensory pause threshold (6 triggers) during long reading module.', timestamp: 'Today, 11:15 AM' }
            ],
            subjects: [
                {
                    subject: 'Mathematics',
                    behavioralImpact: 'Enjoys interactive counting modules but gets restless when text blocks are dense.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Numbers & Quantity (1 to 5)',
                            levels: [
                                { levelNumber: 1, levelName: 'Counting 1 to 5 Objects', status: 'Completed', score: 85, triggersCount: 1, notes: 'Required 1 pause.' },
                                { levelNumber: 2, levelName: 'Number Recognition & Matching', status: 'Completed', score: 82, triggersCount: 2, notes: 'Frequent pacing adjustments.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Basic Arithmetic Operations',
                            levels: [
                                { levelNumber: 3, levelName: 'Simple Addition Concepts', status: 'Completed', score: 80, triggersCount: 1, notes: 'Steady progress.' },
                                { levelNumber: 4, levelName: 'Subtractions Basics', status: 'In Progress', score: 70, triggersCount: 3, notes: 'High trigger count.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Patterns & Sequencing',
                            levels: [
                                { levelNumber: 5, levelName: 'Math Pattern Mastery', status: 'Locked', score: 0, triggersCount: 0, notes: 'Pending Level 4.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Reading and Literacy',
                    behavioralImpact: 'Attention span dips after 10 minutes; benefits significantly from sensory pauses.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Alphabet & Phonemic Awareness',
                            levels: [
                                { levelNumber: 1, levelName: 'Alphabet Letter Sounds', status: 'Completed', score: 78, triggersCount: 2, notes: 'Audio replay used.' },
                                { levelNumber: 2, levelName: 'Phoneme Matching Tier 1', status: 'Completed', score: 75, triggersCount: 3, notes: 'Needed break.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Sight Words & Vocabulary',
                            levels: [
                                { levelNumber: 3, levelName: 'Sight Words Identification', status: 'In Progress', score: 68, triggersCount: 4, notes: 'Exceeded standard threshold.' },
                                { levelNumber: 4, levelName: 'Short Sentence Comprehension', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Reading Comprehension',
                            levels: [
                                { levelNumber: 5, levelName: 'Story Reader Adventure', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Language',
                    behavioralImpact: 'Required frequent audio pacing adjustments.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Oral Communication & Greetings',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagbati at Magalang na Pananalita', status: 'Completed', score: 80, triggersCount: 1, notes: 'Completed with guidance.' },
                                { levelNumber: 2, levelName: 'Pagtukoy sa mga Bagay sa Paligid', status: 'Completed', score: 76, triggersCount: 2, notes: 'Moderate focus.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Following Directions & Family',
                            levels: [
                                { levelNumber: 3, levelName: 'Pagsunod sa Simpleng Utos', status: 'In Progress', score: 72, triggersCount: 2, notes: 'Active.' },
                                { levelNumber: 4, levelName: 'Pagkilala sa Sariling Pamilya', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Stories & Narration',
                            levels: [
                                { levelNumber: 5, levelName: 'Kuwentuhang Pambata', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'GMRC',
                    behavioralImpact: 'Steady performance with picture matching tasks.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Pagmamahal sa Pamilya',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagmamahal sa Pamilya', status: 'Completed', score: 82, triggersCount: 1, notes: 'Good participation.' },
                                { levelNumber: 2, levelName: 'Pagiging Matulungin sa Tahanan', status: 'Completed', score: 80, triggersCount: 1, notes: 'Stable.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Paggalang at Katapatan',
                            levels: [
                                { levelNumber: 3, levelName: 'Paggalang sa Nakatatanda', status: 'In Progress', score: 75, triggersCount: 2, notes: 'Needs reminder.' },
                                { levelNumber: 4, levelName: 'Pagiging Tapat at Makatotoo', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Pakikipagkapwa-tao',
                            levels: [
                                { levelNumber: 5, levelName: 'Pagpapahalaga sa Kapwa', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Makabansa',
                    behavioralImpact: 'Good participation when guided by assistant teacher.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Ang Aking Sarili at Paaralan',
                            levels: [
                                { levelNumber: 1, levelName: 'Ang Aking Paaralan', status: 'Completed', score: 85, triggersCount: 1, notes: 'Completed.' },
                                { levelNumber: 2, levelName: 'Mga Guro at Kawani ng Paaralan', status: 'Completed', score: 80, triggersCount: 1, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Komunidad at Kaligtasan',
                            levels: [
                                { levelNumber: 3, levelName: 'Tungkulin sa Paaralan', status: 'In Progress', score: 74, triggersCount: 2, notes: 'In progress.' },
                                { levelNumber: 4, levelName: 'Paggalang sa Watawat', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Kaligtasan sa Tahanan at Paaralan',
                            levels: [
                                { levelNumber: 5, levelName: 'Ligtas na Tahanan at Paaralan', status: 'Locked', score: 0, triggersCount: 0, notes: 'Locked.' }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 3,
            name: 'Marcus Aurelius Lim',
            section: 'Grade 1 — Section 1',
            condition: 'Mild ASD',
            iepStatus: 'Compliant',
            age: 6,
            gender: 'Male',
            guardian: 'Grace Lim (Mother)',
            avatarInitials: 'ML',
            badges: [
                { id: 1, title: 'Makabansa Explorer', description: 'Completed family roles module with high accuracy.', dateEarned: 'Nov 11, 2026', icon: '🗺️' }
            ],
            feedbackHistory: [
                { id: 1, author: 'Teacher Maria Santos', role: 'Inclusive Teacher', comment: 'Audio prompt replay used 5 times. Verified headphone settings for auditory comfort.', timestamp: 'Today, 8:40 AM' }
            ],
            subjects: [
                {
                    subject: 'Mathematics',
                    behavioralImpact: 'Consistent counting pace and excellent visual retention.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Numbers & Quantity (1 to 5)',
                            levels: [
                                { levelNumber: 1, levelName: 'Counting 1 to 5 Objects', status: 'Completed', score: 92, triggersCount: 0, notes: 'Perfect score.' },
                                { levelNumber: 2, levelName: 'Number Recognition & Matching', status: 'Completed', score: 90, triggersCount: 0, notes: 'Smooth execution.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Basic Arithmetic Operations',
                            levels: [
                                { levelNumber: 3, levelName: 'Simple Addition Concepts', status: 'Completed', score: 88, triggersCount: 0, notes: 'No triggers.' },
                                { levelNumber: 4, levelName: 'Subtractions Basics', status: 'Completed', score: 85, triggersCount: 1, notes: 'Minor pause.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Patterns & Sequencing',
                            levels: [
                                { levelNumber: 5, levelName: 'Math Pattern Mastery', status: 'Completed', score: 89, triggersCount: 0, notes: 'Finished level.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Reading and Literacy',
                    behavioralImpact: 'Smooth phonetic sound matching with minimal auditory friction.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Alphabet & Phonemic Awareness',
                            levels: [
                                { levelNumber: 1, levelName: 'Alphabet Letter Sounds', status: 'Completed', score: 90, triggersCount: 0, notes: 'Clear pronunciation.' },
                                { levelNumber: 2, levelName: 'Phoneme Matching Tier 1', status: 'Completed', score: 88, triggersCount: 1, notes: 'Good pace.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Sight Words & Vocabulary',
                            levels: [
                                { levelNumber: 3, levelName: 'Sight Words Identification', status: 'Completed', score: 87, triggersCount: 0, notes: 'No issues.' },
                                { levelNumber: 4, levelName: 'Short Sentence Comprehension', status: 'Completed', score: 86, triggersCount: 1, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Reading Comprehension',
                            levels: [
                                { levelNumber: 5, levelName: 'Story Reader Adventure', status: 'Completed', score: 89, triggersCount: 0, notes: 'Completed.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Language',
                    behavioralImpact: 'Excellent comprehension of polite greetings and family vocabulary.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Oral Communication & Greetings',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagbati at Magalang na Pananalita', status: 'Completed', score: 94, triggersCount: 0, notes: 'Excellent.' },
                                { levelNumber: 2, levelName: 'Pagtukoy sa mga Bagay sa Paligid', status: 'Completed', score: 90, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Following Directions & Family',
                            levels: [
                                { levelNumber: 3, levelName: 'Pagsunod sa Simpleng Utos', status: 'Completed', score: 88, triggersCount: 0, notes: 'Completed.' },
                                { levelNumber: 4, levelName: 'Pagkilala sa Sariling Pamilya', status: 'Completed', score: 92, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Stories & Narration',
                            levels: [
                                { levelNumber: 5, levelName: 'Kuwentuhang Pambata', status: 'Completed', score: 91, triggersCount: 0, notes: 'Completed.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'GMRC',
                    behavioralImpact: 'Strong grasp of home values, chores, and respect.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Pagmamahal sa Pamilya',
                            levels: [
                                { levelNumber: 1, levelName: 'Pagmamahal sa Pamilya', status: 'Completed', score: 95, triggersCount: 0, notes: 'Exemplary.' },
                                { levelNumber: 2, levelName: 'Pagiging Matulungin sa Tahanan', status: 'Completed', score: 92, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Paggalang at Katapatan',
                            levels: [
                                { levelNumber: 3, levelName: 'Paggalang sa Nakatatanda', status: 'Completed', score: 90, triggersCount: 0, notes: 'Completed.' },
                                { levelNumber: 4, levelName: 'Pagiging Tapat at Makatotoo', status: 'Completed', score: 91, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Pakikipagkapwa-tao',
                            levels: [
                                { levelNumber: 5, levelName: 'Pagpapahalaga sa Kapwa', status: 'Completed', score: 93, triggersCount: 0, notes: 'Completed.' }
                            ]
                        }
                    ]
                },
                {
                    subject: 'Makabansa',
                    behavioralImpact: 'Completed all community helper and school environment levels with distinction.',
                    topics: [
                        {
                            topicId: 1,
                            topicTitle: 'Topic 1: Ang Aking Sarili at Paaralan',
                            levels: [
                                { levelNumber: 1, levelName: 'Ang Aking Paaralan', status: 'Completed', score: 96, triggersCount: 0, notes: 'Top score.' },
                                { levelNumber: 2, levelName: 'Mga Guro at Kawani ng Paaralan', status: 'Completed', score: 94, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 2,
                            topicTitle: 'Topic 2: Komunidad at Kaligtasan',
                            levels: [
                                { levelNumber: 3, levelName: 'Tungkulin sa Paaralan', status: 'Completed', score: 92, triggersCount: 0, notes: 'Completed.' },
                                { levelNumber: 4, levelName: 'Paggalang sa Watawat', status: 'Completed', score: 95, triggersCount: 0, notes: 'Completed.' }
                            ]
                        },
                        {
                            topicId: 3,
                            topicTitle: 'Topic 3: Kaligtasan sa Tahanan at Paaralan',
                            levels: [
                                { levelNumber: 5, levelName: 'Ligtas na Tahanan at Paaralan', status: 'Completed', score: 93, triggersCount: 0, notes: 'Completed.' }
                            ]
                        }
                    ]
                }
            ]
        }
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
        { id: 1, text: 'New student telemetry record added for Chloe Tan', time: '15m ago', unread: true, link: '/sned-coordinator/learners' }
    ]);

    const unreadCount = notifList.length;

    const availableSections = Array.from(new Set(studentRecords.map(s => s.section)));

    const filteredStudents = studentRecords.filter(student => {
        const matchesSection = selectedSection ? student.section === selectedSection : true;
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || 
            student.name.toLowerCase().includes(q) || 
            student.condition.toLowerCase().includes(q);
        return matchesSection && matchesSearch;
    });

    const activeStudent = studentRecords.find(s => s.id === selectedStudentId);

    return (
        <>
            <Head title="Learners File & Student Profiles · SNED Portal"/>
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
                                <Link href="/sned-coordinator/learners" className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-emerald-50 text-slate-900 font-medium text-xs border border-slate-100 transition-all ${!sidebarOpen ? 'md:justify-center px-0' : ''}`} title="Learners File">
                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                                    {sidebarOpen && <span>Learners File</span>}
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
                            <span className="text-xs font-semibold text-slate-500 truncate">
                                SNED Portal / Learners File {selectedSection ? ` / ${selectedSection}` : ''} {activeStudent ? ` / ${activeStudent.name}` : ''}
                            </span>
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
                        <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                <div>
                                    <h1 className="text-sm font-bold text-slate-900">Learners File — Class Sections</h1>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Select a class section below to view enrolled inclusion students and individual profiles.</p>
                                </div>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-slate-200/60 font-bold text-xs rounded-full">
                                    {studentRecords.length} Total Enrolled Learners
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Available Sections</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {availableSections.map(sectionName => {
                                        const secStudents = studentRecords.filter(s => s.section === sectionName);
                                        const compliantCount = secStudents.filter(s => s.iepStatus === 'Compliant').length;

                                        return (
                                            <div 
                                                key={sectionName}
                                                onClick={() => { setSelectedSection(sectionName); setSelectedStudentId(null); }}
                                                className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 hover:border-slate-400 hover:bg-white hover:shadow-sm transition-all cursor-pointer space-y-4 group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 border border-slate-200/60 flex items-center justify-center font-bold text-xs group-hover:bg-[#4B8B6B] group-hover:text-white transition-all">
                                                            🏫
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#4B8B6B] transition-all">{sectionName}</h3>
                                                            <span className="text-[10px] text-slate-400">{secStudents.length} inclusion students enrolled</span>
                                                        </div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                                                        {compliantCount} IEP Compliant
                                                    </span>
                                                </div>

                                                <div className="flex justify-end pt-2 border-t border-slate-200/60">
                                                    <span className="text-[11px] font-semibold text-[#4B8B6B] group-hover:underline">View Section Students →</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STAGE 2: STUDENT CARDS GRID */}
                    {selectedSection && !activeStudent && (
                        <div className="space-y-4">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setSelectedSection(null)}
                                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                                        >
                                            ← Back to Sections
                                        </button>
                                        <div>
                                            <h1 className="text-sm font-bold text-slate-900">{selectedSection} — Learners Directory</h1>
                                            <p className="text-[11px] text-slate-500">Click a student card to open their complete profile, badges, feedback, and subject performance matrix.</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-slate-200 font-semibold text-xs rounded-full">
                                        {filteredStudents.length} Students
                                    </span>
                                </div>

                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                                    </span>
                                    <input 
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search student by name or condition..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudents.length === 0 ? (
                                    <div className="col-span-full bg-white p-10 rounded-2xl border border-slate-200/70 text-center text-slate-400 text-xs">
                                        No students found matching your search in {selectedSection}.
                                    </div>
                                ) : (
                                    filteredStudents.map(student => (
                                        <div 
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className="bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-slate-400 hover:shadow-md transition-all cursor-pointer space-y-4 group"
                                        >
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center border border-slate-200 shadow-2xs">
                                                        {student.avatarInitials}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-[#4B8B6B] transition-all">{student.name}</h3>
                                                        <span className="text-[10px] text-slate-400">{student.section}</span>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                    student.iepStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    {student.iepStatus}
                                                </span>
                                            </div>

                                            <div className="space-y-1.5 text-xs">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Condition:</span>
                                                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] border border-slate-200/60">{student.condition}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Badges Earned:</span>
                                                    <span className="font-bold text-slate-800">{student.badges.length} badges</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Feedback Logs:</span>
                                                    <span className="font-bold text-slate-800">{student.feedbackHistory.length} notes</span>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-1">
                                                <span className="text-[11px] font-semibold text-[#4B8B6B] group-hover:underline">View Student Profile →</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* STAGE 3: DETAILED STUDENT PROFILE DOSSIER */}
                    {activeStudent && (
                        <div className="space-y-6">
                            <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm flex items-center justify-between">
                                <button 
                                    onClick={() => setSelectedStudentId(null)}
                                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                                >
                                    ← Back to {selectedSection} Directory
                                </button>
                                <span className="text-xs font-bold text-slate-900">Student Profile & Performance Dossier</span>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-900 font-bold text-sm flex items-center justify-center border border-slate-200 shadow-2xs">
                                            {activeStudent.avatarInitials}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h1 className="text-base font-bold text-slate-900">{activeStudent.name}</h1>
                                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full border border-slate-200/60">
                                                    {activeStudent.condition}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-0.5">{activeStudent.section} · Guardian: {activeStudent.guardian}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        activeStudent.iepStatus === 'Compliant' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                    }`}>
                                        IEP Status: {activeStudent.iepStatus}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 text-xs">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Age</span>
                                        <span className="font-bold text-slate-800 text-sm">{activeStudent.age} years old</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Gender</span>
                                        <span className="font-bold text-slate-800 text-sm">{activeStudent.gender}</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Badges Earned</span>
                                        <span className="font-bold text-emerald-800 text-sm">{activeStudent.badges.length} Milestones</span>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                        <span className="text-slate-400 block text-[10px] uppercase font-semibold">Feedback Notes</span>
                                        <span className="font-bold text-slate-800 text-sm">{activeStudent.feedbackHistory.length} Entries</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Gamified Badges & Achievements</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {activeStudent.badges.map(badge => (
                                        <div key={badge.id} className="bg-emerald-50/40 border border-slate-200/60 p-4 rounded-xl flex items-start gap-3">
                                            <span className="text-2xl">{badge.icon}</span>
                                            <div>
                                                <h3 className="text-xs font-bold text-slate-900">{badge.title}</h3>
                                                <p className="text-[11px] text-slate-600 mt-0.5">{badge.description}</p>
                                                <span className="text-[10px] text-slate-400 mt-2 block">Earned on {badge.dateEarned}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Teacher & Coordinator Feedback History</h2>
                                <div className="space-y-3">
                                    {activeStudent.feedbackHistory.map(fb => (
                                        <div key={fb.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-slate-900">{fb.author} <span className="text-[10px] font-medium text-slate-500">({fb.role})</span></span>
                                                <span className="text-[10px] text-slate-400">{fb.timestamp}</span>
                                            </div>
                                            <p className="text-xs text-slate-700 leading-relaxed">{fb.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MATATAG SUBJECTS WITH TOPIC INDICATORS & LEVEL BREAKDOWN HIERARCHY */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">MATATAG Subject Performance & Topic Breakdown Matrix</h2>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Explore subject chapters (Topics), sub-levels, scores, and sensory triggers for this learner.</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    {activeStudent.subjects.map((subj, idx) => {
                                        const isExpanded = expandedSubject === subj.subject;
                                        const totalLevelsCount = subj.topics.reduce((acc, t) => acc + t.levels.length, 0);
                                        const completedLevelsCount = subj.topics.reduce((acc, t) => acc + t.levels.filter(l => l.status === 'Completed').length, 0);

                                        return (
                                            <div key={idx} className="bg-slate-50/60 border border-slate-200/70 rounded-2xl overflow-hidden transition-all">
                                                {/* Subject Header / Accordion Toggle */}
                                                <div 
                                                    onClick={() => setExpandedSubject(isExpanded ? null : subj.subject)}
                                                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/60 transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200/60">
                                                            📚
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xs font-bold text-slate-900">{subj.subject}</h3>
                                                            <span className="text-[10px] text-slate-500">{completedLevelsCount} / {totalLevelsCount} Levels Completed across {subj.topics.length} Topics</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold text-[10px] rounded-full border border-slate-200/60">
                                                            {completedLevelsCount === totalLevelsCount ? 'Mastery Achieved' : 'In Progress'}
                                                        </span>
                                                        <span className="text-xs font-semibold text-[#4B8B6B]">
                                                            {isExpanded ? 'Collapse Topics ▲' : 'Expand Topics ▼'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Expanded Topics & Level Hierarchy Breakdown */}
                                                {isExpanded && (
                                                    <div className="p-4 bg-white border-t border-slate-200/60 space-y-4">
                                                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                                            <strong>Behavioral Impact Summary:</strong> {subj.behavioralImpact}
                                                        </p>

                                                        {/* Topic Indicators */}
                                                        <div className="space-y-3">
                                                            {subj.topics.map((topic, tIdx) => {
                                                                const topicKey = `${subj.subject}-Topic-${topic.topicId}`;
                                                                const isTopicExpanded = expandedTopics[topicKey] ?? true;

                                                                return (
                                                                    <div key={tIdx} className="bg-slate-50/80 border border-slate-200 rounded-xl overflow-hidden">
                                                                        <div 
                                                                            onClick={() => toggleTopicCollapse(topicKey)}
                                                                            className="px-4 py-2.5 bg-emerald-50/60 border-b border-slate-200/60 flex items-center justify-between cursor-pointer hover:bg-emerald-100/50 transition-all"
                                                                        >
                                                                            <span className="text-xs font-bold text-slate-900">{topic.topicTitle}</span>
                                                                            <span className="text-[11px] font-semibold text-[#4B8B6B]">
                                                                                {isTopicExpanded ? 'Hide Levels ▲' : 'Show Levels ▼'}
                                                                            </span>
                                                                        </div>

                                                                        {isTopicExpanded && (
                                                                            <div className="p-3 bg-white space-y-2">
                                                                                <div className="overflow-x-auto">
                                                                                    <table className="w-full text-left text-xs">
                                                                                        <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100 text-[10px]">
                                                                                            <tr>
                                                                                                <th className="p-2.5 pl-3">Level</th>
                                                                                                <th className="p-2.5">Task / Lesson Name</th>
                                                                                                <th className="p-2.5">Status</th>
                                                                                                <th className="p-2.5">Score</th>
                                                                                                <th className="p-2.5">Sensory Triggers</th>
                                                                                                <th className="p-2.5">Teacher / Coordinator Notes</th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <tbody className="divide-y divide-slate-100">
                                                                                            {topic.levels.map((lvl) => (
                                                                                                <tr key={lvl.levelNumber} className="hover:bg-slate-50/50 transition-all">
                                                                                                    <td className="p-2.5 pl-3 font-bold text-slate-900">Lvl {lvl.levelNumber}</td>
                                                                                                    <td className="p-2.5 font-medium text-slate-800">{lvl.levelName}</td>
                                                                                                    <td className="p-2.5">
                                                                                                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                                                                                            lvl.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                                                                                            lvl.status === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                                                                                                        }`}>
                                                                                                            {lvl.status}
                                                                                                        </span>
                                                                                                    </td>
                                                                                                    <td className="p-2.5 font-extrabold text-slate-900">
                                                                                                        {lvl.status === 'Locked' ? '—' : `${lvl.score}%`}
                                                                                                    </td>
                                                                                                    <td className="p-2.5">
                                                                                                        {lvl.status === 'Locked' ? '—' : (
                                                                                                            <span className={`px-2 py-0.5 font-bold text-[10px] rounded-full ${
                                                                                                                lvl.triggersCount > 1 ? 'bg-rose-50 text-rose-700 border border-slate-200/60' : 'bg-slate-100 text-slate-700'
                                                                                                            }`}>
                                                                                                                {lvl.triggersCount} triggers
                                                                                                            </span>
                                                                                                        )}
                                                                                                    </td>
                                                                                                    <td className="p-2.5 text-slate-500 italic">{lvl.notes}</td>
                                                                                                </tr>
                                                                                            ))}
                                                                                        </tbody>
                                                                                    </table>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </>
    );
}