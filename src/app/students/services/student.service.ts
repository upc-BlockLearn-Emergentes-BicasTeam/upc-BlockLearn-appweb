import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UserEntity} from '../../iam/model/user.entity';
import {StudentEntity} from '../model/student.entity';
import {forkJoin} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  updateStudentData(user: UserEntity, student: StudentEntity){
    return forkJoin({
      studentUpdate: this.http.put(`${this.baseUrl}/students`, student),
      userUpdate: this.http.put(`${this.baseUrl}/users`, user)
    });
  }

}
