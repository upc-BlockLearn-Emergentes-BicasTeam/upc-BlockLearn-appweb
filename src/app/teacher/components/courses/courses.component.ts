import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

/* Servicios y modelos */
import { TeacherService } from '../../services/teacher.service';
import { Course, Enrollment, NoteRecord, Certificate } from '../../models/teacher.entity';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    MatExpansionModule, MatFormFieldModule, MatSelectModule, MatOptionModule,
    MatInputModule, MatDialogModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;

  teacherId: number = 0;
  courses: Course[] = [];
  selectedCourse: Course | null = null;
  expanded: Record<number, boolean> = {};

  showCreateEval = false;
  newEvalQuestion = '';
  evalQuestions: string[] = [];

  certificatesByEnrollment: Record<number, Certificate | null> = {};
  isUploading: Record<number, boolean> = {};

  constructor(
    private route: ActivatedRoute,
    private tSvc: TeacherService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.teacherId = +id;
      this.loadInitialData();
    } else {
      console.error('No se encontró el ID del profesor en la URL');
      this.snack.open('Error: No se pudo identificar al profesor.', 'Cerrar');
    }
  }

  private loadInitialData(): void {
    this.tSvc.getTeacherProfile(this.teacherId).subscribe({
      next: teacher => {
        this.courses = teacher.courses ?? [];
      },
      error: err => {
        console.error('Error al cargar los cursos del profesor', err);
        this.snack.open(err.message || 'Error al cargar los cursos.', 'Cerrar');
      }
    });
  }

  selectCourse(course: Course): void {
    this.expanded = {};
    this.tSvc.getCourseDetails(course.id).subscribe({
      next: detailedCourse => {
        this.selectedCourse = detailedCourse;
        this.selectedCourse.enrollments?.forEach(enrollment => {
          this.recalculateAverage(enrollment);
          this.checkExistingCertificate(enrollment);
        });
      },
      error: err => {
        this.snack.open(err.message || `Error al cargar detalles del curso ${course.name}.`, 'Cerrar');
        this.selectedCourse = course;
      }
    });
  }

  goBack(): void {
    this.selectedCourse = null;
    this.loadInitialData();
  }

  addNoteToEnrollment(enrollment: Enrollment, titleInput: HTMLInputElement, scoreInput: HTMLInputElement) {
    const newNoteTitle = titleInput.value.trim();
    const newNoteScore = parseInt(scoreInput.value, 10);

    if (!newNoteTitle || isNaN(newNoteScore) || newNoteScore < 0 || newNoteScore > 20) {
      this.snack.open('Por favor, ingresa un título y una nota válida (0-20).', 'Cerrar');
      return;
    }

    const newNoteData: Omit<NoteRecord, 'id'> = { enrollmentId: enrollment.id, title: newNoteTitle, score: newNoteScore };
    this.tSvc.addNote(newNoteData).subscribe(createdNote => {
      (enrollment.notesRecords = enrollment.notesRecords ?? []).push(createdNote);
      this.recalculateAverage(enrollment);
      this.snack.open(`Nota "${createdNote.title}" añadida con éxito.`, 'OK', { duration: 2000 });
      titleInput.value = ''; scoreInput.value = '';
    });
  }

  updateNoteScore(enrollment: Enrollment, note: NoteRecord, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const newScore = parseInt(inputElement.value, 10);

    if (isNaN(newScore) || newScore < 0 || newScore > 20) {
      inputElement.value = note.score.toString();
      this.snack.open('Por favor, ingrese una nota válida (0-20).', 'Cerrar');
      return;
    }

    if (note.score === newScore) return;

    // SOLUCIÓN 2: Lógica robusta de actualización
    this.tSvc.updateNote(note.id, { score: newScore }).subscribe({
      next: (updatedNote) => {
        note.score = updatedNote.score;
        this.recalculateAverage(enrollment);
        this.snack.open(`Nota "${note.title}" actualizada.`, 'OK', { duration: 2000 });
      },
      error: (err) => {
        inputElement.value = note.score.toString(); // Revertir el cambio en la vista si falla
        console.error('Error updating note:', err);
        this.snack.open(err.message || 'Error al actualizar la nota.', 'Cerrar');
      }
    });
  }

  deleteNote(enrollment: Enrollment, noteToDelete: NoteRecord) {
    // --- INICIO DEL CAMBIO ---
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación de Nota',
        message: `¿Estás seguro de que quieres eliminar la nota "${noteToDelete.title}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tSvc.deleteNote(noteToDelete.id).subscribe(() => {
          enrollment.notesRecords = enrollment.notesRecords?.filter(n => n.id !== noteToDelete.id);
          this.recalculateAverage(enrollment);
          this.snack.open('Nota eliminada.', 'OK', { duration: 2000 });
        });
      }
    });
    // --- FIN DEL CAMBIO ---
  }

  private recalculateAverage(enrollment: Enrollment) {
    const notes = enrollment.notesRecords ?? [];
    const weights = this.selectedCourse?.notesWeight ?? [];

    if (notes.length === 0) {
      enrollment.average = 0;
      return;
    }

    const weightedSum = notes.reduce((sum, note, index) => {
      const weight = weights[index] ?? (100 / notes.length);
      return sum + (note.score * (weight / 100));
    }, 0);

    enrollment.average = +weightedSum.toFixed(1);
  }

  private checkExistingCertificate(enrollment: Enrollment): void {
    this.tSvc.getCertificateByEnrollmentId(enrollment.id).subscribe({
      next: cert => { this.certificatesByEnrollment[enrollment.id] = cert; },
      error: () => { this.certificatesByEnrollment[enrollment.id] = null; }
    });
  }

  onFileSelected(event: Event, enrollment: Enrollment, course: Course): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];

    this.isUploading[enrollment.id] = true;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const certificateData: Omit<Certificate, 'id' | 'issuedAt'> = {
        enrollmentId: enrollment.id,
        courseId: course.id,
        studentId: enrollment.studentId,
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result as string,
      };

      this.tSvc.uploadCertificate(certificateData).subscribe({
        next: newCertificate => {
          this.certificatesByEnrollment[enrollment.id] = newCertificate;
          this.snack.open('Certificado subido con éxito.', 'OK');
          this.isUploading[enrollment.id] = false;
        },
        error: err => {
          this.snack.open(err.message || 'Error al subir el archivo.', 'Cerrar');
          this.isUploading[enrollment.id] = false;
        }
      });
    };
  }

  deleteCertificate(enrollment: Enrollment): void {
    const cert = this.certificatesByEnrollment[enrollment.id];
    if (!cert) return;

    // --- INICIO DEL CAMBIO ---
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, {
      width: '450px',
      data: {
        title: 'Eliminar Certificado',
        message: `¿Seguro que quieres eliminar el certificado "${cert.fileName}"? Esta acción es irreversible.`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.tSvc.deleteCertificate(cert.id).subscribe({
          next: () => {
            this.certificatesByEnrollment[enrollment.id] = null;
            this.snack.open('Certificado eliminado.', 'OK');
          },
          error: err => {
            this.snack.open(err.message || 'No se pudo eliminar el certificado.', 'Cerrar');
          }
        });
      }
    });
    // --- FIN DEL CAMBIO ---
  }

  toggleEvalForm() { this.showCreateEval = !this.showCreateEval; }
  addEvalQuestion() {
    const q = this.newEvalQuestion.trim();
    if (q) {
      this.evalQuestions.push(q);
      this.newEvalQuestion = '';
    }
  }

  viewSyllabus(course: Course) {
    this.tSvc.getSyllabusByCourseId(course.id).subscribe({
      next: (syllabus) => {
        if (syllabus && syllabus.fileData) {
          // La lógica para abrir el PDF que ya tenías en el InstitutionComponent
          const base64 = syllabus.fileData.split(',')[1];
          if (!base64) {
            this.snack.open('Error: Formato de sílabo no válido.', 'Cerrar');
            return;
          }
          const byteChars = atob(base64);
          const byteNumbers = Array.from(byteChars, char => char.charCodeAt(0));
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);
          window.open(blobUrl, '_blank');
        } else {
          this.snack.open('No se encontró el archivo del sílabo para este curso.', 'Cerrar');
        }
      },
      error: (err) => {
        console.error("Error fetching syllabus:", err);
        this.snack.open('No se encontró el sílabo para este curso.', 'Cerrar');
      }
    });
  }

  getFormulaString(weights: number[] | undefined): string {
    if (!weights || weights.length === 0) return 'Sin definir';
    const labels = ['PC1', 'EA', 'PC2', 'EB']; // O las etiquetas que correspondan
    return weights.map((w, i) => `${w}% (${labels[i] || 'N' + (i + 1)})`).join(' + ');
  }

  finalizeEnrollment(enrollment: Enrollment): void {
    if (enrollment.average < (this.selectedCourse?.passingGrade ?? 101)) {
      this.snack.open('No se puede finalizar: el estudiante no ha alcanzado la nota mínima.', 'Cerrar');
      return;
    }

    // --- INICIO DEL CAMBIO ---
    // En lugar de confirm(), abrimos el diálogo de Material
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, {
      width: '400px',
      data: {
        title: 'Finalizar Curso',
        message: '¿Estás seguro de finalizar el curso para este estudiante? Esta acción permitirá emitir un certificado.'
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      // El diálogo devuelve 'true' si se hizo clic en "Sí, Continuar"
      if (confirmed) {
        this.tSvc.updateEnrollmentState(enrollment.id, 'completed').subscribe({
          next: (updatedEnrollment) => {
            enrollment.state = updatedEnrollment.state;
            this.snack.open('Curso finalizado para el estudiante. Ya se puede emitir el certificado.', 'OK', { duration: 3500 });
          },
          error: (err) => {
            console.error('Error finalizing enrollment:', err);
            this.snack.open(err.message || 'Error al finalizar el curso.', 'Cerrar');
          }
        });
      }
    });
    // --- FIN DEL CAMBIO ---
  }

}
