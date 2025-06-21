import { Component }                          from '@angular/core';
import { CommonModule }                       from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {SidebarInstitutionComponent} from '../../components/sidebar-institution/sidebar-institution.component';
import {CoursesComponent} from '../../components/courses/courses.component';
import {TeachersComponent} from '../../components/teachers/teachers.component';


@Component({
  selector: 'app-pg-courses',
  standalone: true,
  imports: [CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarInstitutionComponent, CoursesComponent, TeachersComponent],
  templateUrl: './pg-courses.component.html',
  styleUrls: ['./pg-courses.component.css']
})
export class PgCoursesComponent {}
