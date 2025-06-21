import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {CoursesStudentComponent} from '../../components/courses-student/courses-student.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {ProfileStudentComponent} from '../../components/profile-student/profile-student.component';

@Component({
  selector: 'app-pg-student-courses',
  imports: [

    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    SidebarStudentComponent,
    CoursesStudentComponent,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    ProfileStudentComponent,
  ],
  templateUrl: './pg-student-courses.component.html',
  styleUrl: './pg-student-courses.component.css'
})
export class PgStudentCoursesComponent {

}

