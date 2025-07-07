import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar
import { ActivatedRoute } from '@angular/router';

import { TeacherService } from '../../services/teacher.service';
// CAMBIO: Usamos el modelo actualizado con IDs numéricos
import { BlockchainEntry } from '../../models/teacher.entity';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinner,
    MatProgressSpinner
  ],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {

  entries: BlockchainEntry[] = [];
  isLoading = false;

  constructor(
    private teacherSvc: TeacherService,
    private snack: MatSnackBar // Inyectar MatSnackBar para notificaciones
  ) {}

  ngOnInit(): void {
    this.loadBlockchainEntries();
  }

  private loadBlockchainEntries(): void {
    this.isLoading = true;
    // CAMBIO: Llamamos al nuevo método directo del servicio.
    this.teacherSvc.getBlockchainEntries().subscribe({
      next: (data) => {
        // La API devuelve los más recientes primero, los invertimos para mostrarlos cronológicamente
        this.entries = data.reverse();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar las entradas blockchain', err);
        this.snack.open(err.message || 'Error al cargar el registro de auditoría.', 'Cerrar');
        this.isLoading = false;
      }
    });
  }

  // Este método ya no es necesario ya que no se puede descargar el documento desde aquí.
  // downloadDocument(entry: BlockchainEntry): void { ... }

  goToBlock(entry: BlockchainEntry): void {
    // Simula una URL a un explorador de bloques, usando el hash del bloque.
    const fakeUrl = `https://explorer.blockchain.edu/block/${entry.blockHash}`;
    window.open(fakeUrl, '_blank');
  }

  // Este método se mantiene igual, ya que la lógica de la etiqueta no cambia.
  getEntryLabel(entry: BlockchainEntry): string {
    switch (entry.type) {
      case 'CERTIFICATE':
        return `Certificado emitido (ID de Referencia: ${entry.referenceId})`;
      case 'SYLLABUS':
        return `Sílabo registrado (ID de Referencia: ${entry.referenceId})`;
      case 'NOTE_RECORD':
        return `Nota registrada (ID de Referencia: ${entry.referenceId})`;
      default:
        // Forzar un chequeo exhaustivo por parte de TypeScript
        const _exhaustiveCheck: never = entry.type;
        return 'Entrada desconocida';
    }
  }
}
