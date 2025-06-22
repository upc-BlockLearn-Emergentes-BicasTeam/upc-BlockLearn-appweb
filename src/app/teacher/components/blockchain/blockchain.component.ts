import { Component, OnInit }         from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatCardModule }              from '@angular/material/card';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { MatExpansionModule }         from '@angular/material/expansion';
import { MatDividerModule }           from '@angular/material/divider';
import { TeacherService }             from '../../services/teacher.service';
import { BlockchainEntry }            from '../../models/teacher.entity';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  entries: BlockchainEntry[] = [];

  constructor(private teacherSvc: TeacherService) {}

  ngOnInit(): void {
    // Carga las entradas de blockchain para el profesor actual (id "1" de ejemplo)
    this.teacherSvc.getById('1')
      .subscribe(teacher => {
        this.entries = teacher.blockchainEntries || [];
      });
  }

  downloadDocument(e: BlockchainEntry) {
    console.log('Download document for', e.id);
    // aquí puedes disparar la descarga real
  }

  goToBlock(e: BlockchainEntry) {
    console.log('Go to block', e.id);
    // aquí rediriges al explorador de bloques
  }
}
