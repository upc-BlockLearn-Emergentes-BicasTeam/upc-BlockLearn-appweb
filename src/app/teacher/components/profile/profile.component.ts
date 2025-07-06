import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher.entity';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  teacher: Teacher = {
    id: '',
    idUser: '',
    idInstitution: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatarUrl: '',
    courses: [],
    blockchainEntries: []
  };

  defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjYWQxZGUiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNpcmNsZS11c2VyLXJvdW5kIj48cGF0aCBkPSJNMjQgMTAuM2ExMCAxMCAwIDAgMCAxMC4zLTEwLjMiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI0Ii8+PHBhdGggZD0iTTE4LjM3IDE4LjgzYTYgNiAwIDAgMC0xMi43NCAwIi8+PC9zdmc+';

  isEditing = false;
  isLoading = false;

  constructor(
    private teacherSvc: TeacherService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const teacherId = this.route.snapshot.paramMap.get('id');
    if (teacherId) {
      this.teacher.id = teacherId;
      this.loadTeacher();
    } else {
      console.error('No se encontró el ID del docente en la URL');
    }
  }

  private loadTeacher(): void {
    this.isLoading = true;
    this.teacherSvc.getById(this.teacher.id).subscribe({
      next: t => {
        this.teacher = t;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error al cargar el perfil del docente', err);
        this.isLoading = false;
      }
    });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onSave(): void {
    const updated: Partial<Teacher> = {
      firstName: this.teacher.firstName,
      lastName: this.teacher.lastName,
      email: this.teacher.email,
      phone: this.teacher.phone,
      avatarUrl: this.teacher.avatarUrl
    };

    this.teacherSvc.update(this.teacher.id, updated).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadTeacher();
      },
      error: err => console.error('Error al guardar los cambios', err)
    });
  }

  onCancel(): void {
    this.isEditing = false;
    this.loadTeacher();
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.teacher.avatarUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
