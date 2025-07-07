import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import {
  Institution, Teacher, Student, Course,
  Syllabus, Enrollment,
  UserPayload // Asegúrate de que UserPayload esté en institution.entity.ts
} from '../models/institution.entity';

// Apunta a la nueva API de Spring Boot
const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class InstitutionService {

  constructor(private http: HttpClient) {}

  // --- MÉTODOS DE INSTITUCIÓN ---

  getInstitutionById(id: number): Observable<Institution> {
    return this.http.get<Institution>(`${API}/institutions/${id}`).pipe(catchError(this.handleError));
  }

  updateInstitution(id: number, changes: Partial<Omit<Institution, 'id' | 'userId'>>): Observable<Institution> {
    return this.http.put<Institution>(`${API}/institutions/${id}`, changes).pipe(catchError(this.handleError));
  }

  // --- GESTIÓN DE PROFESORES (TEACHERS) ---

  getTeachersByInstitution(institutionId: number): Observable<Teacher[]> {
    const params = new HttpParams().set('institutionId', institutionId.toString());
    return this.http.get<Teacher[]>(`${API}/teachers`, { params }).pipe(catchError(this.handleError));
  }

  createTeacher(userData: UserPayload, teacherData: Omit<Teacher, 'id' | 'userId'>): Observable<Teacher> {
    return this.http.post<any>(`${API}/users`, userData).pipe(
      switchMap(createdUser => {
        if (!createdUser || !createdUser.id) {
          return throwError(() => new Error('User creation failed: No ID returned.'));
        }
        return this.http.post<Teacher>(`${API}/teachers/user/${createdUser.id}`, teacherData);
      }),
      catchError(this.handleError)
    );
  }

  updateTeacher(teacherId: number, changes: Partial<Omit<Teacher, 'id' | 'userId' | 'institutionId'>>): Observable<Teacher> {
    return this.http.put<Teacher>(`${API}/teachers/${teacherId}`, changes).pipe(catchError(this.handleError));
  }

  deleteTeacher(teacherId: number): Observable<any> {
    return this.http.delete(`${API}/teachers/${teacherId}`).pipe(catchError(this.handleError));
  }

  // --- GESTIÓN DE ESTUDIANTES (STUDENTS) ---

  getStudentsByInstitution(institutionId: number): Observable<Student[]> {
    const params = new HttpParams().set('institutionId', institutionId.toString());
    return this.http.get<Student[]>(`${API}/students`, { params }).pipe(catchError(this.handleError));
  }

  createStudent(userData: UserPayload, studentData: Omit<Student, 'id' | 'userId'>): Observable<Student> {
    return this.http.post<any>(`${API}/users`, userData).pipe(
      switchMap(createdUser => {
        if (!createdUser || !createdUser.id) {
          return throwError(() => new Error('User creation failed: No ID returned.'));
        }
        return this.http.post<Student>(`${API}/students/user/${createdUser.id}`, studentData);
      }),
      catchError(this.handleError)
    );
  }

  updateStudent(studentId: number, changes: Partial<Omit<Student, 'id' | 'userId' | 'institutionId'>>): Observable<Student> {
    return this.http.put<Student>(`${API}/students/${studentId}`, changes).pipe(catchError(this.handleError));
  }

  deleteStudent(studentId: number): Observable<any> {
    return this.http.delete(`${API}/students/${studentId}`).pipe(catchError(this.handleError));
  }

  // --- GESTIÓN DE CURSOS (COURSES) ---

  getCoursesByInstitution(institutionId: number): Observable<Course[]> {
    const params = new HttpParams().set('institutionId', institutionId.toString());
    return this.http.get<Course[]>(`${API}/courses`, { params }).pipe(catchError(this.handleError));
  }

  createCourse(courseData: Omit<Course, 'id'>): Observable<Course> {
    return this.http.post<Course>(`${API}/courses`, courseData).pipe(catchError(this.handleError));
  }

  updateCourse(courseId: number, changes: Partial<Omit<Course, 'id' | 'institutionId'>>): Observable<Course> {
    return this.http.put<Course>(`${API}/courses/${courseId}`, changes).pipe(catchError(this.handleError));
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${API}/courses/${courseId}`).pipe(catchError(this.handleError));
  }

  // --- GESTIÓN DE SÍLABOS (SYLLABUSES) ---

  getSyllabusByCourse(courseId: number): Observable<Syllabus> {
    return this.http.get<Syllabus>(`${API}/syllabuses/course/${courseId}`).pipe(catchError(this.handleError));
  }

  uploadSyllabus(payload: Omit<Syllabus, 'id'>): Observable<Syllabus> {
    return this.http.post<Syllabus>(`${API}/syllabuses`, payload)
      .pipe(catchError(this.handleError));
  }

  // --- GESTIÓN DE MATRÍCULAS (ENROLLMENTS) ---

  createEnrollment(enrollmentData: Omit<Enrollment, 'id'>): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${API}/enrollments`, enrollmentData).pipe(catchError(this.handleError));
  }

  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    const params = new HttpParams().set('studentId', studentId.toString());
    return this.http.get<Enrollment[]>(`${API}/enrollments`, { params }).pipe(catchError(this.handleError));
  }

  // --- HELPER DE MANEJO DE ERRORES ---

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred in InstitutionService:', error);
    // Intenta obtener un mensaje de error más específico del backend si está disponible
    const errorBody = error.error;
    const errorMessage = (errorBody && typeof errorBody.message === 'string')
      ? errorBody.message
      : `Error: ${error.statusText} (Status: ${error.status})`;

    return throwError(() => new Error(errorMessage || 'Something bad happened; please try again later.'));
  }
}
