// src/app/institution/models/institution.entity.ts

export interface Teacher {
  id: string;
  idUser: string;            /* ← string en todos los casos */
  idInstitution: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
  avatarUrl?: string;

}

export interface Student {
  id: string;
  idUser: string;
  idInstitution: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: Course[];
  avatarUrl?: string;

}

export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;  idTeacher: string;

  idInstitution: string;
  notesWeight?: number[];
  passingGrade?: number;
  syllabusFileName?: string;
  syllabusHash?: string;
}

export interface Syllabus {
  id: string;
  idCourse: string;
  fileName: string;        // mantiene el nombre “humano”
  fileData: string;        // <-- NUEVO  (Base-64)
  hash: string;
}

export interface Certification {
  id: string;
  idCourse: string;
  idStudent: string;
  finalAverage: number;
  result: string;
  hash: string;
}

export interface NotesRecord {
  id: string;
  idEnrollment: string;
  idEvaluation: string;
  score: number;
  percent: number;
  hash: string;
}

export interface BlockchainEntry {
  id: string;
  type: 'syllabus' | 'certification' | 'noteRecord';
  relatedId: string;
  hash: string;
}

export interface Institution {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}
export interface Enrollment {
  id:         string;        /* ← obligatorio */
  idCourse:   string;
  idStudent:  string;
  state:      'in_progress' | 'complete';
  average:    number;
}
