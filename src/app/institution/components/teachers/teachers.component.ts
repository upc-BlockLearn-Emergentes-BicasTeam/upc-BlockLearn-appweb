import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';
import { MatCardModule }  from '@angular/material/card';
import { MatIconModule }  from '@angular/material/icon';
import { MatButtonModule }from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule }      from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatCheckboxModule }  from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InstitutionService } from '../../services/institution.service';
import { Teacher, Course, Institution } from '../../models/institution.entity';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  @ViewChild('addTeacherTpl')   addTeacherTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;

  private institutionId = '1';
  teachers: Teacher[] = [];
  availableCourses: Course[] = [];
  assignedCourses = new Set<string>();
  selectedTeacher: Teacher | null = null;
  newTeacher: Partial<Teacher & { password: string }> = {};

  constructor(
    private instSvc: InstitutionService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadInstitution();
  }

  private loadInstitution() {
    this.instSvc.getById(this.institutionId).subscribe({
      next: inst => {
        this.teachers         = inst.teachers   || [];
        this.availableCourses = inst.courses    || [];
      },
      error: err => console.error('Error cargando institución', err)
    });
  }

  private persistTeachers() {
    this.instSvc
      .update(this.institutionId, { teachers: this.teachers })
      .subscribe({
        next: () => {},
        error: err => console.error('Error guardando profesores', err)
      });
  }

  deleteTeacher(t: Teacher) {
    this.teachers = this.teachers.filter(x => x.id !== t.id);
    this.persistTeachers();
  }

  /** ─── “Add Teacher” ─────────────────────────────────────────── */
  openAddTeacher() {
    this.newTeacher = {};
    this.dialog.open(this.addTeacherTpl, { width: '400px' });
  }
  saveNewTeacher() {
    const id = (this.teachers.length + 1).toString().padStart(2,'0');
    const created: Teacher = {
      id,
      firstName: this.newTeacher.firstName!,
      lastName:  this.newTeacher.lastName!,
      email:     this.newTeacher.email!,
      phone:     this.newTeacher.phone
    };
    this.teachers.push(created);
    this.persistTeachers();
    this.dialog.closeAll();
  }

  /** ─── “Assign Courses” ───────────────────────────────────────── */
  openAssign(t: Teacher) {
    this.selectedTeacher = t;
    this.assignedCourses = new Set((t.courses||[]).map(c=>c.id));
    this.dialog.open(this.assignCoursesTpl, { width: '400px' });
  }
  toggleCourse(c: Course) {
    this.assignedCourses.has(c.id)
      ? this.assignedCourses.delete(c.id)
      : this.assignedCourses.add(c.id);
  }
  saveAssigned() {
    if (!this.selectedTeacher) return;
    this.selectedTeacher!.courses =
      this.availableCourses.filter(c=>this.assignedCourses.has(c.id));
    this.persistTeachers();
    this.dialog.closeAll();
  }
}
