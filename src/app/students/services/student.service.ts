import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import {
  Student,
  Course,
  Syllabus,
  Enrollment,
  NoteRecord,
  Certificate // <--- [NUEVO] Importar la entidad Certificate
} from '../model/student.entity';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Student> {
    // 1. Obtenemos el objeto base del estudiante
    return this.http.get<Student>(`${this.BASE}/students/${id}`).pipe(
      // 2. En paralelo, obtenemos todas las colecciones de datos relacionadas
      switchMap((rawStudent: Student) =>
        forkJoin({
          rawStudent: of(rawStudent),
          courses: this.http.get<Course[]>(`${this.BASE}/courses`),
          teachers: this.http.get<any[]>(`${this.BASE}/teachers`),
          syllabuses: this.http.get<Syllabus[]>(`${this.BASE}/syllabuses`),
          enrollments: this.http.get<Enrollment[]>(`${this.BASE}/enrollments?idStudent=${rawStudent.id}`),
          notesRecords: this.http.get<NoteRecord[]>(`${this.BASE}/notesRecords`),
          // [NUEVO] Obtenemos todos los certificados que pertenecen a este estudiante.
          certificates: this.http.get<Certificate[]>(`${this.BASE}/certificates?idStudent=${rawStudent.id}`)
        })
      ),

      // 3. Ensamblamos el objeto Student final con todas sus relaciones
      map(({ rawStudent, courses, teachers, syllabuses, enrollments, notesRecords, certificates }) => {
        const studentEnrollments = enrollments.map(enrollment => {
          const courseDetails = courses.find(c => c.id === enrollment.idCourse);
          if (!courseDetails) return null;

          const teacherDetails = teachers.find(t => t.id === courseDetails.idTeacher);
          courseDetails.teacherName = teacherDetails ? `${teacherDetails.firstName} ${teacherDetails.lastName}` : 'No asignado';
          courseDetails.syllabus = syllabuses.find(s => s.idCourse === courseDetails.id);

          const notesForEnrollment = notesRecords.filter(nr => nr.idEnrollment === enrollment.id);

          const weights = courseDetails.notesWeight ?? [];
          const average = notesForEnrollment.length > 0
            ? +(notesForEnrollment.reduce((sum, note, index) => {
              const weight = weights[index] ?? 0;
              return sum + (note.score * (weight / 100));
            }, 0)).toFixed(1)
            : 0;

          // [NUEVO] Buscamos el certificado para esta matrícula específica.
          const certificateForEnrollment = certificates.find(c => c.idEnrollment === enrollment.id);

          const finalEnrollment: Enrollment = {
            ...enrollment,
            course: courseDetails,
            notesRecords: notesForEnrollment,
            average: average,
            certificate: certificateForEnrollment // <-- Lo adjuntamos aquí
          };
          return finalEnrollment;
        })
          .filter((e): e is Enrollment => e !== null);

        const finalStudent: Student = { ...rawStudent, enrollments: studentEnrollments };
        return finalStudent;
      })
    );
  }

  update(id: string, payload: Partial<Student>): Observable<Student> {
    return this.http.patch<Student>(`${this.BASE}/students/${id}`, payload);
  }
}
