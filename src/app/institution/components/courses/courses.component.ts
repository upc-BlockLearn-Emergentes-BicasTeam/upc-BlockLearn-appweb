import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material (sin cambios en imports)
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { InstitutionService } from '../../services/institution.service';
import { Course, Teacher, BlockchainEntry, Institution } from '../../models/institution.entity';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatExpansionModule, MatListModule, MatDividerModule, MatFormFieldModule,
    MatInputModule, MatDialogModule, MatSelectModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  @ViewChild('addCourseTpl') addCourseTpl!: TemplateRef<any>;
  @ViewChild('confirmDeleteTpl') confirmDeleteTpl!: TemplateRef<any>;

  private institutionId = '1';
  courses: Course[] = [];
  teachers: Teacher[] = [];
  syllabusEntries: BlockchainEntry[] = [];

  newCourse: Partial<Course & { syllabusFile?: File; syllabusFileName?: string; notesWeight: number[] }> = { notesWeight: [] };

  constructor(
    private instSvc: InstitutionService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadInstitution();
  }

  private loadInstitution() {
    this.instSvc.getById(this.institutionId).subscribe({
      next: (inst: Institution) => {
        this.courses = inst.courses || [];
        this.teachers = inst.teachers || [];
        this.syllabusEntries = (inst.blockchainEntries || []).filter(e => e.type === 'Syllabus');
      },
      error: err => {
        console.error('Error cargando institución', err);
        // AJUSTE 3: Añadir panelClass para elevar el z-index del snackbar
        this.snackBar.open('Error al cargar los datos.', 'Cerrar', {
          duration: 3000,
          panelClass: ['high-z-snackbar']
        });
      }
    });
  }

  getSyllabusForCourse(courseId: string): BlockchainEntry | undefined {
    return this.syllabusEntries.find(e => e.course?.id === courseId);
  }

  private persistAll() {
    this.instSvc.update(this.institutionId, {
      courses: this.courses,
      blockchainEntries: this.syllabusEntries,
      teachers: this.teachers
    }).subscribe({
      next: () => {},
      error: err => {
        console.error('Error guardando los datos', err);
        // AJUSTE 3: Añadir panelClass
        this.snackBar.open('Error al guardar los cambios.', 'Cerrar', {
          duration: 3000,
          panelClass: ['snackbar-error', 'high-z-snackbar']
        });
      }
    });
  }

  openDeleteConfirmation(c: Course) {
    const dialogRef = this.dialog.open(this.confirmDeleteTpl, {
      width: '400px',
      data: c
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCourse(c);
      }
    });
  }

  private deleteCourse(c: Course) {
    this.courses = this.courses.filter(x => x.id !== c.id);
    this.syllabusEntries = this.syllabusEntries.filter(e => e.course?.id !== c.id);
    this.persistAll();
    // AJUSTE 3: Añadir panelClass
    this.snackBar.open(`Curso "${c.name}" eliminado correctamente.`, 'OK', {
      duration: 3000,
      panelClass: ['high-z-snackbar']
    });
  }

  openAddCourse() {
    this.newCourse = { notesWeight: [25, 25, 50] };
    this.dialog.open(this.addCourseTpl, { width: '550px', disableClose: true });
  }

  saveNewCourse() {
    if (!this.newCourse.name || !this.newCourse.teacher) {
      // AJUSTE 3: Añadir panelClass
      this.snackBar.open('Por favor, complete los campos obligatorios.', 'Cerrar', {
        duration: 3000,
        panelClass: ['high-z-snackbar']
      });
      return;
    }

    const id = (this.courses.length + 1).toString().padStart(2, '0');
    const created: Course = {
      id,
      name: this.newCourse.name!,
      code: id,
      section: this.newCourse.section || 'A',
      passingGrade: this.newCourse.passingGrade || 70,
      teacher: this.newCourse.teacher!,
      notesWeight: this.newCourse.notesWeight!,
      syllabusFileName: this.newCourse.syllabusFileName,
      syllabusHash: '000' + Math.random().toString(36).slice(2)
    };

    this.courses.push(created);
    this.syllabusEntries.push({ id, type: 'Syllabus', course: created, hash: created.syllabusHash! });

    this.persistAll();
    // AJUSTE 3: Añadir panelClass
    this.snackBar.open(`Curso "${created.name}" añadido correctamente.`, 'OK', {
      duration: 3000,
      panelClass: ['high-z-snackbar']
    });
    this.dialog.closeAll();
  }

  onFileSelected(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    if (!inp.files?.length) return;
    this.newCourse.syllabusFile = inp.files[0];
    this.newCourse.syllabusFileName = inp.files[0].name;
  }

  addNoteWeight() {
    this.newCourse.notesWeight!.push(0);
  }

  removeNoteWeight(index: number) {
    this.newCourse.notesWeight!.splice(index, 1);
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  goToBlock(entryId: string) {
    console.log('Go to block', entryId);
    // AJUSTE 3: Añadir panelClass
    this.snackBar.open(`Navegando al bloque ${entryId}...`, 'OK', {
      duration: 2000,
      panelClass: ['high-z-snackbar']
    });
  }
}
