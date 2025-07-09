import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserEntity } from '../../model/user.entity';
import { InstitutionEntity } from '../../model/institution.entity';
import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  // ... tus imports no cambian ...
  imports: [ FormsModule, RouterLink, MatLabel, MatIcon, MatPrefix, MatInput, MatFormField, MatButton, CommonModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  // Los datos del formulario se vinculan a estos objetos
  userData: Omit<UserEntity, 'id'> = { email: '', password: '', role: 'institution' };
  institutionData: Omit<InstitutionEntity, 'id' | 'userId'> = { name: '', address: '', email: '', phone: '', logoUrl: '' };

  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  async registerInstitution() {
    this.errorMessage = null; // Resetea el mensaje de error

    // 1. Validar que el email no exista
    try {
      // findUserByEmailAndPassword ahora solo toma el email para esta validación
      await this.authService.findUserByEmailAndPassword(this.userData.email!).toPromise();
      // Si la petición tiene éxito, significa que el email YA existe.
      this.errorMessage = 'El correo electrónico ya está en uso.';
      return;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      // Esperamos un error 404, que significa que el email está disponible.
      if (httpError.status !== 404) {
        this.errorMessage = 'Error al validar el correo. Por favor, inténtelo de nuevo.';
        console.error('Error validating email:', httpError);
        return;
      }
    }

    // Si el email está disponible (error 404), continuamos...

    // 2. Registrar el usuario
    this.authService.registerUser(this.userData).subscribe({
      next: (createdUser) => {
        if (!createdUser.id) {
          this.errorMessage = 'No se pudo obtener el ID del usuario creado.';
          return;
        }

        // 3. Con el ID del usuario, registrar la institución
        this.authService.registerInstitution(createdUser.id, this.institutionData).subscribe({
          next: (createdInstitution) => {
            console.log("Institution and User created successfully", createdInstitution);
            // Redirigir al perfil de la institución recién creada
            this.router.navigate([`/institution/profile/${createdInstitution.id}`]);
          },
          error: (err) => {
            this.errorMessage = 'Error al crear el perfil de la institución.';
            console.error('Error creating institution:', err);
          }
        });
      },
      error: (err) => {
        this.errorMessage = 'Error al crear el usuario.';
        console.error('Error creating user:', err);
      }
    });
  }
}
