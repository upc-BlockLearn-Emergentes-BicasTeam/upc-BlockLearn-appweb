import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEntity } from '../model/user.entity';
import { InstitutionEntity } from '../model/institution.entity';
// Importa los otros perfiles si los necesitas en este servicio
import { Teacher } from '../../teacher/models/teacher.entity';
import {Student} from '../../students/model/student.entity';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ¡ACTUALIZADO! Esta es la nueva URL base de tu API de Spring Boot
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(private http: HttpClient) {}

  /**
   * Registra un nuevo usuario en el sistema.
   * Corresponde a: POST /users
   * @param user - Los datos del usuario a registrar (email, password, role).
   */
  registerUser(user: Omit<UserEntity, 'id'>): Observable<UserEntity> {
    return this.http.post<UserEntity>(`${this.baseUrl}/users`, user);
  }

  /**
   * Busca un usuario por email y, opcionalmente, por contraseña para iniciar sesión.
   * Corresponde a: GET /users?email=...&password=...
   * @param email - El email del usuario.
   * @param password - (Opcional) La contraseña para el login.
   */
  findUserByEmailAndPassword(email: string, password?: string): Observable<UserEntity> {
    let params = new HttpParams().set('email', email);
    if (password) {
      params = params.set('password', password);
    }
    return this.http.get<UserEntity>(`${this.baseUrl}/users`, { params });
  }

  /**
   * Obtiene los datos de un usuario por su ID.
   * Corresponde a: GET /users/{userId}
   * @param id - El ID del usuario.
   */
  findUserById(id: number): Observable<UserEntity> {
    return this.http.get<UserEntity>(`${this.baseUrl}/users/${id}`);
  }

  /**
   * Registra los detalles de una institución para un usuario existente.
   * Corresponde a: POST /institutions/user/{userId}
   * @param userId - El ID del usuario (con rol 'institution') al que se asocia.
   * @param institutionData - Los datos de la institución a crear.
   */
  registerInstitution(userId: number, institutionData: Omit<InstitutionEntity, 'id' | 'userId'>): Observable<InstitutionEntity> {
    return this.http.post<InstitutionEntity>(`${this.baseUrl}/institutions/user/${userId}`, institutionData);
  }

  /**
   * Busca el perfil de una institución a partir del ID de usuario.
   * Corresponde a: GET /institutions?userId=...
   * @param userId - El ID del usuario.
   */
  findInstitutionByUserId(userId: number): Observable<InstitutionEntity> {
    // La API devuelve un objeto único si lo encuentra.
    // Usamos `map` para asegurarnos de que si la API devuelve un array (aunque no debería),
    // tomemos el primer elemento por seguridad.
    return this.http.get<any>(`${this.baseUrl}/institutions`, { params: { userId } }).pipe(
      map(response => Array.isArray(response) ? response[0] : response)
    );
  }

  /**
   * Busca el perfil de un estudiante a partir del ID de usuario.
   * Corresponde a: GET /students?userId=...
   * @param userId - El ID del usuario.
   */
  findStudentByUserId(userId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.baseUrl}/students`, { params: { userId } });
  }

  /**
   * Busca el perfil de un profesor a partir del ID de usuario.
   * Corresponde a: GET /teachers?userId=...
   * @param userId - El ID del usuario.
   */
  findTeacherByUserId(userId: number): Observable<Teacher[]> {
    // Asumiendo que el endpoint de teachers también soporta filtro por userId
    return this.http.get<Teacher[]>(`${this.baseUrl}/teachers`, { params: { userId } });
  }

  // Los métodos findStudentById y findTeacherById probablemente pertenezcan
  // a sus propios servicios (StudentService, TeacherService), pero los mantenemos
  // aquí si tu lógica lo requiere.

  /**
   * Obtiene los datos de un estudiante por su ID de perfil.
   * Corresponde a: GET /students/{studentId}
   * @param id - El ID del perfil del estudiante.
   */
  findStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${id}`);
  }
}
