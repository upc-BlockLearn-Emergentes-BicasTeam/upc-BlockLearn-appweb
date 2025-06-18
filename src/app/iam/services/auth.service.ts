import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Institution} from '../model/institution';
import {map, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  registerInstitution(institution: Institution) {
    return this.http.post(`${this.baseUrl}/users`, institution);
  }
  loginStudent(email: string, password: string): Observable<any | null> {
    return this.http.get<any[]>(`${this.baseUrl}/students`).pipe(
      map((students) => {
        const user = students.find(s => s.email === email && s.password === password);
        return user || null;
      })
    );
  }
}
