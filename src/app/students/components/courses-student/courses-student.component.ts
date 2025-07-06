/* src/app/students/components/courses-student/courses-student.component.ts */
import { Component, OnInit }     from '@angular/core';
import { ActivatedRoute }        from '@angular/router';
import { CommonModule }          from '@angular/common';
import { FormsModule }           from '@angular/forms';
import { MatSnackBar }           from '@angular/material/snack-bar';

/* Material */
import { MatCardModule }         from '@angular/material/card';
import { MatButtonModule }       from '@angular/material/button';
import { MatIconModule }         from '@angular/material/icon';
import { MatDividerModule }      from '@angular/material/divider';
import { MatExpansionModule }    from '@angular/material/expansion';

/* Servicio + modelos */
import { StudentService }        from '../../services/student.service';
import {
  Student, Course, Syllabus
}                                 from '../../model/student.entity';

@Component({
  selector   : 'app-courses-student',
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatExpansionModule
  ],
  templateUrl: './courses-student.component.html',
  styleUrls  : ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {

  /* ───────── datos del alumno ───────── */
  studentId = '';
  student!  : Student;

  courses  : Course[]   = [];
  syllabi  : Syllabus[] = [];

  selectedCourse : Course | null = null;

  /* cabeceras de notas (se rellenan al abrir el curso) */
  noteLabels: string[] = [];

  constructor(
    private route : ActivatedRoute,
    private stuSvc: StudentService,
    private snack : MatSnackBar
  ) {}

  /* ═══ ciclo de vida ═══ */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { console.error('[Student] sin ID en la URL'); return; }
    this.studentId = id;
    this.loadData();
  }

  /* carga inicial */
  private loadData(): void {
    this.stuSvc.getById(this.studentId).subscribe(st => {
      this.student  = st;
      this.courses  = st.courses ?? [];
      this.syllabi  = this.courses
        .map(c => (c as any).syllabus)
        .filter(Boolean) as Syllabus[];
    });
  }

  /* ─── navegación ─── */
  selectCourse(c: Course): void {
    const isAlreadySelected = this.selectedCourse?.id === c.id;

    if (isAlreadySelected) {
      this.selectedCourse = null;
      return; // Salimos de la función aquí.
    }

    this.selectedCourse = c;

    const len = c.notesWeight?.length ?? 4;          // p.e. 4

    const base = ['PC1', 'EA', 'PC2', 'EB'];         // hasta 4

    this.noteLabels =
      len <= base.length
        ? base.slice(0, len)                         // PC1-EA-…
        : [
          ...base,
          ...Array.from(
            { length: len - base.length },
            (_, i) => `N${i + base.length + 1}`  // N5, N6…
          )
        ];
  }

  goBack() { this.selectedCourse = null; }

  /* ─── mostrador de PDF ─── */
  private openBase64Pdf(dataUri: string, title = 'syllabus.pdf') {
    const base64 = dataUri.split(',')[1];
    const bytes  = Uint8Array.from(atob(base64), ch => ch.charCodeAt(0));
    const blob   = new Blob([bytes], { type: 'application/pdf' });
    const url    = URL.createObjectURL(blob);
    const win    = window.open(url, '_blank');
    if (!win) {
      this.snack.open('Pop-up bloqueado por el navegador', 'Cerrar', { duration: 4000 });
    }
    win?.addEventListener('beforeunload', () => URL.revokeObjectURL(url));
  }
  private encode(f: string) { return encodeURIComponent(f); }

  viewSyllabus(c: Course): void {
    const syl = this.syllabi.find(s => s.idCourse === c.id);
    if (!syl) {
      this.snack.open('Curso sin sílabo', 'Cerrar', { duration: 2500 });
      return;
    }
    if (syl.fileData?.startsWith('data:application/pdf')) {
      this.openBase64Pdf(syl.fileData, syl.fileName || 'syllabus.pdf');
      return;
    }
    if (syl.fileName) {
      window.open(`/assets/${this.encode(syl.fileName)}`, '_blank');
      return;
    }
    this.snack.open('No se encontró el PDF', 'Cerrar', { duration: 2500 });
  }



  formatWeights(arr?: number[]): string {
    return arr?.length ? arr.map(w => `${w}%`).join(' / ') : '';
  }

}
