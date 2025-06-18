import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  getStudentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?id=${id}`);
  }
}
