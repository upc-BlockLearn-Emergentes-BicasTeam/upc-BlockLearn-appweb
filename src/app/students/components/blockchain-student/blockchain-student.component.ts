import {Component, OnInit} from '@angular/core';
import {CourseEntity} from '../../model/course.entity';
import {TeacherEntity} from '../../model/teacher.entity';
import {UserEntity} from '../../../iam/model/user.entity';
import {ActivatedRoute} from '@angular/router';
import {CourseService} from '../../services/course.service';
import {CertificateService} from '../../services/certificate.service';
import {AuthService} from '../../../iam/services/auth.service';
import {NgForOf} from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-blockchain-student',
  imports: [
    NgForOf, CommonModule
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

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private certificateService: CertificateService,
    private authService: AuthService
  ) {
    this.studentId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    // Cargar certificados
    this.certificateService.findCertificateByIdStudent(this.studentId).subscribe((certs: any[]) => {
      certs.forEach(cert => {
        this.courseService.getCourseById(cert.idCourse).subscribe((course: any) => {
          this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
            this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
              this.blockchainRecords.push({
                type: 'Certification',
                hash: cert.hash,
                courseName: course.name,
                teacherName: teacher.name + ' ' + teacher.lastName,
                email: user.email
              });
            });
          });
        });
      });
    });

    // Cargar notas
    this.courseService.getAllNotes().subscribe((notes: any[]) => {
      notes.forEach(note => {
        this.courseService.getEnrollmentById(note.idEnrollment).subscribe((enroll: any) => {
          if (enroll.idStudent === this.studentId) {
            this.courseService.getCourseById(enroll.idCourse).subscribe((course: any) => {
              this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
                this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
                  this.blockchainRecords.push({
                    type: 'NoteRecord',
                    hash: note.hash,
                    courseName: course.name,
                    teacherName: teacher.name + ' ' + teacher.lastName,
                    email: user.email,
                    extraInfo: `Nota: ${note.note} - Porcentaje: ${note.percent}%`
                  });
                });
              });
            });
          }
        });
      });
    });

    // Cargar syllabus
    this.courseService.getAllSyllabuses().subscribe((syllabi: any[]) => {
      syllabi.forEach(syl => {
        this.courseService.getCourseById(syl.idCourse).subscribe((course: any) => {
          this.courseService.getTeacherById(course.idTeacher).subscribe((teacher: any) => {
            this.authService.findUserById(teacher.idUser).subscribe((user: any) => {
              this.blockchainRecords.push({
                type: 'Syllabus',
                hash: syl.hash,
                courseName: course.name,
                teacherName: teacher.name + ' ' + teacher.lastName,
                email: user.email
              });
            });
          });
        });
      });
    });
  }
}
