import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule, MatListOption } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu'; // Importación unificada para el menú

// Servicios y Modelos
import { InstitutionService } from '../../services/institution.service';
import { Teacher, Course } from '../../models/institution.entity';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSelectModule, MatTooltipModule, MatSnackBarModule, MatMenuModule
  ],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  readonly institutionId = localStorage.getItem('institutionId') ?? '1';

  @ViewChild('addTeacherTpl') addTeacherTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;
  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;
  // NUEVO: Referencia de template para el diálogo de visualización de cursos
  @ViewChild('viewCoursesTpl') viewCoursesTpl!: TemplateRef<any>;

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  availableCourses: Course[] = [];
  assignedCourses = new Set<string>();
  selectedTeacher: Teacher | null = null;
  newTeacher: Partial<Teacher & { password: string }> = {};

  // NUEVO: Array para almacenar los cursos del docente seleccionado para mostrarlos en el diálogo
  coursesForViewing: Course[] = [];

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWQxZGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMjQgMTAuM2ExMCAxMCAwIDAgMCAxMC4zLTEwLjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTE4LjM3IDE4LjgzYTYgNiAwIDAgMC0xMi43NCAwIi8+PC9zdmc+';

  constructor(
    private dialog: MatDialog,
    private instSvc: InstitutionService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadCourses();
  }

  loadTeachers() {
    this.instSvc.getTeachersByInstitution(this.institutionId)
      .subscribe(data => {
        this.teachers = data;
        this.filteredTeachers = data;
      });
  }

  loadCourses() {
    this.instSvc.getCoursesByInstitution(this.institutionId)
      .subscribe(data => this.availableCourses = data);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    if (!filterValue) {
      this.filteredTeachers = [...this.teachers];
      return;
    }
    this.filteredTeachers = this.teachers.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      return fullName.includes(filterValue) || teacher.email.toLowerCase().includes(filterValue);
    });
  }

  getCoursesForTeacher(teacherId: string): Course[] {
    // Esta función existente es perfecta para lo que necesitamos
    return this.availableCourses.filter(c => c.idTeacher === teacherId);
  }

  // NUEVO: Método para abrir el diálogo que muestra los cursos asignados a un docente
  openViewCourses(teacher: Teacher): void {
    this.selectedTeacher = teacher; // Guardamos para usar su nombre en el título
    this.coursesForViewing = this.getCoursesForTeacher(teacher.id); // Llenamos el array con sus cursos
    this.dialog.open(this.viewCoursesTpl, { width: '450px' }); // Abrimos el diálogo
  }

  /* ═════════════ Lógica de negocio (sin cambios) ═════════════ */
  openAddTeacher() {
    this.newTeacher = {};
    this.dialog.open(this.addTeacherTpl, { width: '500px', disableClose: true });
  }

  async saveNewTeacher() {
    try {
      const user = await this.instSvc.createUser({
        email: this.newTeacher.email!,
        password: this.newTeacher.password!,
        role: 'teacher'
      }).toPromise();

      if (!user?.id) { throw new Error('La creación del usuario falló o no devolvió un ID.'); }

      await this.instSvc.createTeacher({
        idUser: user.id,
        idInstitution: this.institutionId,
        firstName: this.newTeacher.firstName!,
        lastName: this.newTeacher.lastName!,
        email: this.newTeacher.email!,
        phone: this.newTeacher.phone
      }).toPromise();

      this.snack.open('Docente creado con éxito', 'OK', { duration: 3000 });
      this.loadTeachers();
      this.dialog.closeAll();
    } catch (err) {
      console.error('Error al crear docente', err);
      this.snack.open('Error al crear el docente. Verifique que el email no esté en uso.', 'Cerrar', { duration: 5000 });
    }
  }

  openAssign(t: Teacher) {
    this.selectedTeacher = t;
    this.assignedCourses = new Set(this.getCoursesForTeacher(t.id).map(c => c.id));
    this.dialog.open(this.assignCoursesTpl, { width: '400px', disableClose: true });
  }

  async saveAssigned(selectedOptions: MatListOption[]) {
    if (!this.selectedTeacher) return;
    const selectedCourseIds = new Set(selectedOptions.map(opt => opt.value));
    for (const course of this.availableCourses) {
      const isCurrentlyAssigned = course.idTeacher === this.selectedTeacher.id;
      const shouldBeAssigned = selectedCourseIds.has(course.id);
      if (!isCurrentlyAssigned && shouldBeAssigned) {
        await this.instSvc.updateCourse(course.id, { idTeacher: this.selectedTeacher.id }).toPromise();
      }
    }
    this.snack.open('Asignación de cursos guardada', 'OK', { duration: 3000 });
    this.loadCourses();
    this.dialog.closeAll();
  }

  deleteTeacher(teacherId: string): void {
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, { width: '400px' });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.instSvc.deleteTeacher(teacherId).subscribe({
          next: () => {
            this.teachers = this.teachers.filter(t => t.id !== teacherId);
            this.filteredTeachers = this.filteredTeachers.filter(t => t.id !== teacherId);
            this.snack.open('Docente eliminado correctamente', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al eliminar docente', err);
            this.snack.open('Error al eliminar el docente', 'Cerrar', { duration: 4000 });
          }
        });
      }
    });
  }
}
