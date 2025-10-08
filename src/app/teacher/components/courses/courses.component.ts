import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
import { Course, Student, BlockchainEntry, Syllabus, Enrollment, NoteRecord, Certificate } from '../../models/teacher.entity';

// Si tuvieras un componente de diálogo reutilizable, lo importarías así:
// import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  teacherId = '';
  courses: Course[] = [];
  enrollmentsByCourse: Record<string, Enrollment[]> = {};
  syllabuses: Syllabus[] = [];
  selectedCourse: Course | null = null;
  expanded: Record<string, boolean> = {};

  // Propiedades para la sección de Evaluaciones
  showCreateEval = false;
  newEvalQuestion = '';
  evalQuestions: string[] = [];

  // Propiedades para la gestión de certificados
  certificatesByEnrollment: Record<string, Certificate | null> = {};
  isUploading: Record<string, boolean> = {}; // Para mostrar un spinner por estudiante

  constructor(
    private route: ActivatedRoute,
    private tSvc: TeacherService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('No se encontró el ID del profesor en la URL');
      return;
    }
    this.teacherId = id;
    this.initialLoad();
  }

  private initialLoad(): void {
    this.tSvc.getById(this.teacherId).subscribe(teacher => {
      this.courses = teacher.courses ?? [];
      this.enrollmentsByCourse = {};
      this.courses.forEach(course => {
        this.enrollmentsByCourse[course.id] = course.enrollments ?? [];
        // Por cada matrícula, verificamos si ya tiene un certificado emitido
        course.enrollments?.forEach(enrollment => {
          this.checkExistingCertificate(enrollment);
        });
      });
    });

    this.tSvc.getAllSyllabuses().subscribe(syls => this.syllabuses = syls);
  }

  /* ═════════════════ Acciones UI ═════════════════ */

  selectCourse(c: Course): void {
    this.selectedCourse = c;
    this.expanded = {};
    // Reseteamos el estado de las evaluaciones al seleccionar un nuevo curso
    this.evalQuestions = [];
    this.showCreateEval = false;
    this.newEvalQuestion = '';
  }

  goBack(): void {
    this.selectedCourse = null;
  }

  toggleExpand(enrollmentId: string): void {
    this.expanded[enrollmentId] = !this.expanded[enrollmentId];
  }

  /* ═════════════════ Lógica de Gestión de Notas ═════════════════ */

  addNoteToEnrollment(enrollment: Enrollment, titleInput: HTMLInputElement, scoreInput: HTMLInputElement) {
    const newNoteTitle = titleInput.value.trim();
    const newNoteScore = parseFloat(scoreInput.value);

    if (!newNoteTitle || isNaN(newNoteScore) || newNoteScore < 0 || newNoteScore > 20) {
      this.snack.open('Por favor, ingresa un título y una nota válida (0-20).', 'Cerrar', { duration: 3000 });
      return;
    }

    const newNoteData: Omit<NoteRecord, 'id'> = {
      idEnrollment: enrollment.id,
      title: newNoteTitle,
      score: newNoteScore
    };

    this.tSvc.addNote(newNoteData).subscribe(createdNote => {
      enrollment.notesRecords?.push(createdNote);
      this.recalculateAverage(enrollment, this.selectedCourse!);
      this.snack.open(`Nota "${createdNote.title}" añadida con éxito.`, 'OK', { duration: 2000 });

      titleInput.value = '';
      scoreInput.value = '';
    });
  }

  updateNoteScore(enrollment: Enrollment, note: NoteRecord, event: Event) {
    const newScore = parseFloat((event.target as HTMLInputElement).value);
    if (isNaN(newScore) || newScore < 0 || newScore > 20) return;
    if (note.score === newScore) return;

    this.tSvc.updateNote(note.id, { score: newScore }).subscribe(updatedNote => {
      note.score = updatedNote.score;
      this.recalculateAverage(enrollment, this.selectedCourse!);
      this.snack.open(`Nota "${note.title}" actualizada a ${newScore}.`, 'OK', { duration: 2000 });
    });
  }

  deleteNote(enrollment: Enrollment, noteToDelete: NoteRecord) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la nota "${noteToDelete.title}"?`)) return;

    this.tSvc.deleteNote(noteToDelete.id).subscribe(() => {
      if (enrollment.notesRecords) {
        enrollment.notesRecords = enrollment.notesRecords.filter(n => n.id !== noteToDelete.id);
      }
      this.recalculateAverage(enrollment, this.selectedCourse!);
      this.snack.open(`Nota eliminada.`, 'OK', { duration: 2000 });
    });
  }

  private recalculateAverage(enrollment: Enrollment, course: Course) {
    const notes = enrollment.notesRecords ?? [];
    const weights = course.notesWeight ?? [];

    if (notes.length === 0) {
      enrollment.average = 0;
      return;
    }

    const weightedSum = notes.reduce((sum, note, index) => {
      const weight = weights[index] ?? 0;
      const weightedScore = note.score * (weight / 100);
      return sum + weightedScore;
    }, 0);

    enrollment.average = +weightedSum.toFixed(1);
  }

  /* ═════════════════ Lógica de Gestión de Certificados ═════════════════ */

  private checkExistingCertificate(enrollment: Enrollment): void {
    this.tSvc.getCertificateByEnrollmentId(enrollment.id).subscribe(certs => {
      this.certificatesByEnrollment[enrollment.id] = certs.length > 0 ? certs[0] : null;
    });
  }

  onFileSelected(event: Event, enrollment: Enrollment, course: Course): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      this.snack.open('Error: Solo se permiten archivos PDF, JPG o PNG.', 'Cerrar', { duration: 4000 });
      return;
    }
    if (file.size > maxSizeInBytes) {
      this.snack.open('Error: El archivo no puede superar los 5MB.', 'Cerrar', { duration: 4000 });
      return;
    }

    this.isUploading[enrollment.id] = true;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const certificateData: Omit<Certificate, 'id'> = {
        idCourse: course.id,
        idStudent: enrollment.idStudent,
        idEnrollment: enrollment.id,
        fileName: file.name,
        fileType: file.type,
        fileData: reader.result as string,
        issuedAt: new Date().toISOString(),
      };

      this.tSvc.uploadCertificate(certificateData).subscribe({
        next: newCertificate => {
          this.certificatesByEnrollment[enrollment.id] = newCertificate;
          this.snack.open('Certificado subido con éxito.', 'OK', { duration: 3000 });
          this.isUploading[enrollment.id] = false;
        },
        error: err => {
          console.error('Error al subir certificado:', err);
          this.snack.open('Ocurrió un error al subir el archivo.', 'Cerrar', { duration: 4000 });
          this.isUploading[enrollment.id] = false;
        }
      });
    };
    reader.onerror = error => {
      console.error('Error al leer el archivo:', error);
      this.snack.open('No se pudo leer el archivo seleccionado.', 'Cerrar', { duration: 4000 });
      this.isUploading[enrollment.id] = false;
    };
  }

  deleteCertificate(enrollment: Enrollment): void {
    const cert = this.certificatesByEnrollment[enrollment.id];
    if (!cert) return;

    if (confirm(`¿Seguro que quieres eliminar el certificado "${cert.fileName}"? Esta acción es irreversible.`)) {
      this.performDelete(cert.id, enrollment.id);
    }
  }

  private performDelete(certificateId: string, enrollmentId: string): void {
    this.tSvc.deleteCertificate(certificateId).subscribe({
      next: () => {
        this.certificatesByEnrollment[enrollmentId] = null;
        this.snack.open('Certificado eliminado. Ahora puedes subir uno nuevo.', 'OK', { duration: 3000 });
      },
      error: err => {
        console.error('Error al eliminar el certificado:', err);
        this.snack.open('No se pudo eliminar el certificado.', 'Cerrar', { duration: 4000 });
      }
    });
  }

  /* ═════════════════ Lógica de Evaluaciones ═════════════════ */

  toggleEvalForm() {
    this.showCreateEval = !this.showCreateEval;
  }

  addEvalQuestion() {
    const q = this.newEvalQuestion.trim();
    if (q) {
      this.evalQuestions.push(q);
      this.newEvalQuestion = '';
    }
  }

  /* ═════════════════ Funciones Auxiliares ═════════════════ */

  viewSyllabus(c: Course) {
    const syl = this.syllabuses.find(s => s.idCourse === c.id);
    if (!syl) {
      this.snack.open('Curso sin sílabo', 'Cerrar', { duration: 2500 });
      return;
    }
    if (syl.fileData?.startsWith('data:application/pdf')) {
      this.openBase64Pdf(syl.fileData, syl.fileName || 'syllabus.pdf');
      return;
    }
    if (syl.fileName) {
      window.open(`/assets/${this.encodeFile(syl.fileName)}`, '_blank');
      return;
    }
    this.snack.open('No se encontró el PDF', 'Cerrar', { duration: 2500 });
  }

  private openBase64Pdf(dataUri: string, title = 'syllabus.pdf') {
    const base64 = dataUri.split(',')[1];
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) {
      this.snack.open('Bloqueado por el navegador: permita pop-ups', 'Cerrar', { duration: 4000 });
    }
    w?.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
  }

  private encodeFile(f: string) { return encodeURIComponent(f); }

  goToBlock(id: string) { console.log('block-id', id); }
}
