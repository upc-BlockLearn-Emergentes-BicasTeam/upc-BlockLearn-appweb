import { Component }                          from '@angular/core';
import { CommonModule }                       from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {SidebarInstitutionComponent} from '../../components/sidebar-institution/sidebar-institution.component';
import {BlockchainComponent} from '../../components/blockchain/blockchain.component';
import {CoursesComponent} from '../../components/courses/courses.component';


@Component({
  selector: 'app-pg-blockchain-teacher-institution',
  standalone: true,
  imports: [CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    SidebarInstitutionComponent, BlockchainComponent, CoursesComponent],
  templateUrl: './pg-blockchain-institution.component.html',
  styleUrls: ['./pg-blockchain-institution.component.css']
})
export class PgBlockchainInstitutionComponent {}
