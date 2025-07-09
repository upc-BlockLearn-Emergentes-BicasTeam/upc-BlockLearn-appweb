import { Component }                          from '@angular/core';
import { CommonModule }                       from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {SidebarInstitutionComponent} from '../../components/sidebar-institution/sidebar-institution.component';
import {CoursesComponent} from '../../components/courses/courses.component';
import {BlockchainComponent} from '../../../teacher/components/blockchain/blockchain.component';


@Component({
  selector: 'app-pg-blockchain-teacher-institution',
  standalone: true,
  imports: [CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    SidebarInstitutionComponent, BlockchainComponent, CoursesComponent, BlockchainComponent],
  templateUrl: './pg-blockchain-institution.component.html',
  styleUrls: ['./pg-blockchain-institution.component.css']
})
export class PgBlockchainInstitutionComponent {}
