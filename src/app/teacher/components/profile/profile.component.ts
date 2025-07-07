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

import { TeacherService } from '../../services/teacher.service';
// CAMBIO: Usamos el modelo actualizado con IDs numéricos
import { Teacher } from '../../models/teacher.entity';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // CAMBIO: Inicializamos con valores por defecto y tipos correctos
  teacher: Teacher = {
    id: 0,
    userId: 0,
    institutionId: 0,
    firstName: '',
    lastName: '',
    email: '',
  };

  private originalTeacher!: Teacher; // Para la función "Cancelar"
  isEditing = false;
  isLoading = false;

  defaultAvatar = 'data:image/svg+xml;base64,...'; // (Tu SVG aquí)

  constructor(
    private teacherSvc: TeacherService,
    private route: ActivatedRoute,
    private snack: MatSnackBar // Inyectar MatSnackBar para notificaciones
  ) {}

  ngOnInit(): void {
    // CAMBIO: Obtenemos el ID de la URL y lo convertimos a número
    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.teacher.id = +teacherId; // El '+' convierte string a número
      this.loadTeacher();
    } else {
      console.error('No se encontró el ID del docente en la URL');
      this.snack.open('Error: No se pudo identificar al docente.', 'Cerrar');
    }
  }

  private loadTeacher(): void {
    this.isLoading = true;
    // CAMBIO: Llamamos al nuevo método del servicio
    this.teacherSvc.getTeacherProfile(this.teacher.id).subscribe({
      next: t => {
        this.teacher = t;
        this.originalTeacher = JSON.parse(JSON.stringify(t)); // Guardamos copia para "cancelar"
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al cargar el perfil del docente', err);
        this.snack.open(err.message || 'Error al cargar el perfil.', 'Cerrar');
        this.isLoading = false;
      }
    });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onSave(): void {
    // Preparamos los datos a enviar, solo los campos editables
    const { firstName, lastName, email, phone, avatarUrl } = this.teacher;
    const updatedData: Partial<Teacher> = { firstName, lastName, email, phone, avatarUrl };

    // CAMBIO: Llamamos al nuevo método de actualización
    this.teacherSvc.updateTeacherProfile(this.teacher.id, updatedData).subscribe({
      next: (updatedTeacher) => {
        this.isEditing = false;
        this.teacher = updatedTeacher; // Actualizamos con la respuesta del servidor
        this.originalTeacher = JSON.parse(JSON.stringify(updatedTeacher));
        this.snack.open('Perfil actualizado con éxito.', 'OK', { duration: 3000 });
      },
      error: err => {
        console.error('Error al guardar los cambios', err);
        this.snack.open(err.message || 'Error al guardar.', 'Cerrar');
      }
    });
  }

  onCancel(): void {
    this.isEditing = false;
    // Restauramos desde la copia original
    this.teacher = JSON.parse(JSON.stringify(this.originalTeacher));
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      // Asignamos el resultado Base64 al avatarUrl para la vista previa
      this.teacher.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
