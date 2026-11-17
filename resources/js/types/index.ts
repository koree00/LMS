export type * from './auth';

export type MatatagSubject = 'Language' | 'Reading and Literacy' | 'Mathematics' | 'Makabansa' | 'GMRC';

export interface StudentProfile {
  id: string;
  name: string;
  section: string;
  condition: 'Mild ASD' | 'ADHD';
  bionicReadingPacing: number;
  audioPromptLevel: 'High' | 'Standard';
  sensoryPauseCount: number;
  lastActive: string;
}

export interface LessonPayload {
  teacherId: string;
  section: string;
  subject: MatatagSubject;
  title: string;
  file?: string;
  configurations: {
    bionicReading: boolean;
    chunking: 'standard' | 'high';
    pastelUI: boolean;
  };
  status: 'PENDING_SNED_VALIDATION' | 'APPROVED' | 'REVISED';
}