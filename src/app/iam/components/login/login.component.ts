import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {InstitutionEntity} from '../../model/institution.entity';
import {UserEntity} from '../../model/user.entity';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  institution: InstitutionEntity = new InstitutionEntity();
  user:UserEntity = new UserEntity();
  error: boolean= false;

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    await this.CredentialsChecking();

    if (!this.error) {
      const userId = this.institution.idUser;

      try {
        // Buscar si es estudiante
        const studentResult: any = await firstValueFrom(this.authService.findStudentByIdUser(userId));
        if (studentResult.length > 0) {
          const student = studentResult[0];
          console.log('Student found:', student);
          this.router.navigate([`/student/${student.id}`]);
          return;
        }

        // Buscar si es profesor
        const teacherResult: any = await firstValueFrom(this.authService.findTeacherByIdUser(userId));
        if (teacherResult.length > 0) {
          const teacher = teacherResult[0];
          console.log('Teacher found:', teacher);
          this.router.navigate([`/teacher/${teacher.id}`]);
          return;
        }

        // Buscar si es institución
        const institutionResult: any = await firstValueFrom(this.authService.findInstitutionByIdUser(userId));
        if (institutionResult.length > 0) {
          const institution = institutionResult[0];
          console.log('Institution found:', institution);
          this.router.navigate([`/institution/${institution.id}`]);
          return;
        }

        // Si no se encontró en ninguna entidad
        console.log('User exists but not assigned to any role');
        this.error = true;

      } catch (e) {
        console.log('Error searching roles', e);
        this.error = true;
      }
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
