import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatListModule }     from '@angular/material/list';
import { MatButtonModule }   from '@angular/material/button';

@Component({
  selector: 'app-sidebar-teacher',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgOptimizedImage,
    // Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './sidebar-teacher.component.html',
  styleUrls: ['./sidebar-teacher.component.css']
})
export class SidebarTeacherComponent {
  opened = true;

  toggleSidenav() {
    this.opened = !this.opened;
  }
}
