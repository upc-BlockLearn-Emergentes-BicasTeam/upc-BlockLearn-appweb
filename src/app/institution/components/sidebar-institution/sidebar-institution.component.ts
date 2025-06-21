import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatListModule }     from '@angular/material/list';
import { MatButtonModule }   from '@angular/material/button';

@Component({
  selector: 'app-sidebar-institution',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    // Material
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    NgOptimizedImage
  ],
  templateUrl: './sidebar-institution.component.html',
  styleUrls: ['./sidebar-institution.component.css']
})
export class SidebarInstitutionComponent {
  // controla si el sidenav está abierto o no en pantallas pequeñas
  opened = true;

  toggleSidenav() {
    this.opened = !this.opened;
  }
}
