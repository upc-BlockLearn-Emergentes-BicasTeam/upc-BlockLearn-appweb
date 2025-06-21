import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {StudentEntity} from '../../model/student.entity';
import {UserEntity} from '../../../iam/model/user.entity';
import {CourseEntity} from '../../model/course.entity';
import {EnrollmentEntity} from '../../model/enrollment.entity';
import {TeacherEntity} from '../../model/teacher.entity';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../iam/services/auth.service';
import {StudentService} from '../../services/student.service';
import {CourseService} from '../../services/course.service';
import {concatMap, forkJoin, from, tap} from 'rxjs';

@Component({
  selector: 'app-certificates-student',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './certificates-student.component.html',
  styleUrl: './certificates-student.component.css'
})
export class CertificatesStudentComponent implements OnInit{
  student: StudentEntity = new StudentEntity();
  users: UserEntity[] = [];
  courses: CourseEntity[] = [];
  enrollments: EnrollmentEntity[] = [];
  notes: any[] = [];
  syllabuses: any[] =[];
  teachers: TeacherEntity[] = [];

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private studentService: StudentService,
              private courseService: CourseService,) {
    this.student.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    from([
      () => this.courseService.getEnrollmentsByStudentId(this.student.id).pipe(
        concatMap((enrollments: any[]) => {
          this.enrollments = enrollments;

          return from(enrollments).pipe(
            concatMap((enrollment: any) => {
              // Obtener course y notes en paralelo
              return forkJoin({
                course: this.courseService.getCourseById(enrollment.idCourse),
                notes: this.courseService.getNotesByEnrollmentId(enrollment.id)
              }).pipe(
                tap(({ course, notes }) => {
                  this.courses.push(course);
                  this.notes.push(notes);
                  console.log(`📚 Enrollment ${enrollment.id}:`, { course, notes });
                }),
                // Luego obtener teacher y syllabus en paralelo
                concatMap(({ course }) => {
                  return forkJoin({
                    teacher: this.courseService.getTeacherById(course.idTeacher),
                    syllabus: this.courseService.getSyllabusByCourseId(course.id)
                  }).pipe(
                    tap(({ teacher, syllabus }) => {
                      this.teachers.push(teacher);
                      this.syllabuses.push(syllabus);
                    }),
                    concatMap(({ teacher }) =>
                      this.authService.findUserById(teacher.idUser).pipe(
                        tap((user: any) => {
                          this.users.push(user);
                        })
                      )
                    )
                  );
                })
              );
            })
          );
        })
      )
    ])
      .pipe(
        concatMap(fn => fn())
      )
      .subscribe({
        complete: () => {
          const approvedCourses = [];

          for (let i = 0; i < this.notes.length; i++) {
            this.enrollments[i].average = 0;

            for (let j = 0; j < this.notes[i].length; j++) {
              this.enrollments[i].average += this.notes[i][j].note * (this.notes[i][j].percent / 100);
            }

            if (this.enrollments[i].average > this.courses[i].passingGrade) {
              this.enrollments[i].state = "Approved";
              approvedCourses.push({
                course: this.courses[i],
                teacher: this.teachers[i],
                user: this.users[i],
                notes: this.notes[i],
                enrollment: this.enrollments[i]
              });
            } else {
              this.enrollments[i].state = "Disapproved";
            }
          }

// Reemplazar los arrays originales con solo los aprobados
          this.courses = approvedCourses.map(c => c.course);
          this.teachers = approvedCourses.map(c => c.teacher);
          this.users = approvedCourses.map(c => c.user);
          this.notes = approvedCourses.map(c => c.notes);
          this.enrollments = approvedCourses.map(c => c.enrollment);
        },
        error: (e) => console.error("❌ Error:", e)
      });


  }
}
