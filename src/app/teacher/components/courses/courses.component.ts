/* src/app/teacher/components/courses/courses.component.ts */
import { Component, OnInit }   from '@angular/core';
import { ActivatedRoute }      from '@angular/router';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';
import { forkJoin }            from 'rxjs';

/* ── Material ─────────────────────────────────────── */
import { MatCardModule }       from '@angular/material/card';
import { MatButtonModule }     from '@angular/material/button';
import { MatIconModule }       from '@angular/material/icon';
import { MatDividerModule }    from '@angular/material/divider';
import { MatExpansionModule }  from '@angular/material/expansion';
import { MatFormFieldModule }  from '@angular/material/form-field';
import { MatSelectModule }     from '@angular/material/select';
import { MatOptionModule }     from '@angular/material/core';
import { MatInputModule }      from '@angular/material/input';

/* ── Servicios y modelos ─────────────────────────── */
import { TeacherService }      from '../../services/teacher.service';
import {
  Course, Student, BlockchainEntry, Syllabus
} from '../../models/teacher.entity';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector   : 'app-courses',
  standalone : true,
  imports    : [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule,
    MatDividerModule, MatExpansionModule,
    MatFormFieldModule, MatSelectModule, MatOptionModule,
    MatInputModule
  ],
  templateUrl: './courses.component.html',
  styleUrls  : ['./courses.component.css']
})
export class CoursesComponent implements OnInit {

  /* ───────────────────────── datos ───────────────────────── */
  teacherId = '';
  courses   : Course[] = [];

  /** alumnos agrupados por curso              */
  studentsByCourse: Record<string, Student[]> = {};
  syllabuses: Syllabus[] = [];            // ⬅️ almacena sílabos


  selectedCourse : Course | null = null;
  syllabusEntries: BlockchainEntry[] = [];
  expanded: Record<string, boolean> = {};

  /* ─────────  evaluaciones simples  ───────── */
  showCreateEval  = false;
  newEvalQuestion = '';
  evalQuestions: string[] = [];

  /* ─────────  helpers para notas  ───────── */
  readonly noteOptions: (number | string)[] = [
    ...Array.from({ length: 20 }, (_, i) => i + 1), // números 1-20
    'NT', '--'
  ];
  readonly noteLabels  = ['PC1', 'EA', 'PC2', 'EB'];

  constructor(
    private route : ActivatedRoute,
    private tSvc  : TeacherService,
    private snack : MatSnackBar           // ⬅️ NO más HttpClient

  ) {}

  /* ═════════════════ ciclo de vida ═════════════════ */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { console.error('No ID en la URL'); return; }
    this.teacherId = id;
    this.initialLoad();
  }

  /** Carga cursos, alumnos y matrículas en paralelo */
  private initialLoad(): void {
    forkJoin({
      teacher : this.tSvc.getById(this.teacherId),
      allStu  : this.tSvc.getAllStudents(),
      enroll  : this.tSvc.getAllEnrollments(),
      syls    : this.tSvc.getAllSyllabuses()       // ⬅️ nuevo

    }).subscribe(({ teacher, allStu, enroll, syls }) => {

      this.courses = teacher.courses ?? [];
      this.syllabuses = syls;                      // ⬅️ guardar


      /* construye el mapa curso → alumnos */
      this.studentsByCourse = {};
      enroll
        .filter(e => this.courses.some(c => c.id === e.idCourse))
        .forEach(e => {
          const stu = allStu.find(s => s.id === e.idStudent);
          if (!stu) { return; }

          /* ⚠️  asegura que cada alumno tenga arreglo de notas */
          if (!Array.isArray(stu.notes) || !stu.notes.length) {
            stu.notes = [0, 0, 0, 0];
            stu.average = 0;
          }

          /* agrupa */
          (this.studentsByCourse[e.idCourse] ??= []).push(stu);
        });
    });
  }

  /* ═════════════════ acciones UI ═════════════════ */
  selectCourse(c: Course): void {
    this.selectedCourse  = c;
    this.syllabusEntries = (c.blockchainEntries ?? [])
      .filter(e => e.type === 'Syllabus');
    this.evalQuestions   = [];
    this.showCreateEval  = false;
  }

  goBack(): void {
    this.selectedCourse = null;
    this.expanded       = {};
  }

  toggleExpand(id: string) {
    this.expanded[id] = !this.expanded[id];
  }

  /* ──────────────── actualización de notas ─────────────── */
  updateNote(stu: Student, idx: number, val: number | string): void {

    /* 1️⃣ normaliza valor                                                   */
    const num = (val === 'NT' || val === '--') ? 0 : Number(val);

    /* 2️⃣ actualiza modelo local                                            */
    stu.notes[idx] = num;
    stu.average = +(stu.notes.reduce((a, b) => a + b, 0) / stu.notes.length).toFixed(1);

    /* 3️⃣ persiste en JSON-Server                                           */
    this.tSvc
      .updateStudentNotes(stu.id, stu.notes, stu.average)
      .subscribe({
        next : () => console.log('✅ Notas de', stu.firstName, 'actualizadas'),
        error: err  => console.error('Error guardando notas', err)
      });
  }

  /* ─────────────── Evaluaciones demo ─────────────── */
  toggleEvalForm() { this.showCreateEval = !this.showCreateEval; }

  addEvalQuestion() {
    const q = this.newEvalQuestion.trim();
    if (q) {
      this.evalQuestions.push(q);
      this.newEvalQuestion = '';
    }
  }

  /* ─────────────── auxiliares varias ─────────────── */
  downloadSyllabus() {
    if (!this.selectedCourse?.syllabusFileName) { return; }
    window.open(`/assets/${this.selectedCourse.syllabusFileName}`, '_blank');
  }

  goToBlock(id: string) { console.log('block-id', id); }

  /* ═════════════  ▼  NUEVO  ▼  ═════════════ */

  /** Abre un PDF codificado en base-64 en pestaña aparte */
  private openBase64Pdf(dataUri:string,title='syllabus.pdf'){
    const base64 = dataUri.split(',')[1];
    const bytes  = Uint8Array.from(atob(base64), c=>c.charCodeAt(0));
    const blob   = new Blob([bytes],{type:'application/pdf'});
    const url    = URL.createObjectURL(blob);
    const w = window.open(url,'_blank');
    if(!w){
      this.snack.open('Bloqueado por el navegador: permita pop-ups',
        'Cerrar',{duration:4000});
    }
    w?.addEventListener('beforeunload',()=>URL.revokeObjectURL(url));
  }

  /** Devuelve nombre codificado para URL local */
  private encodeFile(f:string){ return encodeURIComponent(f); }

  /** Muestra el PDF del sílabo (base-64 o /assets/…) */
  viewSyllabus(c:Course){
    const syl = this.syllabuses.find(s=>s.idCourse===c.id);
    if(!syl){
      this.snack.open('Curso sin sílabo','Cerrar',{duration:2500});
      return;
    }

    /* (a) base-64 guardado en BD */
    if(syl.fileData?.startsWith('data:application/pdf')){
      this.openBase64Pdf(syl.fileData, syl.fileName||'syllabus.pdf');
      return;
    }

    /* (b) Fallback -> carpeta assets */
    if(syl.fileName){
      window.open(`/assets/${this.encodeFile(syl.fileName)}`,'_blank');
      return;
    }

    this.snack.open('No se encontró el PDF','Cerrar',{duration:2500});
  }

}
