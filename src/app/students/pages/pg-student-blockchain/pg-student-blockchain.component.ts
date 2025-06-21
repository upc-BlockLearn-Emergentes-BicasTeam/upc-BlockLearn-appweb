import { Component } from '@angular/core';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {SidebarStudentComponent} from "../../components/sidebar-student/sidebar-student.component";
import {BlockchainStudentComponent} from '../../components/blockchain-student/blockchain-student.component';

@Component({
  selector: 'app-pg-student-blockchain',
  imports: [
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    SidebarStudentComponent,
    BlockchainStudentComponent
  ],
  templateUrl: './pg-student-blockchain.component.html',
  styleUrl: './pg-student-blockchain.component.css'
})
export class PgStudentBlockchainComponent {

}
