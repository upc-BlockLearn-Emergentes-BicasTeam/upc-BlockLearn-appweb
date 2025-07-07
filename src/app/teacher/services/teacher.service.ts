import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import {forkJoin, Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {
  Teacher,
  Course,
  Enrollment,
  NoteRecord,
  Certificate,
  BlockchainEntry,
  Student,
  Syllabus
} from '../models/teacher.entity';

// Apuntamos a la nueva API de Spring Boot
const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class TeacherService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el perfil completo de un profesor, incluyendo la lista de sus cursos.
   * Asume un endpoint en el backend: GET /teachers/{id}?include=courses
   */
  getTeacherProfile(teacherId: number): Observable<Teacher> {
    // Idealmente, el backend ya devuelve el profesor con sus cursos.
    return this.http.get<Teacher>(`${API}/teachers/${teacherId}`).pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el detalle de un curso, incluyendo la lista de estudiantes matriculados.
   * Asume un endpoint en el backend: GET /courses/{id}?include=enrollments.student
   */


  // --- MÉTODOS CRUD PARA NOTAS (NoteRecord) ---

  getNotesByEnrollmentId(enrollmentId: number): Observable<NoteRecord[]> {
    const params = new HttpParams().set('enrollmentId', enrollmentId);
    return this.http.get<NoteRecord[]>(`${API}/notes-records`, { params }).pipe(catchError(this.handleError));
  }

  addNote(noteData: Omit<NoteRecord, 'id'>): Observable<NoteRecord> {
    return this.http.post<NoteRecord>(`${API}/notes-records`, noteData).pipe(catchError(this.handleError));
  }

  updateNote(noteId: number, updatedData: Partial<NoteRecord>): Observable<NoteRecord> {
    return this.http.put<NoteRecord>(`${API}/notes-records/${noteId}`, updatedData).pipe(catchError(this.handleError));
  }

  deleteNote(noteId: number): Observable<any> {
    return this.http.delete(`${API}/notes-records/${noteId}`).pipe(catchError(this.handleError));
  }

  // --- MÉTODOS CRUD PARA CERTIFICADOS (Certificate) ---



  getCertificateByEnrollmentId(enrollmentId: number): Observable<Certificate> {
    const params = new HttpParams().set('enrollmentId', enrollmentId.toString());
    // Asume que la API devuelve un solo objeto o 404, no un array.
    return this.http.get<Certificate>(`${API}/certificates`, { params }).pipe(catchError(this.handleError));
  }

  // --- HELPER DE MANEJO DE ERRORES ---

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred in TeacherService:', error);
    const errorBody = error.error;
    const errorMessage = (errorBody && typeof errorBody.message === 'string')
      ? errorBody.message
      : `Error: ${error.statusText} (Status: ${error.status})`;

    return throwError(() => new Error(errorMessage || 'An error occurred.'));
  }

  updateTeacherProfile(teacherId: number, changes: Partial<Omit<Teacher, 'id' | 'userId' | 'institutionId'>>): Observable<Teacher> {
    return this.http.put<Teacher>(`${API}/teachers/${teacherId}`, changes).pipe(catchError(this.handleError));
  }

  deleteCertificate(certificateId: number): Observable<any> {
    return this.http.delete(`${API}/certificates/${certificateId}`).pipe(catchError(this.handleError));
  }

  uploadCertificate(certificateData: Omit<Certificate, 'id' | 'issuedAt'>): Observable<Certificate> {
    return this.http.post<Certificate>(`${API}/certificates`, certificateData).pipe(catchError(this.handleError));
  }

  getBlockchainEntries(): Observable<BlockchainEntry[]> {
    return this.http.get<BlockchainEntry[]>(`${API}/blockchain-entries`).pipe(catchError(this.handleError));
  }

  getCourseDetails(courseId: number): Observable<Course> {
    // Ahora hacemos 4 llamadas en paralelo
    return forkJoin({
      course: this.http.get<Course>(`${API}/courses/${courseId}`),
      enrollments: this.http.get<Enrollment[]>(`${API}/enrollments`, { params: { courseId: courseId.toString() } }),
      students: this.http.get<Student[]>(`${API}/students`),
      // NUEVA LLAMADA: Obtiene TODOS los registros de notas
      allNotes: this.http.get<NoteRecord[]>(`${API}/notes-records`)
    }).pipe(
      map(({ course, enrollments, students, allNotes }) => {

        // Ensamblamos los datos aquí en el frontend
        enrollments.forEach(enrollment => {
          // 1. Asignamos el perfil del estudiante a la matrícula
          enrollment.student = students.find(s => s.id === enrollment.studentId);

          // 2. NUEVO: Asignamos los registros de notas a la matrícula
          enrollment.notesRecords = allNotes.filter(note => note.enrollmentId === enrollment.id);
        });

        course.enrollments = enrollments;
        return course;
      }),
      catchError(this.handleError)
    );
  }

  getSyllabusByCourseId(courseId: number): Observable<Syllabus> {
    return this.http.get<Syllabus>(`${API}/syllabuses/course/${courseId}`).pipe(catchError(this.handleError));
  }

  updateEnrollmentState(enrollmentId: number, newState: string): Observable<Enrollment> {
    const payload = { state: newState };
    return this.http.put<Enrollment>(`${API}/enrollments/${enrollmentId}/state`, payload).pipe(catchError(this.handleError));
  }

}
