/* src/app/student/components/profile/profile-student.component.ts */
import { Component, OnInit } from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule }       from '@angular/forms';

/* ── Angular Material ─────────────────────── */
import { MatCardModule }     from '@angular/material/card';
import { MatIconModule }     from '@angular/material/icon';
import { MatButtonModule }   from '@angular/material/button';
import { MatDividerModule }  from '@angular/material/divider';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule }    from '@angular/material/input';

/* ── Router / servicio ────────────────────── */
import { ActivatedRoute }    from '@angular/router';
import { StudentService }    from '../../services/student.service';

/* ── Modelo ───────────────────────────────── */
import {Course, Student} from '../../model/student.entity';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector   : 'app-profile-student',
  standalone : true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatDividerModule, MatFormFieldModule, MatInputModule, MatProgressSpinner, MatProgressSpinner, MatProgressSpinner, MatProgressSpinner
  ],
  templateUrl : './profile-student.component.html',
  styleUrls   : ['./profile-student.component.css']
})
export class ProfileStudentComponent implements OnInit {

  /* ───── estado ───── */
  student: Student = {
    id           : '',
    idUser       : '',
    idInstitution: '',
    firstName    : '',
    lastName     : '',
    email        : '',
    phone        : '',
    avatarUrl    : '',     // opcional
  };
  readonly defaultAvatar = 'assets/img/avatar-placeholder.png';

  isEditing  = false;
  isLoading  = false;

  constructor(
    private stuSvc : StudentService,
    private route  : ActivatedRoute
  ) {}

  /* ═════════ ciclo de vida ═════════ */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { console.error('No ID de estudiante en la URL'); return; }
    this.student.id = id;
    this.loadStudent();
  }

  /* ───── carga ───── */
  private loadStudent(): void {
    this.isLoading = true;
    this.stuSvc.getById(this.student.id).subscribe({
      next : s  => { this.student = s; this.isLoading = false; },
      error: err => { console.error('Error cargando estudiante', err);
        this.isLoading = false; }
    });
  }

  /* ───── edición ───── */
  onChangeData() { this.isEditing = true; }
  onCancel()     { this.isEditing = false; this.loadStudent(); }

  onSave(): void {
    const updated: Partial<Student> = {
      firstName : this.student.firstName,
      lastName  : this.student.lastName,
      email     : this.student.email,
      phone     : this.student.phone,
      avatarUrl : this.student.avatarUrl
    };

    this.stuSvc.update(this.student.id, updated).subscribe({
      next : ()  => { this.isEditing = false; this.loadStudent(); },
      error: err => console.error('Error guardando cambios', err)
    });
  }

  /* ───── avatar (opcional) ───── */
  onAvatarSelected(evt: Event): void {
    const inp = evt.target as HTMLInputElement;
    if (!inp.files?.length) { return; }

    const file    = inp.files[0];
    const reader  = new FileReader();
    reader.onload = () => this.student.avatarUrl = reader.result as string;
    reader.readAsDataURL(file);
  }
}
