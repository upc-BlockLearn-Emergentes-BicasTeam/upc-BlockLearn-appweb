import { Component, OnInit }        from '@angular/core';
import { CommonModule }              from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { MatCardModule }             from '@angular/material/card';
import { MatButtonModule }           from '@angular/material/button';
import { MatIconModule }             from '@angular/material/icon';
import { MatDividerModule }          from '@angular/material/divider';
import { MatExpansionModule }        from '@angular/material/expansion';
import { MatFormFieldModule }        from '@angular/material/form-field';
import { MatSelectModule }           from '@angular/material/select';
import { MatOptionModule }           from '@angular/material/core';

import { TeacherService }            from '../../services/teacher.service';
import { Teacher, Course, Student, BlockchainEntry } from '../../models/teacher.entity';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  private teacherId = '1';
  courses: Course[] = [];
  syllabusEntries: BlockchainEntry[] = [];
  selectedCourse: Course | null = null;
  studentList: Student[] = [];
  expanded: Record<string,boolean> = {};

  // para dropdown de notas
  noteOptions = [
    ...Array.from({length:20}, (_,i) => (i+1).toString()),
    'NT','--'
  ];
  // etiquetas fijas
  noteLabels = ['PC1','EA','PC2','EB'];

  constructor(private teacherSvc: TeacherService) {}

  ngOnInit(): void {
    this.loadTeacher();
  }

  private loadTeacher() {
    this.teacherSvc.getById(this.teacherId).subscribe({
      next: t => this.courses = t.courses || [],
      error: err => console.error('Error cargando profesor', err)
    });
  }

  selectCourse(c: Course) {
    this.selectedCourse = c;
    this.studentList    = c.students  || [];
    this.syllabusEntries = (c.blockchainEntries||[])
      .filter(e => e.course?.id === c.id);
  }

  goBack() {
    this.selectedCourse = null;
    this.expanded       = {};
  }

  toggleExpand(id: string) {
    this.expanded[id] = !this.expanded[id];
  }

  goToBlock(entryId: string) {
    console.log('Go to block', entryId);
  }

  downloadSyllabus() {
    if (!this.selectedCourse?.syllabusFileName) return;
    const url = `/assets/${this.selectedCourse.syllabusFileName}`;
    window.open(url, '_blank');
  }
}
