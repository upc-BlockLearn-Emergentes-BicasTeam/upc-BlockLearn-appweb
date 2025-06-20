import { Component } from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {SidebarStudentComponent} from '../../components/sidebar-student/sidebar-student.component';
import {CertificatesStudentComponent} from '../../components/certificates-student/certificates-student.component';

@Component({
  selector: 'app-pg-student-certificates',
  imports: [
    MatSidenavContainer,
    MatSidenav,
    SidebarStudentComponent,
    MatSidenavContent,
    CertificatesStudentComponent
  ],
  templateUrl: './pg-student-certificates.component.html',
  styleUrl: './pg-student-certificates.component.css'
})
export class PgStudentCertificatesComponent {

}
