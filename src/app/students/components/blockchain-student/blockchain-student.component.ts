import { Component, OnInit } from '@angular/core';
import { CourseEntity } from '../../model/course.entity';
import { TeacherEntity } from '../../model/teacher.entity';
import { UserEntity } from '../../../iam/model/user.entity';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { CertificateService } from '../../services/certificate.service';
import { AuthService } from '../../../iam/services/auth.service';
import { NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-blockchain-student',
  imports: [
    NgForOf,
    FormsModule,
    NgIf
  ],
  templateUrl: './blockchain-student.component.html',
  styleUrl: './blockchain-student.component.css'
})
export class BlockchainStudentComponent implements OnInit {
  studentId!: number;
  courses: CourseEntity[] = [];
  blockchainRecords: any[] = [];
  teachers: TeacherEntity[] = [];
  users: UserEntity[] = [];
  certificates: any[] = [];
  noteRecords: any[] = [];
  syllabusRecords: any[] = [];
  certificateRecords: any[] = [];

  loggedInStudent: any;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private authService: AuthService
  ) {
    this.studentId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      console.log('🧾 Usuario en localStorage:', user);

      this.courseService.getAllStudents().subscribe((students: any[]) => {
        console.log('📦 Estudiantes recibidos:', students);

        // Intenta encontrar el estudiante comparando contra idUser o userId
        const student = students.find(s =>
  s.idUser === Number(user.id) || s.userId === Number(user.id)
);


        if (student) {
          this.loggedInStudent = student;
          this.studentId = student.id;

          console.log('✅ Estudiante encontrado:', this.loggedInStudent);
          console.log('🧑‍🎓 Nombre:', student.name, student.lastName);
          console.log('🆔 ID estudiante:', student.id);

          this.loadCertificates();
          this.loadNotes();
          this.loadSyllabuses();
        } else {
          console.warn('⚠️ No se encontró el estudiante logueado.');
        }
      });
    } else {
      this.loadCertificates();
      this.loadNotes();
      this.loadSyllabuses();
      console.warn('⚠️ No hay usuario en localStorage.');
    }

    // TEMP: Para asegurarte que se pinte el bloque HTML
    // this.loggedInStudent = { id: 99, name: 'Nombre', lastName: 'Prueba' };
  }
  loadCertificates() {
    this.certificateService.findCertificateByIdStudent(this.studentId).subscribe((certs: any[]) => {
      certs.forEach(cert => {
        this.courseService.getCourseById(cert.idCourse).subscribe((course: any) => {
          this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
            this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
              const record = {
                type: 'Certification',
                hash: cert.hash,
                courseName: course.name,
                teacherName: teacher.name + ' ' + teacher.lastName,
                email: user.email
              };
              this.blockchainRecords.push(record);
              this.certificateRecords.push(record);
            });
          });
        });
      });
    });
  }


  loadNotes() {
    this.courseService.getAllNotes().subscribe((notes: any[]) => {
      console.log('🗒️ Notas obtenidas:', notes);
      notes.forEach(note => {
        this.courseService.getEnrollmentById(note.idEnrollment).subscribe((enroll: any) => {
          if (enroll.idStudent === this.studentId) {
            this.courseService.getCourseById(enroll.idCourse).subscribe((course: any) => {
              this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
                this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
                  const record = {
                    type: 'NoteRecord',
                    hash: note.hash,
                    courseName: course.name,
                    teacherName: teacher.name + ' ' + teacher.lastName,
                    email: user.email,
                    note: note.note,
                    percent: note.percent
                  };
                  console.log('🧾 Nota registrada:', record); // 👈 verifica este log
                  this.blockchainRecords.push(record);
                  this.noteRecords.push(record);
                });
              });
            });
          }
        });
      });
    });
  }

  loadSyllabuses() {
    this.courseService.getAllSyllabuses().subscribe((syllabi: any[]) => {
      syllabi.forEach(syl => {
        this.courseService.getCourseById(syl.idCourse).subscribe((course: any) => {
          this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
            this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
              const record = {
                type: 'Syllabus',
                hash: syl.hash,
                courseName: course.name,
                teacherName: teacher.name + ' ' + teacher.lastName,
                email: user.email
              };
              this.blockchainRecords.push(record);
              this.syllabusRecords.push(record);
            });
          });
        });
      });
    });
  }

}
