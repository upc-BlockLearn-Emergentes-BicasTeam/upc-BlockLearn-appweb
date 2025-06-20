import { Component } from '@angular/core';
import {StudentEntity} from '../../model/student.entity';
import {UserEntity} from '../../../iam/model/user.entity';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../iam/services/auth.service';
import {StudentService} from '../../services/student.service';

@Component({
  selector: 'app-courses-student',
  imports: [],
  templateUrl: './courses-student.component.html',
  styleUrl: './courses-student.component.css'
})
export class CoursesStudentComponent {
  student: StudentEntity = new StudentEntity();
  user: UserEntity = new UserEntity();
  courses: CourseEntity[] = [];

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private studentService: StudentService,) {
    this.student.id = this.route.snapshot.params['id'];
  }
}
