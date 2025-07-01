import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';

import { SidebarInstitutionComponent } from '../../components/sidebar-institution/sidebar-institution.component';
import { ProfileComponent }            from '../../components/profile/profile.component';

@Component({
  selector: 'app-pg-profile',
  standalone: true,
  imports: [
    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    // Your components
    SidebarInstitutionComponent,
    ProfileComponent
  ],
  templateUrl: './pg-profile.component.html',
  styleUrls: ['./pg-profile.component.css']
})
export class PgProfileComponent {}
