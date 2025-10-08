// src/app/institution/services/institution.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  Institution, Teacher, Student, Course,
  BlockchainEntry, Syllabus, Certification, NotesRecord, Enrollment
} from '../models/institution.entity';
import {delay, forkJoin, Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';

const API = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class InstitutionService {

  constructor(private http: HttpClient) {}
  /** ─── Institution ─── */
  getAllInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>(`${API}/institutions`).pipe(catchError(this.handleError));
  }

  getInstitutionById(id: string): Observable<Institution> {
    return this.http.get<Institution>(`${API}/institutions/${id}`).pipe(catchError(this.handleError));
  }
  updateInstitution(id: string, changes: Partial<Institution>): Observable<Institution> {
    return this.http.patch<Institution>(`${API}/institutions/${id}`, changes).pipe(catchError(this.handleError));
  }
  /** ─── Courses ─── */
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${API}/courses`).pipe(catchError(this.handleError));
  }


  createCourse(course: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(`${API}/courses`, course)
      .pipe(catchError(this.handleError));
  }

  updateCourses(courses: Course[]): Observable<Course[]> {
    return this.http.put<Course[]>(`${API}/courses`, courses).pipe(catchError(this.handleError));
  }

  /** ─── Teachers ─── */
  getTeachers(): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${API}/teachers`).pipe(catchError(this.handleError));
  }

  getTeachersByInstitution(idInstitution: string): Observable<Teacher[]> {
    return this.http.get<Teacher[]>(`${API}/teachers?idInstitution=${idInstitution}`).pipe(catchError(this.handleError));
  }

  updateTeachers(teachers: Teacher[]): Observable<Teacher[]> {
    return this.http.put<Teacher[]>(`${API}/teachers`, teachers).pipe(catchError(this.handleError));
  }

  /** ─── Students ─── */
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${API}/students`).pipe(catchError(this.handleError));
  }



  updateStudents(students: Student[]): Observable<Student[]> {
    return this.http.put<Student[]>(`${API}/students`, students).pipe(catchError(this.handleError));
  }

  /** ─── Enrollments ─── */
  getEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${API}/enrollments`).pipe(catchError(this.handleError));
  }

  /** ─── Blockchain ─── */
  getBlockchainEntries(): Observable<BlockchainEntry[]> {
    return this.http.get<BlockchainEntry[]>(`${API}/blockchainEntries`).pipe(catchError(this.handleError));
  }

  /** ─── Syllabuses ─── */
  getSyllabuses(): Observable<Syllabus[]> {
    return this.http.get<Syllabus[]>(`${API}/syllabuses`).pipe(catchError(this.handleError));
  }

  /** ─── Certification / Notas ─── */
  getCertifications(): Observable<Certification[]> {
    return this.http.get<Certification[]>(`${API}/certifications`).pipe(catchError(this.handleError));
  }

  getNotesRecords(): Observable<NotesRecord[]> {
    return this.http.get<NotesRecord[]>(`${API}/notesRecords`).pipe(catchError(this.handleError));
  }

  /* ──────────────────────────── USUARIOS ──────────────────────────── */
  createUser(payload: { email: string; password: string; role: string }) {
    return this.http.post<{ id: string }>(`${API}/users`, payload)
      .pipe(catchError(this.handleError));
  }

  getUserByEmail(email: string) {
    return this.http.get<any[]>(`${API}/users?email=${email}`)
      .pipe(map(arr => arr[0] ?? null), catchError(this.handleError));
  }

  deleteUser(id: string) {
    return this.http.delete<void>(`${API}/users/${id}`)
      .pipe(catchError(this.handleError));
  }

  /* ──────────────────────────── STUDENTS ──────────────────────────── */
  getStudentsByInstitution(idInstitution: string) {
    return this.http.get<Student[]>(`${API}/students?idInstitution=${idInstitution}`)
      .pipe(catchError(this.handleError));
  }

  createStudent(student: Partial<Student>) {
    return this.http.post<Student>(`${API}/students`, student)
      .pipe(catchError(this.handleError));
  }

  deleteStudent(id: string) {
    return this.http.delete<void>(`${API}/students/${id}`)
      .pipe(catchError(this.handleError));
  }

  /* ──────────────────────────── COURSES ───────────────────────────── */
  getCoursesByInstitution(idInstitution: string) {
    return this.http.get<Course[]>(`${API}/courses?idInstitution=${idInstitution}`)
      .pipe(catchError(this.handleError));
  }

  /* ───────────────────────── ENROLLMENTS ──────────────────────────── */
  createEnrollment(enr: Pick<Enrollment,'idCourse'|'idStudent'|'state'|'average'>) {
    return this.http.post<Enrollment>(`${API}/enrollments`, enr)
      .pipe(catchError(this.handleError));
  }

  deleteEnrollment(id: string) {
    return this.http.delete<void>(`${API}/enrollments/${id}`)
      .pipe(catchError(this.handleError));
  }

  getEnrollmentsByStudent(idStudent: string) {
    return this.http.get<Enrollment[]>(
      `${API}/enrollments?idStudent=${idStudent}`
    ).pipe(catchError(this.handleError));
  }

  /* ──────────────────────────── HELPERS ──────────────────────────── */
  private handleError(err: HttpErrorResponse) {
    console.error('InstitutionService error:', err);
    return throwError(() => new Error(err.message || 'Server error'));
  }

  updateCourse(courseId: string, changes: Partial<Course>) {
    return this.http.patch<Course>(`${API}/courses/${courseId}`, changes)
      .pipe(catchError(this.handleError));
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${API}/courses/${id}`)
      .pipe(catchError(this.handleError));
  }



  uploadSyllabusBase64(payload: Omit<Syllabus,'id'>) {
    // json-server lo grabará en /syllabuses
    return this.http.post<Syllabus>(`${API}/syllabuses`, payload)
      .pipe(catchError(this.handleError));
  }

  createSyllabus(payload: {
    id: string;          // '' si quieres autoincremento
    idCourse: string;
    fileName: string;
    content: string;     // <── base-64
    hash: string;
  }) {
    return this.http.post<Syllabus>(`${API}/syllabuses`, payload)
      .pipe(catchError(this.handleError));
  }


  createTeacher(teacher: Partial<Teacher>): Observable<Teacher> {
    return this.http.post<Teacher>(`${API}/teachers`, teacher)
      .pipe(catchError(this.handleError));
  }

  deleteTeacher(teacherId: string): Observable<void> {
    // Lógica robusta: busca el 'teacher' para obtener su 'idUser'
    return this.http.get<Teacher>(`${API}/teachers/${teacherId}`).pipe(
      switchMap(teacher => {
        // Prepara las dos llamadas de eliminación en paralelo
        const deleteTeacher$ = this.http.delete<void>(`${API}/teachers/${teacherId}`);
        const deleteUser$ = teacher.idUser
          ? this.http.delete<void>(`${API}/users/${teacher.idUser}`)
          : of(null); // Si no hay idUser, no hagas nada

        // Ejecuta ambas y no emite nada hasta que las dos terminen
        return forkJoin([deleteTeacher$, deleteUser$]).pipe(
          map(() => undefined) // Transforma el resultado en void
        );
      }),
      catchError(this.handleError)
    );
  }

  uploadLogo(institutionId: string, base64Image: string): Observable<{ url: string }> {
    console.log(`subida de logo para la institución ${institutionId}...`);

    return of({ url: base64Image }).pipe(
      delay(1500) // Simula una carga de 1.5 segundos
    );
  }


}
