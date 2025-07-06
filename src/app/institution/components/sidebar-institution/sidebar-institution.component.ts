import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sidebar-institution',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './sidebar-institution.component.html',
  styleUrls: ['./sidebar-institution.component.css']
})
export class SidebarInstitutionComponent implements OnInit {
  opened = true;
  institutionId: string = '';

  ngOnInit(): void {
    this.institutionId = localStorage.getItem('institutionId') || '';
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }
}
