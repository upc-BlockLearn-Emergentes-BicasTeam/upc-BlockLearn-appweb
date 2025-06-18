import { Component } from '@angular/core';
import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {ProfileStudentComponent} from '../../components/profile-student/profile-student.component';

@Component({
  selector: 'app-pg-student-profile',
  imports: [
    SidebarStudentComponent,
    ProfileStudentComponent
  ],
  templateUrl: './pg-student-profile.component.html',
  styleUrl: './pg-student-profile.component.css'
})
export class PgStudentProfileComponent {

}
