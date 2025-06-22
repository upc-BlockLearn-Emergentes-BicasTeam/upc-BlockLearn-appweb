export interface Note {
  label: string;
  value: string;
}

export interface BlockchainEntry {
  id: string;
  type: 'Certificate' | 'Syllabus' | 'Grade';
  hash: string;
  course?: Course;
  studentCode?: string;
  notes?: Note[];
  finalAverage?: number;
  result?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;
  /** assigned teacher */
  teacher: Teacher;
  /** note weights (percentages) */
  notesWeight?: number[];
  /** passing threshold */
  passingGrade?: number;
  /** syllabus filename on server */
  syllabusFileName?: string;
  /** syllabus file hash */
  syllabusHash?: string;
  /** enrolled students */
  students?: Student[];
  /** related blockchain entries */
  blockchainEntries?: BlockchainEntry[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
  notes: number[];      // ej. [15, 12, 10, 18]
  average: number;      // ej. 13.75
  state: 'PROCESS' | 'COMPLETE';  // o string
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** courses this teacher instructs */
  courses?: Course[];

  blockchainEntries: BlockchainEntry[];
  /** Optional avatar URL for profile picture preview */
  avatarUrl?: string;
}
