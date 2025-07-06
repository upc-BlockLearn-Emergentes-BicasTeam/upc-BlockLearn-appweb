// ==========================================================
//  NUEVA ENTIDAD: Representa una única calificación o nota.
// ==========================================================
export interface NoteRecord {
  id: string;
  idEnrollment: string;
  title: string;
  score: number;
  hash?: string;
}

// ==========================================================
//  NUEVA ENTIDAD: Representa un certificado emitido.
//  Reutilizamos la misma entidad de la vista del profesor.
// ==========================================================
export interface Certificate {
  id: string;
  idCourse: string;
  idStudent: string;
  idEnrollment: string;
  fileName: string;
  fileType: string;
  fileData: string;
  issuedAt: string;
  hash?: string;
}

// ==========================================================
//  ENTIDAD MATRÍCULA: Actualizada para incluir el certificado.
// ==========================================================
export interface Enrollment {
  id: string;
  idCourse: string;
  idStudent: string;
  state: 'in_progress' | 'complete';

  // Estos campos se añadirán dinámicamente en el servicio para facilitar su uso en el componente.
  course?: Course;
  notesRecords?: NoteRecord[];
  average?: number;
  certificate?: Certificate; // <--- [NUEVO] El certificado asociado a esta matrícula.
}

// ==========================================================
//  ENTIDAD CURSO: Contiene los detalles del curso.
// ==========================================================
export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;
  notesWeight?: number[];
  passingGrade?: number;
  idTeacher?: string;
  teacherName?: string;
  syllabus?: Syllabus;
}

// ==========================================================
//  ENTIDAD ESTUDIANTE: El núcleo de esta vista.
// ==========================================================
export interface Student {
  id: string;
  idUser: string;
  idInstitution: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  enrollments?: Enrollment[];
}

// ==========================================================
//  ENTIDAD SÍLABO
// ==========================================================
export interface Syllabus {
  id: string;
  idCourse: string;
  fileName: string;
  fileData?: string;
  hash: string;
}
