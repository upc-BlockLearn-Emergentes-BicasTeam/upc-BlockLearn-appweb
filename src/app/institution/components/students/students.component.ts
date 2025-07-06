import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import {
  InstitutionService
} from '../../services/institution.service';
import {
  Student, Course, Enrollment
} from '../../models/institution.entity';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatExpansionModule, MatListModule, MatFormFieldModule,
    MatInputModule, MatCheckboxModule, MatDialogModule,
    MatSelectModule, MatMenuModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  /* ── templates ────────────────────────────── */
  @ViewChild('addStudentTpl') addStudentTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;
  // NUEVO: Referencia de template para el diálogo de "Ver Cursos"
  @ViewChild('viewCoursesTpl') viewCoursesTpl!: TemplateRef<any>;

  /* ── datos base ───────────────────────────── */
  readonly institutionId = localStorage.getItem('institutionId') ?? '1';

  students: Student[] = [];
  filteredStudents: Student[] = [];
  availableCourses: Course[] = [];
  coursesByStudent: Record<string, Course[]> = {};

  /** Set temporal usado en el diálogo de asignación */
  assignedCourses = new Set<string>();

  selectedStudent: Student | null = null;
  newStudent: Partial<Student & { password: string }> = {};

  // NUEVO: Array para almacenar los cursos del estudiante seleccionado para mostrarlos en el diálogo
  coursesForViewing: Course[] = [];

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWQxZGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMjQgMTAuM2ExMCAxMCAwIDAgMCAxMC4zLTEwLjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTE4LjM3IDE4LjgzYTYgNiAwIDAgMC0xMi4zNCAwIi8+PC9zdmc+';

  constructor(
    private instSvc: InstitutionService,
    private dialog: MatDialog
  ) {}

  /* ═════════════ ciclo de vida ═════════════ */
  ngOnInit(): void { this.initialLoad(); }

  private initialLoad(): void {
    forkJoin({
      students: this.instSvc.getStudentsByInstitution(this.institutionId),
      courses: this.instSvc.getCoursesByInstitution(this.institutionId),
      enroll: this.instSvc.getEnrollments()
    }).subscribe(({ students, courses, enroll }) => {
      this.students = students;
      this.filteredStudents = students;
      this.availableCourses = courses;

      this.coursesByStudent = {};
      enroll
        .filter(e => students.some(s => s.id === e.idStudent))
        .forEach(e => {
          const c = courses.find(x => x.id === e.idCourse);
          if (c) {
            (this.coursesByStudent[e.idStudent] ??= []).push(c);
          }
        });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!filterValue) {
      this.filteredStudents = [...this.students];
      return;
    }
    this.filteredStudents = this.students.filter(student => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      return fullName.includes(filterValue) || student.email.toLowerCase().includes(filterValue);
    });
  }

  // NUEVO: Método para abrir el diálogo de visualización de cursos
  openViewCourses(student: Student): void {
    this.selectedStudent = student; // Para usar el nombre en el título del diálogo
    this.coursesForViewing = this.coursesByStudent[student.id] || [];
    this.dialog.open(this.viewCoursesTpl, { width: '450px' });
  }

  /* ═════════════ Lógica de negocio (sin cambios) ═════════════ */
  openAddStudent(): void {
    this.newStudent = {};
    this.dialog.open(this.addStudentTpl, { width: '420px' });
  }

  async saveNewStudent(): Promise<void> {
    try {
      const user = await this.instSvc.createUser({
        email: this.newStudent.email!,
        password: this.newStudent.password!,
        role: 'student'
      }).toPromise();

      await this.instSvc.createStudent({
        idUser: String(user!.id),
        idInstitution: this.institutionId,
        firstName: this.newStudent.firstName!,
        lastName: this.newStudent.lastName!,
        email: this.newStudent.email!,
        phone: this.newStudent.phone
      }).toPromise();

      this.initialLoad();
      this.dialog.closeAll();
    } catch (err) {
      console.error('Error creando estudiante', err);
    }
  }

  openAssign(stu: Student): void {
    this.selectedStudent = stu;
    this.assignedCourses = new Set(
      (this.coursesByStudent[stu.id] ?? []).map(c => c.id)
    );
    this.dialog.open(this.assignCoursesTpl, { width: '440px' });
  }

  toggleCourse(c: Course): void {
    this.assignedCourses.has(c.id)
      ? this.assignedCourses.delete(c.id)
      : this.assignedCourses.add(c.id);
  }

  async saveAssigned(): Promise<void> {
    if (!this.selectedStudent) { return; }

    const prev: Enrollment[] =
      await this.instSvc.getEnrollmentsByStudent(this.selectedStudent.id).toPromise() ?? [];

    await Promise.all(prev
      .filter(e => e.id)
      .map(e => this.instSvc.deleteEnrollment(e.id!).toPromise()));

    await Promise.all(
      [...this.assignedCourses].map(idCourse =>
        this.instSvc.createEnrollment({
          idCourse,
          idStudent: this.selectedStudent!.id,
          state: 'in_progress',
          average: 0
        }).toPromise()
      )
    );

    this.dialog.closeAll();
    this.initialLoad();
  }

  async deleteStudent(stu: Student): Promise<void> {
    try {
      const user = await this.instSvc.getUserByEmail(stu.email).toPromise();
      if (user) { await this.instSvc.deleteUser(user.id).toPromise(); }

      await this.instSvc.deleteStudent(stu.id).toPromise();
      this.initialLoad();
    } catch (err) {
      console.error('Error eliminando estudiante', err);
    }
  }
}
