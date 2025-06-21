import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';


import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SidebarStudentComponent} from "../../components/sidebar-student/sidebar-student.component";
import {BlockchainStudentComponent} from '../../components/blockchain-student/blockchain-student.component';
import {CoursesStudentComponent} from '../../components/courses-student/courses-student.component';

@Component({
  selector: 'app-pg-student-blockchain',
  imports: [

    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,

    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    SidebarStudentComponent,
    BlockchainStudentComponent,
    CoursesStudentComponent
  ],
  templateUrl: './pg-student-blockchain.component.html',
  styleUrl: './pg-student-blockchain.component.css'
})
export class PgStudentBlockchainComponent {

}
