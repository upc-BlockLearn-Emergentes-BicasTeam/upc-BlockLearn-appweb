import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserEntity } from '../../model/user.entity';
import { InstitutionEntity } from '../../model/institution.entity';
import { firstValueFrom } from 'rxjs';
import {MatFormField, MatInput, MatLabel, MatPrefix} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink,
    MatLabel,
    MatLabel,
    MatIcon,
    MatPrefix,
    MatInput,
    MatFormField,
    MatIcon,
    MatButton,
    MatIcon,
    MatIcon,
    MatIcon
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: UserEntity = new UserEntity();
  institution: InstitutionEntity = new InstitutionEntity();
  error: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  async registerInstitution() {
    await this.validateInputs();
    if (!this.error) {
      try {
        // Crear usuario con rol "institution"
        this.user.role = 'institution';
        const userCreated: any = await firstValueFrom(this.authService.registerUser(this.user));
        this.institution.idUser = userCreated.id;

        // Crear institución asociada al usuario
        this.authService.registerInstitution(this.institution).subscribe((data: any) => {
          console.log("Institute Created Successfully", data);
          this.router.navigate([`/institution/profile/${data.id}`]); // Redirige con ID de la institución
        });

      } catch (e) {
        console.log("Error in register Institution", e);
        this.error = true;
      }
    }
  }


  async createUser() {
    try {
      this.user.role = "institution";
      const data: any = await firstValueFrom(this.authService.registerUser(this.user));
      console.log(data);
      this.institution.idUser = data.id;
    } catch (e) {
      console.log(e);
    }
  }


  async validateInputs() {
    try {
      const emailCheckResult: any = await firstValueFrom(this.authService.findUserByEmail(this.user.email));
      console.log(emailCheckResult);
      if (emailCheckResult.length > 0) {
        console.log('email already exists');
        this.error = true;
      }
    } catch (e) {
      console.log("Error email Checking", e);
    }
  }
}
