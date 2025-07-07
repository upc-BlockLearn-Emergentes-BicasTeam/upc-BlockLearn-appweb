import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/* Servicios y Modelo */
import { StudentService } from '../../services/student.service';
// CAMBIO: Usamos el nuevo modelo con IDs numéricos
import { Student } from '../../model/student.entity';

@Component({
  selector: 'app-profile-student',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule, MatDividerModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule
  ],
  templateUrl: './profile-student.component.html',
  styleUrls: ['./profile-student.component.css']
})
export class ProfileStudentComponent implements OnInit {

  // CAMBIO: Inicializamos con valores por defecto y tipos correctos
  student: Student = {
    id: 0,
    userId: 0,
    institutionId: 0,
    firstName: '',
    lastName: '',
    email: '',
  };

  private originalStudent!: Student; // Para la función "Cancelar"
  isEditing = false;
  isLoading = false;

  readonly defaultAvatar = 'assets/img/avatar-placeholder.png';

  constructor(
    private stuSvc: StudentService,
    private route: ActivatedRoute,
    private snack: MatSnackBar // Inyectar MatSnackBar
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      console.error('No ID de estudiante en la URL');
      this.snack.open('Error: No se pudo identificar al estudiante.', 'Cerrar');
      return;
    }
    // CAMBIO: Asignamos el ID numérico
    this.student.id = +idParam;
    this.loadStudentProfile();
  }

  private loadStudentProfile(): void {
    this.isLoading = true;
    // CAMBIO: Llamamos al nuevo método del servicio
    this.stuSvc.getStudentProfileById(this.student.id).subscribe({
      next: (profile) => {
        this.student = profile;
        this.originalStudent = JSON.parse(JSON.stringify(profile)); // Guardamos copia para "cancelar"
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil del estudiante', err);
        this.snack.open(err.message || 'Error al cargar el perfil.', 'Cerrar');
        this.isLoading = false;
      }
    });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onCancel(): void {
    this.isEditing = false;
    // Restauramos desde la copia original sin llamar a la API
    this.student = JSON.parse(JSON.stringify(this.originalStudent));
  }

  onSave(): void {
    // Preparamos los datos a enviar, solo los campos editables del perfil
    const { firstName, lastName, email, phone, avatarUrl } = this.student;
    const updatedData: Partial<Student> = { firstName, lastName, email, phone, avatarUrl };

    // CAMBIO: Llamamos al nuevo método de actualización
    this.stuSvc.updateStudentProfile(this.student.id, updatedData).subscribe({
      next: (updatedStudent) => {
        this.isEditing = false;
        this.student = updatedStudent;
        this.originalStudent = JSON.parse(JSON.stringify(updatedStudent));
        this.snack.open('Perfil actualizado con éxito.', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error guardando cambios', err);
        this.snack.open(err.message || 'Error al guardar los cambios.', 'Cerrar');
      }
    });
  }

  onAvatarSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.student.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
