import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';      // << importamos CommonModule
import { InstitutionService } from '../../services/institution.service';
import { Institution }        from '../../models/institution.entity';

@Component({
  selector: 'app-profile',
  standalone: true,             // << lo convertimos en standalone
  imports: [ CommonModule ],    // << aquí metemos CommonModule para usar NgIf, NgFor, etc.
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  institution: Institution = {
    id: '1',
    name: '',
    code: '',
    address: '',
    email: '',
    phone: '',
    logoUrl: '',
    createdAt: '',
    updatedAt: '',
    teachers: [],
    students: [],
    courses: [],
    blockchainEntries: []
  };

  constructor(private institutionService: InstitutionService) {}

  ngOnInit(): void {
    this.institutionService.getById(this.institution.id).subscribe({
      next: inst => this.institution = inst,
      error: err => console.error('Error cargando institución', err)
    });
  }

  onChangeData(): void {
    console.log('Change Data clicked');
  }
}
