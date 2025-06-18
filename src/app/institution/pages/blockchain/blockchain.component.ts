import { Component, OnInit }       from '@angular/core';
import { CommonModule }             from '@angular/common';
import { InstitutionService }       from '../../services/institution.service';
import { BlockchainEntry }          from '../../models/institution.entity';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  entries: BlockchainEntry[] = [];
  expanded: Record<string, boolean> = {};

  constructor(private instSvc: InstitutionService) {}

  ngOnInit(): void {
    this.instSvc.getById('1').subscribe(inst => {
      this.entries = inst.blockchainEntries || [];
    });
  }

  toggleExpand(e: BlockchainEntry) {
    this.expanded[e.id] = !this.expanded[e.id];
  }

  downloadDocument(e: BlockchainEntry) {
    console.log('Download document for', e.id);
  }

  goToBlock(e: BlockchainEntry) {
    console.log('Go to block', e.id);
  }
}
