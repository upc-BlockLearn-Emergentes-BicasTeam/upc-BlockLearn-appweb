import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import * as crypto from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // 🔹 Obtener todas las notas (con detalles)
  getAllNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/notesRecords`);
  }

  // 🔹 Obtener todas las sílabos
  getAllSyllabuses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/syllabuses`);
  }

  // 🔹 Obtener todos los certificados
  getAllCertifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/certifications`);
  }

  // 🔹 Obtener curso por ID
  getCourseById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/courses/${id}`);
  }

  // 🔹 Obtener profesor por ID
  getTeacherById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/teachers/${id}`);
  }

  // 🔹 Obtener usuario por ID
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/${id}`);
  }

  // 🔹 Obtener matrícula por ID
  getEnrollmentById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/enrollments/${id}`);
  }

  // ✅ Generar hash determinístico desde parámetros
  generateHash(
    studentId: number,
    courseId: number,
    note: number,
    percent: number,
    timestamp: string
  ): string {
    const rawData = `${studentId}-${courseId}-${note}-${percent}-${timestamp}`;
    const hash = crypto.SHA256(rawData).toString(crypto.enc.Hex);
    return hash;
  }

  // ✅ Verificar si un hash calculado coincide con el esperado
  verifyHash(
    studentId: number,
    courseId: number,
    note: number,
    percent: number,
    timestamp: string,
    expectedHash: string
  ): boolean {
    const generated = this.generateHash(studentId, courseId, note, percent, timestamp);
    return generated === expectedHash;
  }

  // 🔹 Guardar una nueva nota en Blockchain
  recordNoteToBlockchain(payload: {
    idEnrollment: number;
    note: number;
    percent: number;
    hash: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/notesRecords`, payload);
  }

  // 🔹 Guardar un nuevo sílabo en Blockchain
  recordSyllabusToBlockchain(payload: {
    idCourse: number;
    hash: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/syllabuses`, payload);
  }

  // 🔹 Guardar un nuevo certificado en Blockchain
  recordCertificationToBlockchain(payload: {
    idCourse: number;
    idStudent: number;
    hash: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/certifications`, payload);
  }
}
