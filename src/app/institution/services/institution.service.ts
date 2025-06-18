// src/app/institution/services/institution.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Institution } from '../models/institution.entity';

// Si te gusta separar la URL en una constante:
const API_BASE_URL = 'https://upc-blocklearnbicasteam.free.beeceptor.com';
const INSTITUTIONS_ENDPOINT = `${API_BASE_URL}/institutions`;

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  /** Punto final completo */
  private readonly apiUrl = INSTITUTIONS_ENDPOINT;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Institution[]> {
    return this.http
      .get<Institution[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getById(id: string): Observable<Institution> {
    return this.http
      .get<Institution>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(institution: Institution): Observable<Institution> {
    return this.http
      .post<Institution>(this.apiUrl, institution)
      .pipe(catchError(this.handleError));
  }

  update(id: string, institution: Partial<Institution>): Observable<Institution> {
    return this.http
      .put<Institution>(`${this.apiUrl}/${id}`, institution)
      .pipe(catchError(this.handleError));
  }

  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse) {
    console.error('InstitutionService error:', err);
    return throwError(() => new Error(err.message || 'Error en servidor'));
  }
}
