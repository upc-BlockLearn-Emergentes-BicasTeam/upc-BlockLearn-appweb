import { Component, OnInit }    from '@angular/core';
import { CommonModule }          from '@angular/common';
import { FormsModule }           from '@angular/forms';
import { InstitutionService }    from '../../services/institution.service';
import {
  Course,
  Teacher,
  BlockchainEntry,
  Institution
} from '../../models/institution.entity';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  /** Listado de cursos */
  courses: Course[] = [];
  /** Entradas blockchain de tipo "Syllabus" */
  syllabusEntries: BlockchainEntry[] = [];

  /** Modal Add Course */
  showAddModal = false;
  newCourse: Partial<Course & {
    syllabusFile?: File;
    syllabusFileName?: string;
    notesWeight: number[];
  }> = { notesWeight: [] };

  constructor(private instSvc: InstitutionService) {}

  ngOnInit(): void {
    this.instSvc.getById('1').subscribe({
      next: (inst: Institution) => {
        this.courses = inst.courses || [];
        // extraigo solo los Syllabus
        this.syllabusEntries = (inst.blockchainEntries || [])
          .filter(e => e.type === 'Syllabus');
      },
      error: err => console.error(err)
    });
  }

  /** Elimina un curso de la lista */
  deleteCourse(c: Course) {
    this.courses = this.courses.filter(x => x.id !== c.id);
  }

  /** Abre/cierra modal Add Course */
  openAddCourse() {
    this.newCourse = { notesWeight: [] };
    this.showAddModal = true;
  }
  closeAddCourse() {
    this.showAddModal = false;
  }

  /** Guarda el nuevo curso + crea entrada Syllabus mock */
  saveNewCourse() {
    // Crear ID con dos dígitos
    const id = (this.courses.length + 1).toString().padStart(2,'0');
    const teacher: Teacher = this.courses[0]?.teacher!; // ejemplo
    const created: Course = {
      id,
      name: this.newCourse.name!,
      code: id,
      section: this.newCourse.section || '',
      passingGrade: this.newCourse.passingGrade || 0,
      teacher,
      notesWeight: this.newCourse.notesWeight,
      syllabusFileName: this.newCourse.syllabusFileName,
      syllabusHash: '000'+Math.random().toString(36).slice(2)  // mock
    };
    this.courses.push(created);
    // entrada blockchain
    this.syllabusEntries.push({
      id: id,
      type: 'Syllabus',
      course: created,
      hash: created.syllabusHash!
    });
    this.closeAddCourse();
  }

  /** Handler al subir un fichero */
  onFileSelected(ev: Event) {
    const inp = ev.target as HTMLInputElement;
    if (!inp.files?.length) return;
    const file = inp.files[0];
    this.newCourse.syllabusFile = file;
    this.newCourse.syllabusFileName = file.name;
  }

  /** Añade un peso de nota extra */
  addNoteWeight() {
    this.newCourse.notesWeight!.push(0);
  }

  /** Simula navegar al block explorer */
  goToBlock(entryId: string) {
    console.log('Go to block', entryId);
  }
}
