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
  teacherId: string;
  notesWeight?: number[];
  passingGrade?: number;
  syllabusFileName?: string;
  syllabusHash?: string;
  students?: Student[];
  blockchainEntries?: BlockchainEntry[];
  evaluations?: Evaluation[]; // <-- NUEVO

}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  notes: number[];
  average: number;
  state: 'PROCESS' | 'COMPLETE';
}

export interface Teacher {
  id: string;
  idUser: string;
  idInstitution: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
  blockchainEntries?: BlockchainEntry[];
  avatarUrl?: string;
}
export interface Evaluation {
  id: string;
  question: string;
  answer: boolean;
}


export interface Syllabus {
  id: string;
  idCourse: string;
  fileName: string;        // mantiene el nombre “humano”
  fileData: string;        // <-- NUEVO  (Base-64)
  hash: string;
}
