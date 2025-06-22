// src/app/teacher/components/profile/profile.component.ts

import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';
import { MatCardModule }           from '@angular/material/card';
import { MatIconModule }           from '@angular/material/icon';
import { MatButtonModule }         from '@angular/material/button';
import { MatDividerModule }        from '@angular/material/divider';
import { MatFormFieldModule }      from '@angular/material/form-field';
import { MatInputModule }          from '@angular/material/input';

import { TeacherService }          from '../../services/teacher.service';
import { Teacher }                 from '../../models/teacher.entity';

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
  // Initialize with all required fields
  teacher: Teacher = {
    id:               '1',
    firstName:        '',
    lastName:         '',
    email:            '',
    phone:            '',
    courses:          [],
    blockchainEntries: []
  };

  isEditing = false;

  constructor(private teacherSvc: TeacherService) {}

  ngOnInit(): void {
    this.loadTeacher();
  }

  private loadTeacher(): void {
    this.teacherSvc.getById(this.teacher.id).subscribe({
      next: t => this.teacher = t,
      error: err => console.error('Error loading teacher', err)
    });
  }

  onChangeData(): void {
    this.isEditing = true;
  }

  onSave(): void {
    const updated: Partial<Teacher> = {
      firstName: this.teacher.firstName,
      lastName:  this.teacher.lastName,
      email:     this.teacher.email,
      phone:     this.teacher.phone
    };

    this.teacherSvc.update(this.teacher.id, updated).subscribe({
      next: () => {
        this.isEditing = false;
        this.loadTeacher();
      },
      error: err => console.error('Error saving teacher', err)
    });
  }

  onCancel(): void {
    this.isEditing = false;
    this.loadTeacher();
  }

  onLogoSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) { return; }
    const file = input.files[0];
    // Preview locally
    // (You may want to upload it to your backend instead)
    this.teacher['avatarUrl'] = URL.createObjectURL(file);
  }
}
