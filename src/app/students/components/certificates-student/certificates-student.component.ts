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
import { Enrollment } from '../../model/student.entity';

@Component({
  selector: 'app-certificates-student',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './certificates-student.component.html',
  styleUrls: ['./certificates-student.component.css']
})
export class CertificatesStudentComponent implements OnInit {

  studentId = '';
  certifiedEnrollments: Enrollment[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private stuSvc: StudentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'No se encontró un ID de estudiante en la URL.';
      this.isLoading = false;
      return;
    }
    this.studentId = id;
    this.loadCertificates();
  }

  private loadCertificates(): void {
    this.isLoading = true;
    this.error = null;

    this.stuSvc.getById(this.studentId).subscribe({
      next: student => {
        // Filtramos para quedarnos solo con las matrículas que tienen un certificado emitido.
        this.certifiedEnrollments = student.enrollments?.filter(
          e => !!e.certificate
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

  // No necesitamos la lógica de abrir PDFs aquí, ya que el HTML usará
  // el atributo 'download' para una descarga directa, lo cual es más intuitivo
  // para un certificado.
}
