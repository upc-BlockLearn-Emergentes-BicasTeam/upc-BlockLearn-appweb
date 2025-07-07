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
import { MatMenuModule } from '@angular/material/menu';

// Servicios y Modelos
import { InstitutionService } from '../../services/institution.service';
// AHORA USAMOS LOS NUEVOS MODELOS (con IDs numéricos)
import { Teacher, Course, UserPayload } from '../../models/institution.entity';

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
  // CAMBIO: institutionId ahora es un número.
  readonly institutionId = Number(localStorage.getItem('institutionId'));

  @ViewChild('addTeacherTpl') addTeacherTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;
  @ViewChild('deleteConfirmTpl') deleteConfirmTpl!: TemplateRef<any>;
  @ViewChild('viewCoursesTpl') viewCoursesTpl!: TemplateRef<any>;

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  availableCourses: Course[] = [];
  // CAMBIO: El Set ahora almacena números (IDs de curso)
  assignedCourses = new Set<number>();
  selectedTeacher: Teacher | null = null;
  // CAMBIO: Definimos explícitamente las propiedades para el formulario de nuevo profesor
  newTeacherData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: ''
  };
  newUserData = {
    email: '',
    password: '',
    role: 'teacher' as 'teacher' // Aseguramos el tipo literal
  };

  coursesForViewing: Course[] = [];

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWQxZGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMjQgMTAuM2ExMCAxMCAwIDAgMCAxMC4zLTEwLjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTE4LjM3IDE4LjgzYTYgNiAwIDAgMC0xMi43NCAwIi8+PC9zdmc+';

  constructor(
    private dialog: MatDialog,
    private instSvc: InstitutionService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (!this.institutionId) {
      console.error("Institution ID not found in localStorage.");
      this.snack.open("No se pudo cargar la información de la institución.", "Cerrar");
      return;
    }
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
    // ... (sin cambios en esta lógica)
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

  // CAMBIO: teacherId ahora es un número
  getCoursesForTeacher(teacherId: number): Course[] {
    return this.availableCourses.filter(c => c.teacherId === teacherId);
  }

  openViewCourses(teacher: Teacher): void {
    this.selectedTeacher = teacher;
    this.coursesForViewing = this.getCoursesForTeacher(teacher.id);
    this.dialog.open(this.viewCoursesTpl, { width: '450px' });
  }

  openAddTeacher() {
    // Reseteamos los objetos de datos
    this.newTeacherData = { firstName: '', lastName: '', email: '', phone: '', avatarUrl: '' };
    this.newUserData = { email: '', password: '', role: 'teacher' };
    this.dialog.open(this.addTeacherTpl, { width: '500px', disableClose: true });
  }

  saveNewTeacher() {
    // Sincronizamos el email
    this.newUserData.email = this.newTeacherData.email;

    // CAMBIO: Usamos la nueva firma del método del servicio
    this.instSvc.createTeacher(this.newUserData, { ...this.newTeacherData, institutionId: this.institutionId }).subscribe({
      next: () => {
        this.snack.open('Docente creado con éxito', 'OK', { duration: 3000 });
        this.loadTeachers();
        this.dialog.closeAll();
      },
      error: (err) => {
        console.error('Error al crear docente', err);
        this.snack.open(err.message || 'Error al crear el docente. Verifique los datos.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  openAssign(t: Teacher) {
    this.selectedTeacher = t;
    this.assignedCourses = new Set(this.getCoursesForTeacher(t.id).map(c => c.id));
    this.dialog.open(this.assignCoursesTpl, { width: '400px', disableClose: true });
  }

  saveAssigned(selectedOptions: MatListOption[]) {
    if (!this.selectedTeacher) return;
    const selectedCourseIds = new Set(selectedOptions.map(opt => opt.value));

    // Recorremos todos los cursos disponibles en la institución
    this.availableCourses.forEach(course => {
      const shouldBeAssigned = selectedCourseIds.has(course.id);

      // Si el curso debe ser asignado a este profesor y actualmente no lo está
      if (shouldBeAssigned && course.teacherId !== this.selectedTeacher!.id) {
        // CAMBIO: Usamos la nueva firma del método updateCourse
        this.instSvc.updateCourse(course.id, { teacherId: this.selectedTeacher!.id }).subscribe({
          next: () => console.log(`Course ${course.id} assigned to teacher ${this.selectedTeacher!.id}`),
          error: err => console.error(`Failed to assign course ${course.id}`, err)
        });
      }
    });

    // Pequeño delay para dar tiempo a que las peticiones se completen antes de recargar
    setTimeout(() => {
      this.snack.open('Asignación de cursos guardada', 'OK', { duration: 3000 });
      this.loadCourses(); // Recargamos para ver los cambios
      this.dialog.closeAll();
    }, 500);
  }

  // CAMBIO: teacherId ahora es un número
  deleteTeacher(teacherId: number): void {
    const dialogRef = this.dialog.open(this.deleteConfirmTpl, { width: '400px' });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        // CAMBIO: Usamos la nueva firma del método del servicio
        this.instSvc.deleteTeacher(teacherId).subscribe({
          next: () => {
            this.teachers = this.teachers.filter(t => t.id !== teacherId);
            this.filteredTeachers = this.filteredTeachers.filter(t => t.id !== teacherId);
            this.snack.open('Docente eliminado correctamente', 'OK', { duration: 3000 });
          },
          error: (err) => {
            console.error('Error al eliminar docente', err);
            this.snack.open(err.message || 'Error al eliminar el docente.', 'Cerrar', { duration: 4000 });
          }
        });
      }
    });
  }
}
