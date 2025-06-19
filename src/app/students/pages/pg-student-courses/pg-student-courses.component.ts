import { Component } from '@angular/core';
import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {CoursesStudentComponent} from '../../components/courses-student/courses-student.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';

@Component({
  selector: 'app-pg-student-courses',
  imports: [
    SidebarStudentComponent,
    CoursesStudentComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
  ],
  templateUrl: './pg-student-courses.component.html',
  styleUrl: './pg-student-courses.component.css'
})
export class PgStudentCoursesComponent {

}
