/* src/app/institution/pages/courses/courses.component.ts */
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule }   from '@angular/forms';

/* ── Angular Material ────────────────────────────────────────── */
import { MatCardModule }      from '@angular/material/card';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule }      from '@angular/material/list';
import { MatDividerModule }   from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatDialog, MatDialogModule }  from '@angular/material/dialog';
import { MatSelectModule }    from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule }   from '@angular/material/tooltip';

/* ── Servicios + Modelos ─────────────────────────────────────── */
import { InstitutionService } from '../../services/institution.service';
import {
  Course, Teacher, Student, Syllabus
} from '../../models/institution.entity';

@Component({
  selector   : 'app-courses',
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatExpansionModule, MatListModule, MatDividerModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSelectModule, MatSnackBarModule, MatTooltipModule
  ],
  templateUrl: './courses.component.html',
  styleUrls  : ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  /* ───────── datos base ───────── */
  readonly institutionId = localStorage.getItem('institutionId') ?? '1';

  @ViewChild('courseFormTpl') courseFormTpl!: TemplateRef<any>;

  courses     : Course[]                         = [];
  teachers    : Teacher[]                        = [];
  syllabuses  : Syllabus[]                       = [];
  studentsMap : Record<string,Student[]>         = {};
  syllabusMap : Record<string,string>            = {};

  /* modelo único (crear / editar) */
  formCourse: {
    id?: string;
    name?: string;
    code?: string;
    section?: string;
    passingGrade?: number;
    notesWeight: number[];
    teacher?: Teacher;
    syllabusFile?: File;        // archivo crudo (opcional)
    syllabusFileName?: string;  // nombre “humano”
    syllabusData?: string;      // base-64 (Data URI)
  } = { notesWeight: [] };

  isEditing = false;


  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;


  constructor(

    private instSvc : InstitutionService,
    private dialog  : MatDialog,
    private snack   : MatSnackBar
  ) {}

  /* ───────── life-cycle ───────── */
  ngOnInit(): void {
    this.loadCourses();
    this.loadTeachers();
    this.loadEnrollments();
    this.loadSyllabuses();
  }

  /* ───────── cargas ───────── */
  private loadCourses() {
    this.instSvc.getCoursesByInstitution(this.institutionId)
      .subscribe(c => this.courses = c);
  }
  private loadTeachers() {
    this.instSvc.getTeachersByInstitution(this.institutionId)
      .subscribe(t => this.teachers = t);
  }
  private loadEnrollments() {
    this.instSvc.getEnrollments().subscribe(enrs => {
      this.instSvc.getStudentsByInstitution(this.institutionId)
        .subscribe(sts => {
          this.studentsMap = {};
          enrs.forEach(e => {
            const st = sts.find(s => s.id === e.idStudent);
            if (st) { (this.studentsMap[e.idCourse] ??= []).push(st); }
          });
        });
    });
  }
  private loadSyllabuses() {
    this.instSvc.getSyllabuses().subscribe(syl => {
      this.syllabuses  = syl;
      this.syllabusMap = {};
      syl.forEach(s => this.syllabusMap[s.idCourse] = s.hash);
    });
  }

  /* ───────── helpers de vista ───────── */
  getStudentsForCourse(id: string) { return this.studentsMap[id] ?? []; }
  getSyllabusHash(id:string)       { return this.syllabusMap[id] ?? 'Sin registro'; }
  getTeacherFullName(id:string)    {
    const t = this.teachers.find(x => x.id === id);
    return t ? `${t.firstName} ${t.lastName}` : 'No asignado';
  }

  deleteCourse(courseId: string): void {
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, {
      width: '400px',
      disableClose: true // Evita que se cierre haciendo clic fuera
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {

        this.instSvc.deleteCourse(courseId).subscribe({
          next: () => {
            console.log(`Curso con ID: ${courseId} eliminado de la base de datos.`);
            this.courses = this.courses.filter(course => course.id !== courseId);
            this.snack.open('Curso eliminado correctamente.', 'OK', {
              duration: 3000,
              panelClass: 'success-snackbar'
            });
          },
          error: (err) => {
            console.error(`Error al intentar eliminar el curso ${courseId}:`, err);
            this.snack.open('Error al eliminar el curso. Por favor, inténtelo de nuevo.', 'Cerrar', {
              duration: 4000,
              panelClass: 'error-snackbar'
            });
          }
        });
      }
    });
  }

  /* ═════════ diálogo alta / edición ═════════ */
  openAddCourse() {
    this.isEditing  = false;
    this.formCourse = { notesWeight:[25,25,25,25] };
    this.dialog.open(this.courseFormTpl,{width:'560px',disableClose:true});
  }
  openEditCourse(c:Course) {
    this.isEditing  = true;
    this.formCourse = {
      id:c.id, name:c.name, code:c.code, section:c.section,
      passingGrade:c.passingGrade,
      notesWeight:[...(c.notesWeight ?? [])],
      teacher:this.teachers.find(t=>t.id===c.idTeacher),
      syllabusFileName:c.syllabusFileName
    };
    this.dialog.open(this.courseFormTpl,{width:'560px',disableClose:true});
  }

  /* ───────── guardar ───────── */
  async saveCourse() {
    const f = this.formCourse;
    if (!f.name || !f.teacher) {
      this.snack.open('Complete los campos obligatorios','Cerrar',{duration:2500});
      return;
    }

    /* ① Si hay PDF nuevo → ya tenemos `f.syllabusData` listo      */

    /* ② payload común */
    const data: Omit<Course,'id'> = {
      name         : f.name,
      code         : f.code || Math.random().toString(36).slice(2,6).toUpperCase(),
      section      : f.section || 'A',
      passingGrade : f.passingGrade || 70,
      idInstitution: this.institutionId,
      idTeacher    : f.teacher.id,
      notesWeight  : f.notesWeight,
      syllabusFileName: f.syllabusFileName ?? '',
      syllabusHash    : ''
    };

    try {
      if (this.isEditing && f.id) {
        /* ——— actualización ——— */
        await this.instSvc.updateCourse(f.id,data).toPromise();

        if (f.syllabusData) {
          await this.instSvc.uploadSyllabusBase64({
            idCourse : f.id,
            fileName : f.syllabusFileName!,
            fileData : f.syllabusData,
            hash     : '000'+Math.random().toString(36).substr(2,8)
          }).toPromise();
        }

        this.snack.open('Curso actualizado','OK',{duration:2500});

      } else {
        /* ——— alta ——— */
        const created = await this.instSvc.createCourse(data).toPromise();
        if (!created?.id) { throw new Error('API no devolvió id'); }

        if (f.syllabusData) {
          await this.instSvc.uploadSyllabusBase64({
            idCourse : created.id,
            fileName : f.syllabusFileName!,
            fileData : f.syllabusData,
            hash     : '000'+Math.random().toString(36).substr(2,8)
          }).toPromise();
        }

        this.snack.open('Curso creado','OK',{duration:2500});
      }

      this.dialog.closeAll();
      this.ngOnInit();

    } catch(err) {
      console.error(err);
      this.snack.open('Error al guardar','Cerrar',{duration:3000});
    }
  }

  /* ───────── selección de archivo ───────── */
  onFileSelected(e:Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) { return; }

    this.formCourse.syllabusFileName = file.name;

    const fr = new FileReader();
    fr.onload = () => {
      this.formCourse.syllabusData = fr.result as string; // data:application/pdf;base64,…
    };
    fr.readAsDataURL(file);
  }


  private openBase64Pdf(dataUri: string, title = 'syllabus.pdf') {
    /* 1. separa la cabecera “data:application/pdf;base64,”  */
    const base64 = dataUri.split(',')[1];

    /* 2. decodifica → Uint8Array */
    const byteChars  = atob(base64);
    const byteNumbers = Array.from(byteChars, c => c.charCodeAt(0));
    const byteArray   = new Uint8Array(byteNumbers);

    /* 3. crea el blob + URL temporal */
    const blob     = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl  = URL.createObjectURL(blob);

    /* 4. abre en nueva pestaña  */
    const w = window.open(blobUrl, '_blank');
    if (!w) {
      this.snack.open('Bloqueado por el navegador: permita pop-ups', 'Cerrar',
        { duration: 4000 });
    }

    /* 5. opcional: libera memoria cuando la pestaña se cierre */
    w?.addEventListener('beforeunload', () => URL.revokeObjectURL(blobUrl));
  }

  /* ───────── ver PDF ───────── */
  viewSyllabus(c: Course) {
    const syl = this.syllabuses.find(s => s.idCourse === c.id);
    if (!syl) {
      this.snack.open('Curso sin sílabo', 'Cerrar', { duration: 2500 });
      return;
    }

    /* a) si hay base-64 en BD ⇒ úsalo */
    if (syl.fileData?.startsWith('data:application/pdf')) {
      this.openBase64Pdf(syl.fileData, syl.fileName || 'syllabus.pdf');
      return;
    }

    /* b) fallback: intente en /assets (o URL pública) */
    if (syl.fileName) {
      window.open(`/assets/${encodeURIComponent(syl.fileName)}`, '_blank');
      return;
    }

    this.snack.open('No se encontró el PDF', 'Cerrar', { duration: 2500 });
  }

  getFormulaString(weights: number[] | undefined): string {
    if (!weights || weights.length === 0) {
      return 'Sin definir';
    }
    const labels = ['PC1', 'EA', 'PC2', 'EB'];
    return weights
      .map((w, i) => `${w}% (${labels[i] || 'N' + (i + 1)})`)
      .join(' + ');
  }


  /* ───────── utilidades ───────── */
  addNoteWeight()            { this.formCourse.notesWeight.push(0); }
  removeNoteWeight(i:number) { this.formCourse.notesWeight.splice(i,1); }
  trackById(_:number,c:Course){ return c.id; }
}
