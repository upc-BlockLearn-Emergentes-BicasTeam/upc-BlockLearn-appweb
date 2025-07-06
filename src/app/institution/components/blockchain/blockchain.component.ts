import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';

const API = 'http://localhost:3000';

@Component({
  selector: 'app-blockchain',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './blockchain.component.html',
  styleUrls: ['./blockchain.component.css']
})
export class BlockchainComponent implements OnInit {
  entries: any[] = [];
  syllabuses: any[] = [];
  certifications: any[] = [];
  notesRecords: any[] = [];
  students: any[] = [];
  courses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAll();
  }

  async loadAll() {
    try {
      const [entries, syllabuses, certifications, notes, students, courses] = await Promise.all([
        this.http.get<any[]>(`${API}/blockchainEntries`).toPromise(),
        this.http.get<any[]>(`${API}/syllabuses`).toPromise(),
        this.http.get<any[]>(`${API}/certifications`).toPromise(),
        this.http.get<any[]>(`${API}/notesRecords`).toPromise(),
        this.http.get<any[]>(`${API}/students`).toPromise(),
        this.http.get<any[]>(`${API}/courses`).toPromise()
      ]);

      this.entries = entries || [];
      this.syllabuses = syllabuses || [];
      this.certifications = certifications || [];
      this.notesRecords = notes || [];
      this.students = students || [];
      this.courses = courses || [];
    } catch (err) {
      console.error('Error cargando datos blockchain', err);
    }
  }

  getSyllabusDetails(entry: any): string {
    const syllabus = this.syllabuses.find(s => s.id === entry.relatedId);
    const course = this.courses.find(c => c.id === syllabus?.idCourse);
    return course ? `Silabo del curso: ${course.name}` : 'Curso no encontrado';
  }

  getCertificationDetails(entry: any): string {
    const cert = this.certifications.find(c => c.id === entry.relatedId);
    const student = this.students.find(s => s.id === cert?.idStudent);
    const course = this.courses.find(c => c.id === cert?.idCourse);
    return student && course
      ? `Certificado de ${student.firstName} ${student.lastName} en ${course.name}`
      : 'Datos no encontrados';
  }

  getNoteRecordDetails(entry: any): string {
    const note = this.notesRecords.find(n => n.id === entry.relatedId);
    if (!note) return 'Nota no encontrada';

    const enrollment = note.idEnrollment;
    const course = this.courses.find(c =>
      this.notesRecords.some(n => n.id === note.id && c.id === this.getCourseIdFromEnrollment(n.idEnrollment))
    );

    return `Nota registrada: ${note.score} (${note.percent}%) en ${course?.name || 'Curso no encontrado'}`;
  }

  getCourseIdFromEnrollment(idEnrollment: string): string | undefined {
    // Simplificación: busca en notesRecords y cruza con course ID
    const enrollment = this.notesRecords.find(n => n.idEnrollment === idEnrollment);
    const courseMatch = this.courses.find(c =>
      this.notesRecords.some(n => n.id === enrollment?.id && c.id === n.idCourse)
    );
    return courseMatch?.id;
  }

  goToBlock(entryId: string) {
    console.log(`🔗 Simulando acceso al bloque con ID: ${entryId}`);
  }
}
