import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }    from '@angular/forms';

// Angular Material
import { MatCardModule }      from '@angular/material/card';
import { MatIconModule }      from '@angular/material/icon';
import { MatButtonModule }    from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule }      from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatCheckboxModule }  from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { InstitutionService } from '../../services/institution.service';
import { Student, Course, Institution } from '../../models/institution.entity';

@Component({
  selector: 'app-students',
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
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  @ViewChild('addStudentTpl')   addStudentTpl!: TemplateRef<any>;
  @ViewChild('assignCoursesTpl') assignCoursesTpl!: TemplateRef<any>;

  private institutionId = '1';
  students: Student[] = [];
  availableCourses: Course[] = [];
  assignedCourses = new Set<string>();
  selectedStudent: Student | null = null;
  newStudent: Partial<Student & { password: string }> = {};

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
        this.students         = inst.students   || [];
        this.availableCourses = inst.courses    || [];
      },
      error: err => console.error('Error cargando institución', err)
    });
  }

  private persistStudents() {
    this.instSvc
      .update(this.institutionId, { students: this.students })
      .subscribe({
        next: () => console.log('Estudiantes guardados'),
        error: err => console.error('Error guardando estudiantes', err)
      });
  }

  deleteStudent(s: Student) {
    this.students = this.students.filter(x => x.id !== s.id);
    this.persistStudents();
  }

  /** ─── “Add Student” ─────────────────────────────────────────── */
  openAddStudent() {
    this.newStudent = {};
    this.dialog.open(this.addStudentTpl, { width: '400px' });
  }
  saveNewStudent() {
    const id = (this.students.length + 1).toString().padStart(2,'0');
    const created: Student = {
      id,
      firstName: this.newStudent.firstName!,
      lastName:  this.newStudent.lastName!,
      email:     this.newStudent.email!,
      phone:     this.newStudent.phone
    };
    this.students.push(created);
    this.persistStudents();
    this.dialog.closeAll();
  }

  /** ─── “Assign Courses” ───────────────────────────────────────── */
  openAssign(s: Student) {
    this.selectedStudent  = s;
    this.assignedCourses  = new Set((s.courses || []).map(c => c.id));
    this.dialog.open(this.assignCoursesTpl, { width: '400px' });
  }
  toggleCourse(c: Course) {
    this.assignedCourses.has(c.id)
      ? this.assignedCourses.delete(c.id)
      : this.assignedCourses.add(c.id);
  }
  saveAssigned() {
    if (!this.selectedStudent) return;
    this.selectedStudent.courses =
      this.availableCourses.filter(c => this.assignedCourses.has(c.id));
    this.persistStudents();
    this.dialog.closeAll();
  }
}
