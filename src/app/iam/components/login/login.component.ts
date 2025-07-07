import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserEntity } from '../../model/user.entity';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  // ... tus imports no cambian ...
  imports: [ FormsModule, RouterLink, MatLabel, MatFormField, MatPrefix, MatInput, MatButton, MatIcon ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  logoPath = 'assets/logoblocklearn.png';
  credentials = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.errorMessage = null;

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, ingrese su correo y contraseña.';
      return;
    }

    this.authService.findUserByEmailAndPassword(this.credentials.email, this.credentials.password).subscribe({
      next: (user) => {
        if (!user || !user.id) {
          this.errorMessage = 'Error inesperado: no se recibió información del usuario.';
          return;
        }

        // Guardamos el usuario o el ID del usuario en el almacenamiento local para futuras sesiones
        localStorage.setItem('userId', user.id.toString());
        localStorage.setItem('userRole', user.role);

        // Redirigir basado en el rol
        this.redirectUser(user.id, user.role);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'Credenciales incorrectas.';
        } else {
          this.errorMessage = 'Ocurrió un error en el servidor. Inténtelo más tarde.';
        }
        console.error('Login error:', error);
      }
    });
  }

  private redirectUser(userId: number, role: string) {
    switch (role) {
      case 'institution':
        this.authService.findInstitutionByUserId(userId).subscribe({
          next: (institution) => {
            if (institution && institution.id) {
              localStorage.setItem('institutionId', institution.id.toString());
              this.router.navigate([`/institution/profile/${institution.id}`]);
            } else {
              this.errorMessage = 'No se encontró el perfil de la institución asociado a este usuario.';
            }
          },
          error: (err) => {
            console.error('Error fetching institution profile:', err);
            this.errorMessage = 'Error al cargar el perfil de la institución.';
          }
        });
        break;

      case 'teacher':
        this.authService.findTeacherByUserId(userId).subscribe(teachers => {
          if (teachers.length > 0) {
            const teacherId = teachers[0].id;
            localStorage.setItem('teacherId', teacherId!.toString());
            this.router.navigate([`/teacher/profile/${teacherId}`]);
          } else { this.errorMessage = 'No se encontró el perfil del profesor.'; }
        });
        break;

      case 'student':
        this.authService.findStudentByUserId(userId).subscribe(students => {
          if (students.length > 0) {
            const studentId = students[0].id;
            localStorage.setItem('studentId', studentId!.toString());
            this.router.navigate([`/student/profile/${studentId}`]);
          } else { this.errorMessage = 'No se encontró el perfil del estudiante.'; }
        });
        break;

      default:
        this.errorMessage = 'Rol de usuario no reconocido.';
    }
  }
}
