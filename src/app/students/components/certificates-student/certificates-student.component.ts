import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/* Servicio y Modelos */
import { StudentService } from '../../services/student.service';
// CAMBIO: Usamos los modelos actualizados
import { Enrollment } from '../../model/student.entity';

@Component({
  selector: 'app-certificates-student',
  standalone: true,
  imports: [
    CommonModule, DatePipe,
    MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule
  ],
  templateUrl: './certificates-student.component.html',
  styleUrls: ['./certificates-student.component.css']
})
export class CertificatesStudentComponent implements OnInit {

  // CAMBIO: studentId ahora es un número
  studentId: number = 0;
  certifiedEnrollments: Enrollment[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private stuSvc: StudentService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'No se encontró un ID de estudiante en la URL.';
      this.isLoading = false;
      return;
    }
    // CAMBIO: Convertimos el ID a número
    this.studentId = +idParam;
    this.loadCertificates();
  }

  private loadCertificates(): void {
    this.isLoading = true;
    this.error = null;

    // CAMBIO: Llamamos al nuevo método del servicio
    this.stuSvc.getStudentProfileById(this.studentId).subscribe({
      next: student => {
        // La lógica de filtrado se mantiene, pero ahora opera sobre los datos
        // que vinieron de una sola llamada a la API.
        this.certifiedEnrollments = student.enrollments?.filter(
          e => !!e.certificate // Filtramos solo las matrículas que tienen un certificado
        ) ?? [];
        this.isLoading = false;
      },
      error: err => {
        console.error("Error al cargar los datos del estudiante:", err);
        this.error = "No se pudieron cargar tus certificados. Por favor, inténtalo de nuevo más tarde.";
        this.isLoading = false;
      }
    });
  }

  /**
   * Permite al usuario descargar el certificado.
   * La cadena Base64 se usa como una URL de datos.
   */
  downloadCertificate(enrollment: Enrollment): void {
    if (!enrollment.certificate) {
      this.error = 'No se encontró el archivo del certificado.';
      return;
    }
    const link = document.createElement('a');
    link.href = enrollment.certificate.fileData;
    link.download = enrollment.certificate.fileName;
    link.click();
    link.remove();
  }
}
