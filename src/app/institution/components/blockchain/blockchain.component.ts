import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { InstitutionService } from '../../services/institution.service';
import { BlockchainEntry } from '../../models/institution.entity';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  entries: BlockchainEntry[] = [];

  constructor(private instSvc: InstitutionService) {}

  ngOnInit(): void {
    this.instSvc.getById('1').subscribe(inst => {
      this.entries = inst.blockchainEntries || [];
    });
  }

  downloadDocument(e: BlockchainEntry) {
    console.log('Download document for', e.id);
  }

  goToBlock(entryId: string) {
    console.log('Go to block', entryId);
  }
}
