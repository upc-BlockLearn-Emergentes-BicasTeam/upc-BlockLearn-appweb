import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {InstitutionEntity} from '../../model/institution.entity';
import {UserEntity} from '../../model/user.entity';
import {firstValueFrom} from 'rxjs';
import {MatFormField, MatInput, MatLabel, MatPrefix} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink,
    MatLabel,
    MatFormField,
    MatPrefix,
    MatInput,
    MatButton,
    MatIcon,
    MatIcon,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  logoPath = 'assets/logoblocklearn.png';

  institution: InstitutionEntity = new InstitutionEntity();
  user:UserEntity = new UserEntity();
  error: boolean= false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      const credentialsCheckResult: any = await firstValueFrom(
        this.authService.findUserByEmailAndPassword(this.user.email, this.user.password)
      );

      if (credentialsCheckResult.length === 0) {
        this.error = true;
        console.log('Credenciales incorrectas');
        return;
      }

      const loggedUser = credentialsCheckResult[0];
      const userId = loggedUser.id;
      const role = loggedUser.role;

      switch (role) {
        case 'institution':
          const institutionResult: any = await firstValueFrom(this.authService.findInstitutionByIdUser(userId));
          if (institutionResult.length > 0) {
            const institution = institutionResult[0];
            this.router.navigate([`/institution/profile/${institution.id}`]);
            localStorage.setItem('institutionId', institution.id);
          }
          break;

        case 'teacher':
          const teacherResult: any = await firstValueFrom(this.authService.findTeacherByIdUser(userId));
          if (teacherResult.length > 0) {
            const teacher = teacherResult[0];
            this.router.navigate([`/teacher/profile/${teacher.id}`]);
            localStorage.setItem('teacherId', teacher.id);

          }
          break;

        case 'student':
          const studentResult: any = await firstValueFrom(this.authService.findStudentByIdUser(userId));
          if (studentResult.length > 0) {
            const student = studentResult[0];
            this.router.navigate([`/student/profile/${student.id}`]);
            localStorage.setItem('studentId', student.id);

          }
          break;

        default:
          console.log('Rol de usuario no reconocido');
          this.error = true;
      }

    } catch (e) {
      console.log("Error durante el login:", e);
      this.error = true;
    }
  }


  async CredentialsChecking(){
    try{
      //validate email and password in "users"
      const credentialsCheckResult: any = await firstValueFrom(this.authService.findUserByEmailAndPassword(this.user.email, this.user.password));
      console.log(credentialsCheckResult);
      //if exists a user with email and password
      if(credentialsCheckResult.length > 0){
        console.log('credentials correct');
        //capture id of user and assigned in the institution
        this.institution.idUser = credentialsCheckResult[0].id;
      }else{
        console.log('credentials incorrect or not existing');
        this.error = true;
      }
    }catch (e){console.log("Error credential Checking",e)}
  }

}
