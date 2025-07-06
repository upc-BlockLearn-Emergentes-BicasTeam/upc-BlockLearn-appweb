import { Component, OnInit }                 from '@angular/core';
import { ActivatedRoute, RouterModule }      from '@angular/router';
import { CommonModule }                      from '@angular/common';
import { MatSidenavModule }                  from '@angular/material/sidenav';
import { MatToolbarModule }                  from '@angular/material/toolbar';
import { MatIconModule }                     from '@angular/material/icon';
import { MatListModule }                     from '@angular/material/list';

import { Course, Student, Syllabus }                     from '../../model/student.entity';
import { AuthService }                       from '../../../iam/services/auth.service';

@Component({
  selector: 'app-sidebar-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Angular Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule
  ],
  templateUrl: './sidebar-student.component.html',
  styleUrls: ['./sidebar-student.component.css']
})
export class SidebarStudentComponent implements OnInit {

  opened = true;
  studentId: string = '';

  ngOnInit(): void {
    this.studentId = localStorage.getItem('studentId') || '';
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }
}
