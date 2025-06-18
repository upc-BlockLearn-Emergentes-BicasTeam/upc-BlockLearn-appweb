import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {map, Observable} from 'rxjs';
import {UserEntity} from '../model/user.entity';
import {InstitutionEntity} from '../model/institution.entity';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  registerInstitution(institution: InstitutionEntity) {
    return this.http.post(`${this.baseUrl}/institutes`, institution);
  }
  findUserByEmail(email: string) {
    return this.http.get(`${this.baseUrl}/users?email=${email}`);
  }
  registerUser(user: UserEntity) {
    return this.http.post(`${this.baseUrl}/users`, user);
  }
  findUserByEmailAndPassword(email: string, password: string) {
    return this.http.get(`${this.baseUrl}/users?email=${email}&password=${password}`);
  }
  findInstitutionByIdUser(idUser: number) {
    return this.http.get(`${this.baseUrl}/institutes?idUser=${idUser}`);
  }
  findStudentByIdUser(idUser: number) {
    return this.http.get(`${this.baseUrl}/students?idUser=${idUser}`);
  }
  findTeacherByIdUser(idUser: number) {
    return this.http.get(`${this.baseUrl}/teachers?idUser=${idUser}`);
  }
}
