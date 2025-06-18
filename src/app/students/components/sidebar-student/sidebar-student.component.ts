import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-sidebar-student',
  imports: [
    RouterLink,
    RouterLinkActive,
    NgOptimizedImage
  ],
  templateUrl: './sidebar-student.component.html',
  styleUrl: './sidebar-student.component.css'
})
export class SidebarStudentComponent {

}
