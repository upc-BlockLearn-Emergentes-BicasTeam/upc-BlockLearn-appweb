import { Component } from '@angular/core';
import {Institution} from '../../model/institution';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';

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
  institution: Institution = {
    na: '',
    email: '',
    password: '',
    role: 'institucion'
  };

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (!this.institution.na || !this.institution.email || !this.institution.password) {
      alert('All fields are required');
      return;
    }

    this.authService.registerInstitution({
      ...this.institution,
      created_at: new Date().toISOString()
    }).subscribe({
      next: () => {
        alert('Institution registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Error registering institution');
      }
    });
  }
}
