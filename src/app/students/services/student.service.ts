/* src/app/student/services/student.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';           // ←  importa `of`
import { map, switchMap } from 'rxjs/operators';

import {
  Student,
  Course,
  Syllabus
} from '../model/student.entity';

/* matrícula tal como está en /enrollments */
export interface Enrollment {
  id: string;
  idCourse:  string;
  idStudent: string;
  state: 'in_progress' | 'complete';
  average: number;
}

@Injectable({ providedIn: 'root' })
export class StudentService {

  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /* helpers de carga */
  getAllCourses()     { return this.http.get<Course[]>(  `${this.BASE}/courses`     ); }
  getAllSyllabuses()  { return this.http.get<Syllabus[]>(`${this.BASE}/syllabuses`  ); }
  getAllEnrollments() { return this.http.get<Enrollment[]>(`${this.BASE}/enrollments`); }

  /* ───────────── Perfil enriquecido del estudiante ───────────── */
  getById(id: string): Observable<Student> {

    /* ① Estudiante tal cual está en /students */
    return this.http.get<Student>(`${this.BASE}/students/${id}`).pipe(

      /* ② Traemos todo lo necesario en paralelo                    */
      switchMap((rawStudent: Student) =>
        forkJoin({
          raw:        of(rawStudent),      // ✅  ¡OJO!  envuelto en `of()` (Observable)
          courses:    this.getAllCourses(),
          teachers:   this.http.get<any[]>(`${this.BASE}/teachers`),   // 👈

          syllabuses: this.getAllSyllabuses(),
          enrolls:    this.getAllEnrollments()
        })
      ),

      /* ③ Unimos la información                                    */
      map(({ raw, courses, teachers, syllabuses, enrolls }) => {

        /* cursos donde está matriculado */
        const myEnrolls   = enrolls.filter((e: Enrollment) => e.idStudent === raw.id);

        const myCourses   = courses
          .filter(c => myEnrolls.some(e => e.idCourse === c.id))
          .map(c => {
            const t = teachers.find(tt => tt.id === c.idTeacher);
            return {
              ...c,
              teacherName: t ? `${t.firstName} ${t.lastName}` : '-',
              syllabus   : syllabuses.find(s => s.idCourse === c.id)
            };
          });

        /* aseguramos arreglo de notas */
        if (!Array.isArray(raw.notes) || !raw.notes.length) {
          const slots = myCourses[0]?.notesWeight?.length ?? 4;
          raw.notes   = new Array(slots).fill(0);
          raw.average = 0;
        }

        return {
          ...raw,
          courses: myCourses
        } as Student;
      })
    );
  }

  /* actualización de datos personales */
  update(id: string, payload: Partial<Student>) {
    return this.http.patch(`${this.BASE}/students/${id}`, payload);
  }
}
