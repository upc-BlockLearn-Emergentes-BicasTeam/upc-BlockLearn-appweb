import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {UserEntity} from '../../model/user.entity';
import {InstitutionEntity} from '../../model/institution.entity';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  user: UserEntity = new UserEntity();
  institution: InstitutionEntity = new InstitutionEntity();
  error: boolean= false;

  constructor(private authService: AuthService, private router: Router) {}

  async registerInstitution() {
    await this.validateInputs();
    if(!this.error){
      try{
        await this.createUser();
        console.log(this.institution);
        this.authService.registerInstitution(this.institution).subscribe(data => {
          console.log("Institute Created Succesfully",data)
          this.router.navigate(['/login']);
        })
      }catch (e){console.log("Error in register Institution",e)}
    }

  }

  async createUser(){
    try{
      const data: any = await firstValueFrom(this.authService.registerUser(this.user));
      console.log(data);
      this.institution.idUser = data.id;
    }catch (e){
      console.log(e);
    }
  }
  async validateInputs(){
    try{
      const emailCheckResult: any = await firstValueFrom(this.authService.findUserByEmail(this.user.email));
      console.log(emailCheckResult);
      if(emailCheckResult.length > 0){
        console.log('email already exists');
        this.error = true;
      }
    }catch (e){console.log("Error email Checking",e)}
  }
}
