// NOTA: Todos los IDs ahora son 'number'.
// Los campos anidados (como `student` en `Enrollment`) se marcan como opcionales
// ya que el backend no siempre los devolverá en todas las peticiones.

import {Question} from '../../institution/models/institution.entity';

export interface Teacher {
  id: number;
  userId: number;
  institutionId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  courses?: Course[]; // Para la vista de perfil del profesor
}

export interface Student {
  id: number;
  userId: number;
  institutionId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Course {
  id: number;
  institutionId: number;
  teacherId: number;
  name: string;
  code: string;
  section: string;
  enrollments?: Enrollment[]; // Para la vista de detalle de un curso
  notesWeight?: number[]; // <-- AÑADIR ESTA LÍNEA
  passingGrade?: number; // <-- AÑADIR ESTA LÍNEA


}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  state: string;
  average: number;
  student?: Student; // El perfil del estudiante matriculado
  notesRecords?: NoteRecord[];
}

export interface NoteRecord {
  id: number;
  enrollmentId: number;
  title: string;
  score: number;
}

export interface Certificate {
  id: number;
  enrollmentId: number;
  courseId: number;     // <-- AÑADIR ESTA LÍNEA
  studentId: number;    // <-- AÑADIR ESTA LÍNEA
  fileName: string;
  fileType: string;
  fileData: string; // Base64
  issuedAt: string; // ISO Date
}

// Las entidades Syllabus, Evaluation y BlockchainEntry son las mismas que en Institution.
// Se pueden mantener aquí o mover a un directorio 'shared/models'.
export interface Syllabus {
  id: number;
  courseId: number;
  fileName: string;
  fileData: string;
  hash: string;
}

export interface Evaluation {
  id: number;
  courseId: number;
  teacherId: number;
  title: string;
  questions: Question[];
}
export interface BlockchainEntry {
  id: number;
  blockHash: string;
  previousBlockHash: string;
  type: 'SYLLABUS' | 'CERTIFICATE' | 'NOTE_RECORD';
  referenceId: number;
  createdAt: string; // Fecha en formato ISO
}
