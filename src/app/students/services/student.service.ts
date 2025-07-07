import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Student, Syllabus} from '../model/student.entity'; // Usando los modelos actualizados con IDs numéricos

// Apunta a la nueva API de Spring Boot
const API = 'http://localhost:8080/api/v1';

@Injectable({ providedIn: 'root' })
export class StudentService {

  constructor(private http: HttpClient) {}

  /**
   * Obtiene el perfil completo de un estudiante, incluyendo todas sus matrículas,
   * y los detalles de cada curso, notas y certificados.
   * @param studentId - El ID del perfil del estudiante.
   */
  getStudentProfileById(studentId: number): Observable<Student> {
    // Esta única llamada ahora devuelve toda la información necesaria y ensamblada.
    // Llama al nuevo endpoint que creaste en el backend.
    return this.http.get<Student>(`${API}/students/${studentId}/profile`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza los datos del perfil de un estudiante (nombre, teléfono, avatar).
   * @param studentId - El ID del perfil del estudiante a actualizar.
   * @param payload - Los datos a modificar.
   */
  updateStudentProfile(studentId: number, payload: Partial<Omit<Student, 'id' | 'userId' | 'institutionId'>>): Observable<Student> {
    // Llama al endpoint PUT que ya creaste en el backend para actualizar.
    return this.http.put<Student>(`${API}/students/${studentId}`, payload).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejador de errores centralizado para el servicio.
   */
  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred in StudentService:', error);
    const errorBody = error.error;
    // Intenta obtener un mensaje de error más específico del backend si está disponible
    const errorMessage = (errorBody && typeof errorBody.message === 'string')
      ? errorBody.message
      : `Error: ${error.statusText} (Status: ${error.status})`;

    return throwError(() => new Error(errorMessage || 'An error occurred. Please try again later.'));
  }


  getSyllabusByCourseId(courseId: number): Observable<Syllabus> {
    return this.http.get<Syllabus>(`${API}/syllabuses/course/${courseId}`).pipe(
      catchError(this.handleError)
    );
  }
}
