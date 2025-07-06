import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SidebarTeacherComponent} from '../../components/sidebar-teacher/sidebar-teacher.component';
import {CoursesComponent} from '../../components/courses/courses.component';
import {BlockchainComponent} from '../../components/blockchain/blockchain.component';

@Component({
  selector: 'app-pg-courses-teacher-institution',
  standalone: true,

  imports: [
    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarTeacherComponent,
    CoursesComponent

  ],
  templateUrl: './pg-courses-teacher.component.html',
  styleUrl: './pg-courses-teacher.component.css'
})
export class PgCoursesTeacherComponent {

}
