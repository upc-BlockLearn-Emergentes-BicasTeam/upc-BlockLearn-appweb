import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';
import { InstitutionService }from '../../services/institution.service';
import { Institution }       from '../../models/institution.entity';

// Angular Material Modules
import { MatCardModule }        from '@angular/material/card';
import { MatButtonModule }      from '@angular/material/button';
import { MatIconModule }        from '@angular/material/icon';
import { MatFormFieldModule }   from '@angular/material/form-field';
import { MatInputModule }       from '@angular/material/input';
import { MatDividerModule }     from '@angular/material/divider';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // Material
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  institution: Institution = {
    id: '1', name: '', code: '', address: '',
    email: '', phone: '', logoUrl: '',
    createdAt: '', updatedAt: '',
    teachers: [], students: [], courses: [], blockchainEntries: []
  };

  isEditing = false;

  constructor(private institutionService: InstitutionService) {}

  ngOnInit(): void {
    this.load();
  }

  private load() {
    this.institutionService.getById(this.institution.id)
      .subscribe({
        next: inst => this.institution = inst,
        error: err => console.error('Error loading institution', err)
      });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onCancel(): void {
    this.isEditing = false;
    this.load();
  }

  onSave(): void {
    const updated: Partial<Institution> = {
      name:  this.institution.name,
      email: this.institution.email,
      phone: this.institution.phone
    };
    this.institutionService.update(this.institution.id, updated)
      .subscribe({
        next: () => {
          this.isEditing = false;
          this.load();
        },
        error: err => console.error('Error saving institution', err)
      });
  }

  onLogoSelected(evt: Event): void {
    const inp = evt.target as HTMLInputElement;
    if (!inp.files?.length) return;
    const file = inp.files[0];
    this.institution.logoUrl = URL.createObjectURL(file);
    // aquí podrías subir al servidor...
  }
}
