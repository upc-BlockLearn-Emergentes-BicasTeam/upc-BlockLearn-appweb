// NOTA: Todos los IDs ahora son `number` para coincidir con el backend.
// Los campos que el backend no devuelve (como `courses` en un `Teacher`) se marcan como opcionales.

export interface Institution {
  id: number;
  userId: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  logoUrl?: string;
}

export interface Teacher {
  id: number;
  userId: number;
  institutionId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
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
  passingGrade?: number;
  notesWeight?: number[];
  syllabusFileName?: string;
  syllabusHash?: string;
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  state: 'in_progress' | 'completed' | 'dropped';
  average: number;
}

export interface Syllabus {
  id: number;
  courseId: number;
  fileName: string;
  fileData: string; // Contenido en Base-64
  hash: string;
}

export interface NoteRecord {
  id: number;
  enrollmentId: number;
  title: string;
  score: number;
}

export interface Evaluation {
  id: number;
  courseId: number;
  teacherId: number;
  title: string;
  questions: Question[];
}

export interface Question {
  statement: string;
  answer: boolean;
}

export interface Certificate {
  id: number;
  enrollmentId: number;
  courseId: number;
  studentId: number;
  fileName: string;
  fileType?: string;
  fileData: string; // Contenido en Base-64
  issuedAt: string; // Fecha en formato ISO
}

export interface BlockchainEntry {
  id: number;
  blockHash: string;
  previousBlockHash: string;
  type: 'SYLLABUS' | 'CERTIFICATE' | 'NOTE_RECORD';
  referenceId: number;
  createdAt: string; // Fecha en formato ISO
}

// Interfaz para crear usuarios, necesaria para crear teachers/students
export interface UserPayload {
  email: string;
  password?: string;
  role: 'teacher' | 'student';
}
