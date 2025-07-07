// NOTA: Todos los IDs ahora son 'number'.
// Los campos anidados y opcionales se marcan con `?`.

export interface Student {
  id: number;
  userId: number;
  institutionId: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  enrollments?: Enrollment[]; // El perfil completo del estudiante puede incluir sus matrículas
}

export interface Enrollment {
  id: number;
  courseId: number;
  studentId: number;
  state: string; // 'in_progress', 'completed', etc.
  average: number;
  course?: Course; // El curso asociado a esta matrícula
  notesRecords?: NoteRecord[];
  certificate?: Certificate;
}

export interface Course {
  id: number;
  name: string;
  code: string;
  section: string;
  teacherId?: number;
  teacherName?: string; // Nombre del profesor, añadido por el backend o frontend
  notesWeight?: number[];
  passingGrade?: number;
  syllabus?: Syllabus;
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
  fileName: string;
  fileType: string;
  fileData: string; // Base64
  issuedAt: string; // ISO Date
}

export interface Syllabus {
  id: number;
  courseId: number;
  fileName: string;
  fileData?: string; // Base64
  hash: string;
}

// Puedes necesitar esta interfaz para el perfil del profesor
export interface Teacher {
  id: number;
  firstName: string;
  lastName: string;
}
