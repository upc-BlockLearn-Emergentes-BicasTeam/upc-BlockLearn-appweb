import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {UserEntity} from '../../../iam/model/user.entity';
import {CourseEntity} from '../../model/course.entity';
import {EnrollmentEntity} from '../../model/enrollment.entity';
import {TeacherEntity} from '../../model/teacher.entity';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../iam/services/auth.service';
import {StudentService} from '../../services/student.service';
import {CourseService} from '../../services/course.service';
import {concatMap, forkJoin, from, tap} from 'rxjs';
import {CertificateService} from '../../services/certificate.service';

@Component({
  selector: 'app-certificates-student',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './certificates-student.component.html',
  styleUrl: './certificates-student.component.css'
})
export class CertificatesStudentComponent {

}
