import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Teacher, Course, Student, BlockchainEntry } from '../models/teacher.entity';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

interface RawTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  courses: string[];             // → ["01","02"]
  blockchainEntries: string[];   // → ["e01","e02", …]
}

interface RawCourse {
  id: string;
  name: string;
  code: string;
  section: string;
  teacher: string;               // → "1"
  notesWeight?: number[];
  passingGrade?: number;
  syllabusFileName?: string;
  syllabusHash?: string;
  students?: string[];           // → ["101","102",…]
  blockchainEntries?: string[];  // → ["e02", …]
}

interface RawStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courses?: string[];   // → ["01","02"]
  notes: number[];
  average: number;
  state: 'PROCESS'|'COMPLETE';
}

interface RawEntry {
  id: string;
  type: 'Certificate'|'Syllabus'|'Grade';
  hash: string;
  course?: string;       // → "01"
  studentCode?: string;  // → "101"
  notes?: { label:string; value:string }[];
  finalAverage?: number;
  result?: string;
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private readonly BASE = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Teacher> {
    // 1) Cargo el objeto teacher «crudo»
    return this.http
      .get<RawTeacher>(`${this.BASE}/teachers/${id}`)
      .pipe(
        // 2) Con él hago 3 peticiones paralelas: cursos, alumnos y entradas
        switchMap(raw =>
          forkJoin({
            rawTeacher: of(raw),
            allCourses:  this.http.get<RawCourse[]>(`${this.BASE}/courses`),
            allStudents: this.http.get<RawStudent[]>(`${this.BASE}/students`),
            allEntries:  this.http.get<RawEntry[]>(`${this.BASE}/blockchainEntries`)
          })
        ),
        // 3) Una vez tengo todo en memoria, «ensamblo» las relaciones
        map(({ rawTeacher, allCourses, allStudents, allEntries }) => {

          // 3.a) de todos los cursos, elijo sólo los del teacher
          const nestedCourses: Course[] = allCourses
            .filter(c => rawTeacher.courses.includes(c.id))
            .map(c => ({
              // convierto RawCourse → Course
              id:               c.id,
              name:             c.name,
              code:             c.code,
              section:          c.section,
              teacher:          {  // el mismo teacher «expandido» mínimamente
                id:       rawTeacher.id,
                firstName: rawTeacher.firstName,
                lastName:  rawTeacher.lastName,
                email:     rawTeacher.email,
                phone:     rawTeacher.phone,
                avatarUrl: rawTeacher.avatarUrl,
                courses:   [],            // evitamos recursión infinita
                blockchainEntries: []
              },
              notesWeight:      c.notesWeight,
              passingGrade:     c.passingGrade,
              syllabusFileName: c.syllabusFileName,
              syllabusHash:     c.syllabusHash,
              // 3.b) alumnos cuyo RawStudent.courses incluye este curso.id
              students: allStudents
                .filter(s => s.courses?.includes(c.id))
                .map(s => ({
                  id:        s.id,
                  firstName: s.firstName,
                  lastName:  s.lastName,
                  email:     s.email,
                  phone:     s.phone,
                  courses:   [],    // igual: evitamos anidar otra vez Course[]
                  notes:     s.notes,
                  average:   s.average,
                  state:     s.state
                })),
              // 3.c) entradas de blockchain que referencian este curso
              blockchainEntries: (c.blockchainEntries || [])
                .map(eid => {
                  const rawE = allEntries.find(e => e.id === eid)!;
                  return {
                    id:           rawE.id,
                    type:         rawE.type,
                    hash:         rawE.hash,
                    course:       undefined,     // lo reajustamos más abajo
                    studentCode:  rawE.studentCode,
                    notes:        rawE.notes,
                    finalAverage: rawE.finalAverage,
                    result:       rawE.result
                  } as BlockchainEntry;
                })
            }));

          // 3.d) ahora rellenamos la referencia course en cada entrada
          const nestedEntries: BlockchainEntry[] = rawTeacher.blockchainEntries
            .map(eid => {
              const rawE = allEntries.find(e => e.id === eid)!;
              const courseObj = nestedCourses.find(c => c.id === rawE.course);
              return {
                id:           rawE.id,
                type:         rawE.type,
                hash:         rawE.hash,
                course:       courseObj,
                studentCode:  rawE.studentCode,
                notes:        rawE.notes,
                finalAverage: rawE.finalAverage,
                result:       rawE.result
              } as BlockchainEntry;
            });

          // 4) devolvemos el Teacher «bien formado»
          return {
            id:                rawTeacher.id,
            firstName:         rawTeacher.firstName,
            lastName:          rawTeacher.lastName,
            email:             rawTeacher.email,
            phone:             rawTeacher.phone,
            avatarUrl:         rawTeacher.avatarUrl,
            courses:           nestedCourses,
            blockchainEntries: nestedEntries
          } as Teacher;
        })
      );
  }

  update(id: string, payload: Partial<Teacher>) {
    return this.http.patch(`${this.BASE}/teachers/${id}`, payload);
  }
}
