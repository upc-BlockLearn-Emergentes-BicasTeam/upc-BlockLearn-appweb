import { Component, OnInit }      from '@angular/core';
import { CommonModule }            from '@angular/common';
import { FormsModule }             from '@angular/forms';
import { InstitutionService }      from '../../services/institution.service';
import { Teacher, Course, Institution } from '../../models/institution.entity';

@Component({
  selector: 'app-teachers',
  standalone: true,               // <- marca standalone
  imports: [ CommonModule, FormsModule ],  // <- importa estos módulos
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: Teacher[] = [];
  expanded: Record<string,boolean> = {};
  showAddModal    = false;
  showAssignModal = false;
  newTeacher: Partial<Teacher & { password: string }> = {};
  selectedTeacher: Teacher|null = null;
  availableCourses: Course[] = [];
  assignedCourses = new Set<string>();

  constructor(private instSvc: InstitutionService) {}

  ngOnInit(): void {
    this.instSvc.getById('1').subscribe(inst => {
      this.teachers        = inst.teachers  || [];
      this.availableCourses= inst.courses   || [];
    });
  }

  toggleExpand(t:Teacher)        { this.expanded[t.id] = !this.expanded[t.id]; }
  deleteTeacher(t:Teacher)       { this.teachers = this.teachers.filter(x=>x.id!==t.id); }

  openAddTeacher()               { this.newTeacher={}; this.showAddModal=true; }
  closeAddTeacher()              { this.showAddModal=false; }
  saveNewTeacher()               {     const id = (this.teachers.length + 1).toString().padStart(2,'0');
    const created: Teacher = {
      id,
      firstName: this.newTeacher.firstName!,
      lastName:  this.newTeacher.lastName!,
      email:     this.newTeacher.email!,
      phone:     this.newTeacher.phone
    };
    this.teachers.push(created);
    this.closeAddTeacher(); }

  openAssign(t:Teacher) {
    this.selectedTeacher = t;
    this.assignedCourses  = new Set((t.courses||[]).map(c=>c.id));
    this.showAssignModal  = true;   // <- aquí abres el modal
  }
  closeAssign()                  { this.showAssignModal=false; this.selectedTeacher=null; }
  toggleCourse(c: Course)        {
    this.assignedCourses.has(c.id)
      ? this.assignedCourses.delete(c.id)
      : this.assignedCourses.add(c.id);
  }
  saveAssigned() {
    if (this.selectedTeacher) {
      this.selectedTeacher.courses =
        this.availableCourses.filter((c:Course)=> this.assignedCourses.has(c.id));
    }
    this.closeAssign();
  }
}
