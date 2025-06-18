import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { InstitutionService } from '../../services/institution.service';
import { Student, Course, Institution } from '../../models/institution.entity';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];
  expanded: Record<string,boolean> = {};
  showAddModal    = false;
  showAssignModal = false;
  newStudent: Partial<Student & { password: string }> = {};
  selectedStudent: Student|null = null;
  availableCourses: Course[] = [];
  assignedCourses = new Set<string>();

  constructor(private instSvc: InstitutionService) {}

  ngOnInit(): void {
    this.instSvc.getById('1').subscribe({
      next: (inst: Institution) => {
        this.students = inst.students || [];
        this.availableCourses = inst.courses || [];
      },
      error: err => console.error(err)
    });
  }

  toggleExpand(s: Student) {
    this.expanded[s.id] = !this.expanded[s.id];
  }

  deleteStudent(s: Student) {
    this.students = this.students.filter(x => x.id !== s.id);
  }

  // ==== ADD STUDENT ====
  openAddStudent()   { this.newStudent = {}; this.showAddModal = true; }
  closeAddStudent()  { this.showAddModal = false; }
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
    this.closeAddStudent();
  }

  // ==== ASSIGN COURSES ====
  openAssign(s: Student) {
    this.selectedStudent = s;
    this.assignedCourses = new Set((s.courses||[]).map(c=>c.id));
    this.showAssignModal = true;
  }
  closeAssign() {
    this.showAssignModal = false;
    this.selectedStudent = null;
  }
  toggleCourse(c: Course) {
    this.assignedCourses.has(c.id)
      ? this.assignedCourses.delete(c.id)
      : this.assignedCourses.add(c.id);
  }
  saveAssigned() {
    if (this.selectedStudent) {
      this.selectedStudent.courses =
        this.availableCourses.filter(c => this.assignedCourses.has(c.id));
    }
    this.closeAssign();
  }
}
