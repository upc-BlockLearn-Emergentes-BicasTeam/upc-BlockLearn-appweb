import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';

import { TeacherService } from '../../services/teacher.service';
import { BlockchainEntry } from '../../models/teacher.entity';
import {ActivatedRoute} from '@angular/router';

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

  constructor(private teacherSvc: TeacherService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.teacherSvc.getById(teacherId).subscribe({
        next: teacher => {
          this.entries = teacher.blockchainEntries || [];
        },
        error: err => {
          console.error('Error al cargar las entradas blockchain', err);
        }
      });
    } else {
      console.error('No se encontró el ID del docente en la URL');
    }
  }


  downloadDocument(entry: BlockchainEntry): void {
    if (entry.type === 'Syllabus' && entry.course?.syllabusFileName) {
      const url = `/assets/${entry.course.syllabusFileName}`;
      window.open(url, '_blank');
    } else {
      alert('Documento no disponible para descarga.');
    }
  }

  goToBlock(entry: BlockchainEntry): void {
    const fakeUrl = `https://explorer.blockchain.edu/block/${entry.id}`;
    window.open(fakeUrl, '_blank');
  }

  getEntryLabel(entry: BlockchainEntry): string {
    switch (entry.type) {
      case 'Certificate':
        return `Certificado para estudiante ${entry.studentCode}`;
      case 'Syllabus':
        return `Sílabo del curso ${entry.course?.name}`;
      case 'Grade':
        return `Notas del curso ${entry.course?.name} - Estudiante ${entry.studentCode}`;
      default:
        return 'Entrada desconocida';
    }
  }
}
