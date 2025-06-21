import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  findCertificateByIdStudent(idStudent: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/certifications?idStudent=${idStudent}`);
  }
}
