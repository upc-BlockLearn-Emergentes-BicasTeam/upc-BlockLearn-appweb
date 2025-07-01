// src/app/institution/models/institution.entity.ts

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;

  /** profesor asignado */
  teacher: Teacher;

  /** pesos de cada nota parcial (0-100%) */
  notesWeight?: number[];

  /** nota mínima de aprobación (0-100) */
  passingGrade?: number;

  /** nombre de fichero de syllabus */
  syllabusFileName?: string;

  /** hash calculado al subir syllabus */
  syllabusHash?: string;
}

export interface BlockchainEntry {
  id: string;
  type: 'Certificate' | 'Syllabus' | 'Grade';
  hash: string;
  course?: Course;
  studentCode?: string;
  notes?: Array<{ label: string; value: string }>;
  finalAverage?: number;
  result?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;

  teachers?: Teacher[];
  students?: Student[];
  courses?: Course[];
  blockchainEntries?: BlockchainEntry[];
}
