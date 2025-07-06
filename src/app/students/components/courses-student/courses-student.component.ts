import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list'; // Importado para la lista de notas

/* Servicio + modelos */
import { StudentService } from '../../services/student.service';
import {
  Student,
  Course,
  Syllabus,
  Enrollment,
  NoteRecord
} from '../../model/student.entity';

@Component({
  selector: 'app-courses-student',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatListModule // Añadido a los imports
  ],
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {

  studentId = '';
  student!: Student;

  // El estado principal ahora es la lista de matrículas enriquecidas.
  enrollments: Enrollment[] = [];

  // La selección ahora se basa en una matrícula, no en un curso.
  selectedEnrollment: Enrollment | null = null;

  constructor(
    private route: ActivatedRoute,
    private stuSvc: StudentService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('[Student] sin ID en la URL');
      return;
    }
    this.studentId = id;
    this.loadData();
  }

  private loadData(): void {
    this.stuSvc.getById(this.studentId).subscribe(st => {
      this.student = st;
      // El servicio ya nos devuelve las matrículas con toda la información necesaria.
      this.enrollments = st.enrollments ?? [];
    });
  }

  /* ─── Navegación y Selección ─── */

  /**
   * Maneja la selección de una matrícula para ver sus detalles.
   * Si la matrícula ya está seleccionada, la deselecciona (comportamiento de toggle).
   */
  selectEnrollment(enrollment: Enrollment): void {
    const isAlreadySelected = this.selectedEnrollment?.id === enrollment.id;

    if (isAlreadySelected) {
      this.selectedEnrollment = null;
    } else {
      this.selectedEnrollment = enrollment;
    }
  }

  /**
   * Vuelve a la vista de lista de cursos.
   */
  goBack(): void {
    this.selectedEnrollment = null;
  }

  /* ─── Funcionalidad de Sílabo ─── */
  viewSyllabus(course: Course | undefined): void {
    if (!course || !course.syllabus) {
      this.snack.open('Este curso no tiene un sílabo disponible.', 'Cerrar', { duration: 3000 });
      return;
    }

    const syl = course.syllabus;
    if (syl.fileData?.startsWith('data:application/pdf')) {
      this.openBase64Pdf(syl.fileData, syl.fileName || 'syllabus.pdf');
      return;
    }

    if (syl.fileName) {
      window.open(`/assets/${this.encode(syl.fileName)}`, '_blank');
      return;
    }

    this.snack.open('No se pudo encontrar el archivo del sílabo.', 'Cerrar', { duration: 3000 });
  }

  /* --- Métodos privados para PDF --- */
  private openBase64Pdf(dataUri: string, title = 'syllabus.pdf') {
    try {
      const base64 = dataUri.split(',')[1];
      const bytes = Uint8Array.from(atob(base64), ch => ch.charCodeAt(0));
      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        this.snack.open('Pop-up bloqueado. Por favor, habilítalos para este sitio.', 'Cerrar', { duration: 4000 });
      }
      win?.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
    } catch (error) {
      console.error("Error al procesar el PDF en Base64:", error);
      this.snack.open("No se pudo abrir el archivo PDF.", 'Cerrar', { duration: 3000 });
    }
  }

  private encode(f: string) { return encodeURIComponent(f); }
}
