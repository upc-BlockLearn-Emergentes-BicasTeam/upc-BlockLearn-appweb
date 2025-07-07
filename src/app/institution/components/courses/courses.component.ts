import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable } from 'rxjs';

/* Angular Material */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

/* Servicios y Modelos */
import { InstitutionService } from '../../services/institution.service';
import { Course, Teacher, Student, Syllabus } from '../../models/institution.entity';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatExpansionModule, MatListModule, MatDividerModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSelectModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  @ViewChild('courseFormTpl') courseFormTpl!: TemplateRef<any>;
  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;

  readonly institutionId = Number(localStorage.getItem('institutionId'));

  courses: Course[] = [];
  teachers: Teacher[] = [];
  studentsMap: Record<number, Student[]> = {};
  syllabusMap: Record<number, Syllabus> = {};

  formCourse: {
    id?: number;
    name: string;
    code: string;
    section: string;
    passingGrade: number;
    notesWeight: number[];
    teacherId?: number;
    syllabusFile?: File;
    syllabusFileName?: string;
    syllabusData?: string;
  } = this.getEmptyFormCourse();

  isEditing = false;

  constructor(
    private instSvc: InstitutionService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.institutionId) {
      this.snack.open("Error: No se pudo identificar la institución.", "Cerrar");
      return;
    }
    this.initialLoad();
  }

  private initialLoad(): void {
    forkJoin({
      courses: this.instSvc.getCoursesByInstitution(this.institutionId),
      teachers: this.instSvc.getTeachersByInstitution(this.institutionId),
    }).subscribe({
      next: ({ courses, teachers }) => {
        this.courses = courses;
        this.teachers = teachers;
        this.courses.forEach(course => this.loadSyllabusForCourse(course.id));
      },
      error: (err) => {
        this.snack.open(err.message || 'Error al cargar los datos iniciales.', 'Cerrar');
        console.error(err);
      }
    });
  }

  private loadSyllabusForCourse(courseId: number): void {
    this.instSvc.getSyllabusByCourse(courseId).subscribe(syllabus => {
      if (syllabus) {
        this.syllabusMap[courseId] = syllabus;
      }
    });
  }

  getStudentsForCourse(id: number) { return this.studentsMap[id] ?? []; }
  getSyllabusHash(id: number) { return this.syllabusMap[id]?.hash ?? 'Sin registro'; }
  getTeacherFullName(id: number) {
    const t = this.teachers.find(x => x.id === id);
    return t ? `${t.firstName} ${t.lastName}` : 'No asignado';
  }

  deleteCourse(courseId: number): void {
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, { width: '400px', disableClose: true });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.instSvc.deleteCourse(courseId).subscribe({
          next: () => {
            this.snack.open('Curso eliminado correctamente.', 'OK', { duration: 3000 });
            this.initialLoad();
          },
          error: (err) => {
            console.error(`Error al eliminar el curso ${courseId}:`, err);
            this.snack.open(err.message || 'Error al eliminar el curso.', 'Cerrar');
          }
        });
      }
    });
  }

  openAddCourse() {
    this.isEditing = false;
    this.formCourse = this.getEmptyFormCourse();
    this.dialog.open(this.courseFormTpl, { width: '560px', disableClose: true });
  }

  openEditCourse(c: Course) {
    this.isEditing = true;
    this.formCourse = {
      id: c.id,
      name: c.name,
      code: c.code,
      section: c.section,
      passingGrade: c.passingGrade ?? 70,
      notesWeight: [...(c.notesWeight ?? [])],
      teacherId: c.teacherId,
      syllabusFileName: this.syllabusMap[c.id]?.fileName
    };
    this.dialog.open(this.courseFormTpl, { width: '560px', disableClose: true });
  }

  saveCourse() {
    const f = this.formCourse;
    if (!f.name || !f.teacherId) {
      this.snack.open('Nombre del curso y profesor son obligatorios', 'Cerrar', { duration: 3000 });
      return;
    }

    const coursePayload = {
      name: f.name,
      code: f.code,
      section: f.section,
      passingGrade: f.passingGrade,
      institutionId: this.institutionId,
      teacherId: f.teacherId,
      notesWeight: f.notesWeight,
      syllabusFileName: f.syllabusFileName, // Se puede enviar vacío
      syllabusHash: '' // El hash se genera en el backend
    };

    const saveOperation: Observable<Course> = this.isEditing && f.id
      ? this.instSvc.updateCourse(f.id, coursePayload)
      : this.instSvc.createCourse(coursePayload);

    saveOperation.subscribe({
      next: (savedCourse) => {
        const action = this.isEditing ? 'actualizado' : 'creado';
        if (f.syllabusData && f.syllabusFileName) {
          const syllabusPayload: Omit<Syllabus, 'id'> = {
            courseId: savedCourse.id,
            fileName: f.syllabusFileName,
            fileData: f.syllabusData,
            hash: '' // El backend debería generar el hash
          };
          this.instSvc.uploadSyllabus(syllabusPayload).subscribe({
            next: () => {
              this.snack.open(`Curso ${action} y sílabo subido.`, 'OK', { duration: 3000 });
              this.dialog.closeAll();
              this.initialLoad();
            },
            error: err => {
              this.snack.open(`Curso guardado, pero falló la subida del sílabo: ${err.message}`, 'Cerrar');
            }
          });
        } else {
          this.snack.open(`Curso ${action} con éxito.`, 'OK', { duration: 3000 });
          this.dialog.closeAll();
          this.initialLoad();
        }
      },
      error: (err) => {
        console.error('Error al guardar el curso', err);
        this.snack.open(err.message || 'Error al guardar el curso.', 'Cerrar');
      }
    });
  }

  onFileSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.formCourse.syllabusFileName = file.name;
    const fr = new FileReader();
    fr.onload = () => this.formCourse.syllabusData = fr.result as string;
    fr.readAsDataURL(file);
  }

  viewSyllabus(c: Course) {
    const syllabus = this.syllabusMap[c.id];
    if (syllabus && syllabus.fileData) {
      this.openBase64Pdf(syllabus.fileData, syllabus.fileName);
    } else {
      this.snack.open('Este curso no tiene un sílabo cargado.', 'Cerrar', { duration: 3000 });
    }
  }

  private openBase64Pdf(dataUri: string, title = 'syllabus.pdf') {
    const base64 = dataUri.split(',')[1];
    if (!base64) {
      this.snack.open('Error: El formato del sílabo no es válido.', 'Cerrar');
      return;
    }
    const byteChars = atob(base64);
    const byteNumbers = Array.from(byteChars, char => char.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const newWindow = window.open(blobUrl, '_blank');
    if (!newWindow) {
      this.snack.open('El navegador bloqueó la apertura de una nueva pestaña.', 'Cerrar');
    }
  }

  addNoteWeight() { this.formCourse.notesWeight.push(0); }
  removeNoteWeight(i: number) { this.formCourse.notesWeight.splice(i, 1); }
  trackById(_: number, c: Course) { return c.id; }

  private getEmptyFormCourse() {
    return {
      name: '',
      code: '',
      section: '',
      passingGrade: 70,
      notesWeight: [25, 25, 25, 25]
    };
  }

  getFormulaString(weights: number[] | undefined): string {
    if (!weights || weights.length === 0) return 'Sin definir';
    const labels = ['PC1', 'EA', 'PC2', 'EB'];
    return weights.map((w, i) => `${w}% (${labels[i] || 'N' + (i + 1)})`).join(' + ');
  }
}
