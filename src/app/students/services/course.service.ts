import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

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

}
