import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {SidebarTeacherComponent} from '../../components/sidebar-teacher/sidebar-teacher.component';
import {ProfileComponent} from '../../components/profile/profile.component';

@Component({
  selector: 'app-pg-profile',
  imports: [
    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarTeacherComponent,
    ProfileComponent,
    ProfileComponent


  ],
  templateUrl: './pg-profile.component.html',
  styleUrl: './pg-profile.component.css'
})
export class PgProfileComponent {

}
