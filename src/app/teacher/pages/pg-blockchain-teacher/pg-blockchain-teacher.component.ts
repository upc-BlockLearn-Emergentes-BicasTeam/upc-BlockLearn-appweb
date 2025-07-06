import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatSidenavModule }  from '@angular/material/sidenav';
import { MatToolbarModule }  from '@angular/material/toolbar';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';

import {SidebarTeacherComponent} from '../../components/sidebar-teacher/sidebar-teacher.component';
import {BlockchainComponent} from '../../components/blockchain/blockchain.component';

@Component({
  selector: 'app-pg-blockchain-teacher-institution',
  standalone: true,
  imports: [

    CommonModule,
    // Material modules
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarTeacherComponent,


    BlockchainComponent

  ],
  templateUrl: './pg-blockchain-teacher.component.html',
  styleUrl: './pg-blockchain-teacher.component.css'
})
export class PgBlockchainTeacherComponent {

}


