import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Importamos los modelos actualizados y todas las entidades necesarias
import {
  Teacher,
  Course,
  Student,
  BlockchainEntry,
  Syllabus,
  Enrollment,
  NoteRecord,
  Certificate // <--- [NUEVO] Se importa la nueva entidad Certificate
} from '../models/teacher.entity';

@Injectable({ providedIn: 'root' })
export class TeacherService {

  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /* ========================================================== */
  /*  MÉTODOS CRUD PARA GESTIONAR NOTAS (NoteRecord)            */
  /* ========================================================== */

  getNotesByEnrollmentId(enrollmentId: string): Observable<NoteRecord[]> {
    return this.http.get<NoteRecord[]>(`${this.BASE}/notesRecords?idEnrollment=${enrollmentId}`);
  }

  addNote(noteData: Omit<NoteRecord, 'id'>): Observable<NoteRecord> {
    return this.http.post<NoteRecord>(`${this.BASE}/notesRecords`, noteData);
  }

  updateNote(noteId: string, updatedData: Partial<NoteRecord>): Observable<NoteRecord> {
    return this.http.patch<NoteRecord>(`${this.BASE}/notesRecords/${noteId}`, updatedData);
  }

  deleteNote(noteId: string): Observable<{}> {
    return this.http.delete<{}>(`${this.BASE}/notesRecords/${noteId}`);
  }

  /* ==================================================================== */
  /*  [NUEVO] MÉTODOS CRUD PARA GESTIONAR CERTIFICADOS (Certificate)      */
  /* ==================================================================== */

  /**
   * Sube un nuevo certificado al sistema.
   * @param certificateData - Los datos del certificado a crear, omitiendo el 'id'.
   * @returns Un Observable con el certificado recién creado por el servidor.
   */
  uploadCertificate(certificateData: Omit<Certificate, 'id'>): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.BASE}/certificates`, certificateData);
  }

  /**
   * Obtiene los certificados asociados a una matrícula específica.
   * Usualmente devolverá un array con 0 o 1 elemento.
   * @param enrollmentId - El ID de la matrícula.
   * @returns Un Observable con un array de certificados.
   */
  getCertificateByEnrollmentId(enrollmentId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.BASE}/certificates?idEnrollment=${enrollmentId}`);
  }

  /**
   * Elimina un certificado existente.
   * Útil si el profesor subió un archivo incorrecto y necesita reemplazarlo.
   * @param certificateId - El ID del certificado a eliminar.
   * @returns Un Observable vacío al completarse.
   */
  deleteCertificate(certificateId: string): Observable<{}> {
    return this.http.delete<{}>(`${this.BASE}/certificates/${certificateId}`);
  }


  /* ========================================================== */
  /*  MÉTODOS HELPER EXISTENTES (SIN CAMBIOS)                   */
  /* ========================================================== */
  getAllStudents(): Observable<Student[]> { return this.http.get<Student[]>(`${this.BASE}/students`); }
  getAllEnrollments(): Observable<Enrollment[]> { return this.http.get<Enrollment[]>(`${this.BASE}/enrollments`); }
  getAllSyllabuses(): Observable<Syllabus[]> { return this.http.get<Syllabus[]>(`${this.BASE}/syllabuses`); }
  update(id: string, payload: Partial<Teacher>): Observable<Teacher> { return this.http.patch<Teacher>(`${this.BASE}/teachers/${id}`, payload); }


  /* ========================================================== */
  /*  MÉTODO getById REFACTORIZADO Y CORREGIDO                  */
  /* ========================================================== */

  /**
   * Obtiene toda la información de un profesor y sus cursos relacionados.
   *
   * **NOTA DE ARQUITECTURA:** Este método actualmente descarga múltiples colecciones completas
   * (todos los estudiantes, todas las matrículas, etc.) y las ensambla en el cliente.
   * Si bien funciona para entornos pequeños, NO es escalable para una institución real.
   *
   * **RECOMENDACIÓN A FUTURO:** Refactorizar el backend para que un solo endpoint
   * (ej. `GET /teachers/{id}?_embed=courses.enrollments`) devuelva el objeto ya ensamblado.
   * Esto reducirá drásticamente la carga de red y la complejidad del cliente.
   */
  getById(id: string): Observable<Teacher> {

    // 1. Obtenemos el objeto del profesor
    return this.http.get<Teacher>(`${this.BASE}/teachers/${id}`).pipe(

      // 2. En paralelo, obtenemos todas las colecciones de datos relacionadas
      switchMap(rawTeacher =>
        forkJoin({
          rawTeacher: of(rawTeacher),
          courses: this.http.get<Course[]>(`${this.BASE}/courses?idTeacher=${rawTeacher.id}`),
          students: this.getAllStudents(),
          enrolls: this.getAllEnrollments(),
          notesRecords: this.http.get<NoteRecord[]>(`${this.BASE}/notesRecords`),
          entries: this.http.get<BlockchainEntry[]>(`${this.BASE}/blockchainEntries`)
        })
      ),

      // 3. Ensamblamos el objeto Teacher final con todas sus relaciones
      map(({ rawTeacher, courses, students, enrolls, notesRecords, entries }) => {

        // Para cada curso del profesor...
        const teacherCourses: Course[] = courses.map(course => {

          // ...filtramos las matrículas que pertenecen a este curso
          const courseEnrollments: Enrollment[] = enrolls
            .filter(e => e.idCourse === course.id)
            .map(enrollment => {

              // Para cada matrícula, encontramos los datos del estudiante
              const studentDetails = students.find(s => s.id === enrollment.idStudent);
              if (!studentDetails) {
                return null;
              }

              // Y también encontramos todas las notas asociadas a ESTA matrícula
              const notesForEnrollment = notesRecords.filter(nr => nr.idEnrollment === enrollment.id);

              // Calculamos el promedio para esta matrícula
              const average = notesForEnrollment.length > 0
                ? +(notesForEnrollment.reduce((sum, note) => sum + note.score, 0) / notesForEnrollment.length).toFixed(1)
                : 0;

              // Devolvemos un objeto de matrícula "enriquecido"
              const finalEnrollment: Enrollment = {
                ...enrollment,
                student: studentDetails,
                notesRecords: notesForEnrollment,
                average: average
              };
              return finalEnrollment;
            })
            .filter(e => e !== null) as Enrollment[];

          // Lógica para Blockchain (sin cambios)
          const bcs = entries
            .filter(e => e.course?.id === course.id || (e as any).idCourse === course.id)
            .map(e => ({ ...e, course: undefined }));

          // Construimos explícitamente el objeto Course final
          const finalCourse: Course = {
            ...course,
            enrollments: courseEnrollments,
            blockchainEntries: bcs
          };
          return finalCourse;
        });

        // Construimos explícitamente el objeto Teacher final
        const finalTeacher: Teacher = {
          ...rawTeacher,
          courses: teacherCourses,
        };

        return finalTeacher;
      })
    );
  }
}
