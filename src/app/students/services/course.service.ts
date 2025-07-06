import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Syllabus} from '../../teacher/models/teacher.entity';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}
  getEnrollmentsByStudentId(studentId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/enrollments?idStudent=${studentId}`);
  }

  getCourseById(courseId: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${courseId}`);
  }

  getTeacherById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/teachers/${id}`);
  }

  getNotesByEnrollmentId(enrollmentId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/notesRecords?idEnrollment=${enrollmentId}`);
  }

  getSyllabusByCourseId(courseId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/syllabuses?idCourse=${courseId}`);
  }

  getAllNotes() {
    return this.http.get<any[]>(`${this.baseUrl}/notesRecords`);
  }

  getEnrollmentById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/enrollments/${id}`);
  }

  getAllSyllabuses() {
    return this.http.get<Syllabus[]>(`${this.baseUrl}/syllabuses`);
  }

}
