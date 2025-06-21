import { Component, OnInit }                 from '@angular/core';
import { ActivatedRoute, RouterModule }      from '@angular/router';
import { CommonModule }                      from '@angular/common';
import { MatSidenavModule }                  from '@angular/material/sidenav';
import { MatToolbarModule }                  from '@angular/material/toolbar';
import { MatIconModule }                     from '@angular/material/icon';
import { MatListModule }                     from '@angular/material/list';

import { StudentEntity }                     from '../../model/student.entity';
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

  opened = true;                        // controla el colapso en viewports pequeños
  student: StudentEntity = new StudentEntity();

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.student.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.authService.findStudentById(this.student.id).subscribe((data: any) => {
      this.student.name     = data.name;
      this.student.lastName = data.lastName;
      this.student.id       = data.id;
    });
  }

  toggleSidenav(): void {
    this.opened = !this.opened;
  }
}
