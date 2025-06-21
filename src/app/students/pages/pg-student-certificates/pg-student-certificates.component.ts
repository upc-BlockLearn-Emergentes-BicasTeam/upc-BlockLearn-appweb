import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

// Angular Material
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {MatSidenav, MatSidenavContainer, MatSidenavContent, MatSidenavModule} from '@angular/material/sidenav';
import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {CertificatesStudentComponent} from '../../components/certificates-student/certificates-student.component';
import {CoursesStudentComponent} from '../../components/courses-student/courses-student.component';


@Component({
  selector: 'app-pg-student-certificates',
  imports: [

    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    MatSidenavContainer,
    MatSidenav,
    SidebarStudentComponent,
    MatSidenavContent,
    CertificatesStudentComponent,
    CoursesStudentComponent
  ],
  templateUrl: './pg-student-certificates.component.html',
  styleUrl: './pg-student-certificates.component.css'
})
export class PgStudentCertificatesComponent {

}
