// ==========================================================
//  NUEVA ENTIDAD: Representa una única calificación o nota.
//  Esta es la pieza central de la nueva arquitectura.
// ==========================================================
export interface NoteRecord {
  id: string;
  idEnrollment: string;
  title: string;
  score: number;
  hash?: string;
}


// ==========================================================
//  ENTIDAD ESTUDIANTE: Simplificada.
//  Ya no almacena directamente las notas ni el promedio.
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
}


// ==========================================================
//  ENTIDAD MATRÍCULA: Ahora es un objeto "enriquecido".
//  Actúa como el puente que conecta a un estudiante con un curso
//  y contiene la lista de sus notas para ese curso.
// ==========================================================
export interface Enrollment {
  id: string;
  idCourse: string;
  idStudent: string;
  state: 'in_progress' | 'complete';

  // Estos campos se añadirán dinámicamente en el servicio para facilitar su uso en el componente.
  student?: Student;
  notesRecords?: NoteRecord[];
  average?: number;
}


// ==========================================================
//  ENTIDAD CURSO: Actualizada para usar matrículas.
//  En lugar de una lista de estudiantes, ahora tendrá una lista
//  de matrículas (que a su vez contienen al estudiante y sus notas).
// ==========================================================
export interface Course {
  id: string;
  name: string;
  code: string;
  section: string;
  idTeacher: string;
  idInstitution: string;
  notesWeight?: number[];
  passingGrade?: number;
  syllabusFileName?: string;
  syllabusHash?: string;
  evaluations?: Evaluation[];
  blockchainEntries?: BlockchainEntry[];

  // El cambio principal es aquí:
  enrollments?: Enrollment[];
}


// ==========================================================
//  ENTIDADES RESTANTES (Sin cambios estructurales importantes)
// ==========================================================
export interface Teacher {
  id: string;
  idUser: string;
  idInstitution: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  courses?: Course[];
  blockchainEntries?: BlockchainEntry[];
}

export interface Evaluation {
  id: string;
  question: string;
  answer: boolean;
}

export interface Syllabus {
  id: string;
  idCourse: string;
  fileName: string;
  fileData?: string;
  hash: string;
}

export interface BlockchainEntry {
  id: string;
  type: 'Certificate' | 'Syllabus' | 'Grade';
  hash: string;
  course?: Course;
  studentCode?: string;
  notes?: { label: string; value: string; }[]; // Este 'notes' es para el certificado, no confundir con NoteRecord
  finalAverage?: number;
  result?: string;
}


export interface Certificate {
  id: string;          // ID único del certificado
  idCourse: string;      // ID del curso al que pertenece
  idStudent: string;     // ID del estudiante que lo recibe
  idEnrollment: string;  // ID de la matrícula que lo generó (vínculo clave)
  fileName: string;      // Nombre del archivo original (ej. "certificado-juan-perez.pdf")
  fileType: string;      // MIME type del archivo (ej. "application/pdf")
  fileData: string;      // El contenido del archivo en formato Base64
  issuedAt: string;      // Fecha de emisión en formato ISO (ej. "2023-10-27T10:00:00Z")
  hash?: string;         // Hash opcional para integridad (similar a Syllabus)
}
