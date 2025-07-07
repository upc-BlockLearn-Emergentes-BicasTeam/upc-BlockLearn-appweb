import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {forkJoin, Observable} from 'rxjs';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatListModule, MatListOption} from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

// Servicios y Modelos
import { InstitutionService } from '../../services/institution.service';
// CAMBIO: Usamos los nuevos modelos con IDs numéricos
import { Student, Course, Enrollment, UserPayload } from '../../models/institution.entity';

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

  @ViewChild('addStudentTpl') addStudentTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;
  @ViewChild('viewCoursesTpl') viewCoursesTpl!: TemplateRef<any>;

  // CAMBIO: institutionId ahora es un número.
  readonly institutionId = Number(localStorage.getItem('institutionId'));

  students: Student[] = [];
  filteredStudents: Student[] = [];
  availableCourses: Course[] = [];
  // CAMBIO: El Record ahora usa `number` como clave.
  coursesByStudent: Record<number, Course[]> = {};

  /** Set temporal usado en el diálogo de asignación, ahora con IDs numéricos */
  assignedCourses = new Set<number>();

  selectedStudent: Student | null = null;
  // CAMBIO: Objetos separados y tipados para el formulario de nuevo estudiante
  newStudentData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: ''
  };
  newUserData: UserPayload = {
    email: '',
    password: '',
    role: 'student'
  };

  coursesForViewing: Course[] = [];

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWQxZGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMjQgMTAuM2ExMCAxMCAwIDAgMCAxMC4zLTEwLjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTE4LjM3IDE4LjgzYTYgNiAwIDAgMC0xMi4zNCAwIi8+PC9zdmc+';

  constructor(
    private instSvc: InstitutionService,
    private dialog: MatDialog,
    private snack: MatSnackBar // Añadido para notificaciones
  ) {}

  ngOnInit(): void {
    if (!this.institutionId) {
      console.error("Institution ID not found in localStorage.");
      this.snack.open("No se pudo cargar la información de la institución.", "Cerrar");
      return;
    }
    this.initialLoad();
  }

  private initialLoad(): void {
    // CAMBIO: La lógica de carga se simplifica. Primero obtenemos estudiantes y cursos.
    // Los enrollments se obtendrán bajo demanda si es necesario, o al abrir el diálogo de asignación.
    forkJoin({
      students: this.instSvc.getStudentsByInstitution(this.institutionId),
      courses: this.instSvc.getCoursesByInstitution(this.institutionId),
    }).subscribe(({ students, courses }) => {
      this.students = students;
      this.filteredStudents = students;
      this.availableCourses = courses;

      // La carga de cursos por estudiante se puede hacer al abrir el diálogo para optimizar
      this.students.forEach(student => {
        this.loadCoursesForStudent(student);
      });
    });
  }

  // Función para cargar los cursos de un estudiante específico
  private loadCoursesForStudent(student: Student) {
    this.instSvc.getEnrollmentsByStudent(student.id).subscribe(enrollments => {
      const courseIds = new Set(enrollments.map(e => e.courseId));
      this.coursesByStudent[student.id] = this.availableCourses.filter(c => courseIds.has(c.id));
    });
  }

  applyFilter(event: Event) {
    // ... (sin cambios en esta lógica)
  }

  openViewCourses(student: Student): void {
    this.selectedStudent = student;
    this.coursesForViewing = this.coursesByStudent[student.id] || [];
    this.dialog.open(this.viewCoursesTpl, { width: '450px' });
  }

  openAddStudent(): void {
    // Reseteamos los datos
    this.newStudentData = { firstName: '', lastName: '', email: '', phone: '', avatarUrl: '' };
    this.newUserData = { email: '', password: '', role: 'student' };
    this.dialog.open(this.addStudentTpl, { width: '420px' });
  }

  saveNewStudent(): void {
    // Sincronizamos el email
    this.newUserData.email = this.newStudentData.email;

    // CAMBIO: Usamos la nueva firma del servicio
    this.instSvc.createStudent(this.newUserData, { ...this.newStudentData, institutionId: this.institutionId }).subscribe({
      next: () => {
        this.snack.open('Estudiante creado con éxito', 'OK', { duration: 3000 });
        this.initialLoad(); // Recargamos toda la data
        this.dialog.closeAll();
      },
      error: (err) => {
        console.error('Error creando estudiante', err);
        this.snack.open(err.message || 'Error al crear el estudiante.', 'Cerrar', { duration: 5000 });
      }
    });
  }

  openAssign(stu: Student): void {
    this.selectedStudent = stu;
    // Cargamos las matrículas actuales del estudiante para preseleccionar cursos
    this.instSvc.getEnrollmentsByStudent(stu.id).subscribe(enrollments => {
      this.assignedCourses = new Set(enrollments.map(e => e.courseId));
      this.dialog.open(this.assignCoursesTpl, { width: '440px' });
    });
  }

  // El método toggleCourse no es necesario, MatSelectionList se encarga de la selección

  saveAssigned(selectedOptions: MatListOption[]): void {
    if (!this.selectedStudent) return;

    // Hacemos el mapeo aquí, dentro del TypeScript
    const selectedCourseIds = selectedOptions.map(option => option.value);

    const enrollmentsToCreate: Observable<Enrollment>[] = [];

    selectedCourseIds.forEach(courseId => {
      if (!this.assignedCourses.has(courseId)) {
        const enrollmentData: Omit<Enrollment, 'id'> = {
          courseId: courseId,
          studentId: this.selectedStudent!.id,
          state: 'in_progress',
          average: 0
        };
        enrollmentsToCreate.push(this.instSvc.createEnrollment(enrollmentData));
      }
    });

    if (enrollmentsToCreate.length === 0) {
      this.dialog.closeAll();
      return;
    }

    forkJoin(enrollmentsToCreate).subscribe({
      next: () => {
        this.snack.open('Cursos asignados correctamente', 'OK', { duration: 3000 });
        this.initialLoad();
        this.dialog.closeAll();
      },
      error: (err) => {
        console.error('Error asignando cursos', err);
        this.snack.open('Error al asignar uno o más cursos.', 'Cerrar');
      }
    });
  }

  deleteStudent(student: Student): void {
    // Lógica para eliminar estudiante
    // En el backend, ya se elimina el usuario asociado, por lo que la llamada es simple.
    this.instSvc.deleteStudent(student.id).subscribe({
      next: () => {
        this.snack.open('Estudiante eliminado con éxito', 'OK', { duration: 3000 });
        this.initialLoad();
      },
      error: (err) => {
        console.error('Error eliminando estudiante', err);
        this.snack.open(err.message || 'Error al eliminar.', 'Cerrar');
      }
    });
  }
}
