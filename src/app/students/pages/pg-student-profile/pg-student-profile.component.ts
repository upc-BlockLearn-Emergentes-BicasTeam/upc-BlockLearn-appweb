import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {ProfileStudentComponent} from '../../components/profile-student/profile-student.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';

@Component({
  selector: 'app-pg-student-profile',
  imports: [

    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarStudentComponent,
    ProfileStudentComponent,
    MatSidenavContent,
    MatSidenav,
    MatSidenavContainer
  ],
  templateUrl: './pg-student-profile.component.html',
  styleUrl: './pg-student-profile.component.css'
})
export class PgStudentProfileComponent {

}
