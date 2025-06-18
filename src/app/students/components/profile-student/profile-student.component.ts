import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../../services/student.service';
import {StudentEntity} from '../../model/student.entity';
import {AuthService} from '../../../iam/services/auth.service';
import {UserEntity} from '../../../iam/model/user.entity';

@Component({
  selector: 'app-profile-student',
  imports: [
    FormsModule
  ],
  templateUrl: './profile-student.component.html',
  styleUrl: './profile-student.component.css'
})
export class ProfileStudentComponent implements OnInit {
  student: StudentEntity = new StudentEntity();
  user: UserEntity = new UserEntity();
  isEditing = false;
  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private studentService: StudentService,) {
    this.student.idUser = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.authService.findStudentByIdUser(this.student.idUser).subscribe((data:any) => {
      console.log(data);
      this.student.name = data[0].name;
      this.student.lastName = data[0].lastName;
      this.student.id=data[0].id;
      this.student.telephone = data[0].telephone;
    });
    this.authService.findUserByIdUser(this.student.idUser).subscribe((data:any) => {
      this.user.id = data[0].id;
    })
  }
  enableEditing() {
    this.isEditing = true;
  }
  saveChanges() {
    if (this.user.email && this.user.password) {
      console.log(this.user);
      console.log(this.student);
      this.studentService.updateStudentData(this.student).subscribe(() => {
        alert('Datos actualizados correctamente');
        this.isEditing = false;
      });
      this.studentService.updateUserData(this.user).subscribe(() => {
        alert('Datos actualizados correctamente');
        this.isEditing = false;
      })
    } else {
      alert('Email y contraseña son obligatorios para guardar');
    }
  }
}
