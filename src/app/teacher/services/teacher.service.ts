/* src/app/teacher/services/teacher.service.ts */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  Teacher, Course, Student, BlockchainEntry, Syllabus
} from '../models/teacher.entity';

import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap }          from 'rxjs/operators';

/** Matriculas que vienen de /enrollments */
export interface Enrollment {
  id: string;
  idCourse:  string;
  idStudent: string;
  state:    'in_progress' | 'complete';
  average:   number;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {

  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /* ───────────────────────────── helpers CRUD simples ───────────────────────────── */
  /** Se usan en el componente para el forkJoin inicial */
  getAllStudents():    Observable<Student[]>    { return this.http.get<Student[]>   (`${this.BASE}/students`); }
  getAllEnrollments(): Observable<Enrollment[]> { return this.http.get<Enrollment[]>(`${this.BASE}/enrollments`); }

  /* ─────────────────────── Perfil completo del docente ─────────────────────── */
  getById(id: string): Observable<Teacher> {

    /* ▸ 1. cargo el teacher «crudo»                             */
    return this.http.get<any>(`${this.BASE}/teachers/${id}`).pipe(

      /* ▸ 2. en paralelo pido cursos, alumnos, matriculas, blockchain */
      switchMap(rawTeacher =>
        forkJoin({
          rawTeacher: of(rawTeacher),
          courses   : this.http.get<any[]>(`${this.BASE}/courses`),
          students  : this.getAllStudents(),
          enrolls   : this.getAllEnrollments(),
          entries   : this.http.get<any[]>(`${this.BASE}/blockchainEntries`)
        })
      ),

      /* ▸ 3. armo las relaciones                                   */
      map(({ rawTeacher, courses, students, enrolls, entries }) => {

        /* cursos impartidos por él */
        const teacherCourses: Course[] = courses
          .filter(c => c.idTeacher === rawTeacher.id)
          .map(course => {

            /* alumnos inscritos al curso según enrollments */
            const stus: Student[] = enrolls
              .filter(e => e.idCourse === course.id)
              .map(e  => students.find(s => s.id === e.idStudent))
              .filter(Boolean) as Student[];

            /* entradas BC asociadas al curso */
            const bcs: BlockchainEntry[] = entries
              .filter(e => e.course === course.id || e.idCourse === course.id)
              .map(e => ({
                id          : e.id,
                type        : e.type,
                hash        : e.hash,
                studentCode : e.studentCode,
                notes       : e.notes,
                finalAverage: e.finalAverage,
                result      : e.result,
                course      : undefined          // se rellena más adelante
              }));

            return {
              id               : course.id,
              name             : course.name,
              code             : course.code,
              section          : course.section,
              teacherId        : course.idTeacher,
              notesWeight      : course.notesWeight,
              passingGrade     : course.passingGrade,
              syllabusFileName : course.syllabusFileName,
              syllabusHash     : course.syllabusHash,
              students         : stus,
              blockchainEntries: bcs,
              evaluations      : []              // ← opcional / futuro
            } as Course;
          });

        /* ahora que ya existen los Course[], referencio el objeto dentro de cada BC */
        teacherCourses.forEach(c => {
          c.blockchainEntries?.forEach(be => be.course = c);
        });

        /* Blockchain «personales» del profesor (ejemplo simple) */
        const teacherBC: BlockchainEntry[] = entries
          .filter(e => e.teacherId === rawTeacher.id)
          .map(e => ({
            id          : e.id,
            type        : e.type,
            hash        : e.hash,
            studentCode : e.studentCode,
            notes       : e.notes,
            finalAverage: e.finalAverage,
            result      : e.result,
            course      : teacherCourses.find(c => c.id === (e.course ?? e.idCourse))
          }));

        /* objeto Teacher final */
        return {
          id            : rawTeacher.id,
          idUser        : rawTeacher.idUser,
          idInstitution : rawTeacher.idInstitution,
          firstName     : rawTeacher.firstName,
          lastName      : rawTeacher.lastName,
          email         : rawTeacher.email,
          phone         : rawTeacher.phone,
          avatarUrl     : rawTeacher.avatarUrl,
          courses       : teacherCourses,
          blockchainEntries: teacherBC
        } as Teacher;
      })
    );
  }

  /* ───────────────────────────── update básico ───────────────────────────── */
  update(id: string, payload: Partial<Teacher>) {
    return this.http.patch(`${this.BASE}/teachers/${id}`, payload);
  }



  /** PATCH notas + promedio de un alumno  */
  updateStudentNotes(studentId: string, notes: number[], average: number) {
    return this.http.patch(`${this.BASE}/students/${studentId}`, { notes, average });
  }

  getAllSyllabuses():  Observable<Syllabus[]>   { return this.http.get<Syllabus[]>(`${this.BASE}/syllabuses`); }



}
