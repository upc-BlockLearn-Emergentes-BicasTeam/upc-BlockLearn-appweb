import { Component } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.loginStudent(this.email, this.password).subscribe(user => {
      console.log(user);
      if (user) {
        localStorage.setItem('currentStudent', JSON.stringify(user));
        this.router.navigate([`/student/${user.id}`]);
      } else {
        this.errorMessage = 'Credenciales inválidas';
      }
    });
  }
}
