import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

/* Material */
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Importar spinner

/* Servicio y Modelos */
import { StudentService } from '../../services/student.service';
// CAMBIO: Usamos los modelos actualizados con IDs numéricos
import { Student, Course, Enrollment, Certificate } from '../../model/student.entity';

@Component({
  selector: 'app-courses-student',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatDividerModule,
    MatExpansionModule, MatListModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './courses-student.component.html',
  styleUrls: ['./courses-student.component.css']
})
export class CoursesStudentComponent implements OnInit {

  // CAMBIO: studentId ahora es un número
  studentId: number = 0;
  // CAMBIO: Inicializamos Student para evitar errores de `undefined`
  student: Student = {
    id: 0, userId: 0, institutionId: 0,
    firstName: '', lastName: '', email: ''
  };

  enrollments: Enrollment[] = [];
  selectedEnrollment: Enrollment | null = null;
  isLoading = false; // Estado para mostrar el spinner

  constructor(
    private route: ActivatedRoute,
    private stuSvc: StudentService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.snack.open('Error: No se pudo identificar al estudiante.', 'Cerrar');
      return;
    }
    // CAMBIO: Convertimos el ID a número
    this.studentId = +idParam;
    this.loadStudentProfile();
  }


  private recalculateAverage(enrollment: Enrollment): void {
    const notes = enrollment.notesRecords ?? [];
    // Los pesos de las notas vienen dentro del objeto `course` anidado.
    const weights = enrollment.course?.notesWeight ?? [];

    if (notes.length === 0) {
      enrollment.average = 0;
      return;
    }

    // Si no hay pesos, calculamos un promedio simple para no dejarlo en 0.
    if (weights.length === 0 || notes.length !== weights.length) {
      const sum = notes.reduce((acc, note) => acc + note.score, 0);
      enrollment.average = +(sum / notes.length).toFixed(1);
      return;
    }

    // Cálculo ponderado
    const weightedSum = notes.reduce((sum, note, index) => {
      const weight = weights[index] ?? 0;
      return sum + (note.score * (weight / 100));
    }, 0);

    enrollment.average = +weightedSum.toFixed(1);
  }

  private loadStudentProfile(): void {
    this.isLoading = true;
    // CAMBIO: Llamamos al nuevo método del servicio que trae todo
    this.stuSvc.getStudentProfileById(this.studentId).subscribe({
      next: (profile) => {
        this.student = profile;
        // El servicio ya nos devuelve las matrículas enriquecidas
        this.enrollments = profile.enrollments ?? [];
        this.enrollments.forEach(enrollment => {
          this.recalculateAverage(enrollment);
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando el perfil del estudiante', err);
        this.snack.open(err.message || 'Error al cargar los datos.', 'Cerrar');
        this.isLoading = false;
      }
    });
  }

  selectEnrollment(enrollment: Enrollment): void {
    this.selectedEnrollment = this.selectedEnrollment?.id === enrollment.id ? null : enrollment;
  }

  goBack(): void {
    this.selectedEnrollment = null;
  }

  // La lógica para ver/descargar el certificado o el sílabo ahora puede estar aquí



  downloadCertificate(certificate: Certificate | undefined): void {
    if (!certificate?.fileData) {
      this.snack.open('No se encontró el archivo del certificado.', 'Cerrar');
      return;
    }

    // Creamos un enlace temporal para la descarga
    const link = document.createElement('a');
    link.href = certificate.fileData; // La cadena Base64 funciona como una URL de datos
    link.download = certificate.fileName;
    link.click();
    link.remove();
  }


  viewSyllabus(course: Course | undefined): void {
    if (!course || !course.id) {
      this.snack.open('Información del curso no disponible.', 'Cerrar');
      return;
    }

    // Llamamos al nuevo método del servicio
    this.stuSvc.getSyllabusByCourseId(course.id).subscribe({
      next: (syllabus) => {
        if (syllabus && syllabus.fileData) {
          // Usamos la función que ya tienes para abrir el PDF
          this.openBase64Pdf(syllabus.fileData, syllabus.fileName);
        } else {
          // Esto se ejecutaría si la API devuelve 200 OK pero con cuerpo vacío
          this.snack.open('No se encontró el archivo del sílabo para este curso.', 'Cerrar');
        }
      },
      error: (err) => {
        // El manejador de errores del servicio ya mostrará un mensaje genérico.
        // Aquí podemos poner uno más específico si queremos.
        console.error("Error al obtener el sílabo:", err);
        this.snack.open('Este curso no tiene un sílabo disponible para ver.', 'Cerrar');
      }
    });
  }

  private openBase64Pdf(dataUri: string, title: string = 'document.pdf') {
    try {
      const base64 = dataUri.split(',')[1];
      if (!base64) throw new Error("Formato Base64 inválido.");

      const byteChars = atob(base64);
      const byteNumbers = Array.from(byteChars, ch => ch.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');
      // No es necesario revocar la URL aquí si es una nueva pestaña,
      // el navegador lo hace al cerrarse.
    } catch (error) {
      console.error("Error procesando el PDF:", error);
      this.snack.open("No se pudo abrir el archivo PDF.", 'Cerrar');
    }
  }
}
