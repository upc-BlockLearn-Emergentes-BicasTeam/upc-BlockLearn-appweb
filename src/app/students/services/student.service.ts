import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserEntity} from '../../iam/model/user.entity';
import {StudentEntity} from '../model/student.entity';
import {forkJoin} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  updateStudentData(student: StudentEntity){
    return this.http.put(`${this.baseUrl}/students/${student.id}`, student);
  }

  updateUserData(user: UserEntity){
    return this.http.put(`${this.baseUrl}/users/${user.id}`, user);
  }
}
