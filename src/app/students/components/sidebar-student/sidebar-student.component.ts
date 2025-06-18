import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';
import {StudentEntity} from '../../model/student.entity';
import {AuthService} from '../../../iam/services/auth.service';

@Component({
  selector: 'app-sidebar-student',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar-student.component.html',
  styleUrl: './sidebar-student.component.css'
})
export class SidebarStudentComponent implements OnInit{
  student: StudentEntity = new StudentEntity();
  constructor(private route: ActivatedRoute,
              private authService: AuthService,) {
    this.student.idUser = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.authService.findStudentByIdUser(this.student.idUser).subscribe((data:any) => {
      console.log(data);
      this.student.name = data[0].name;
      this.student.lastName = data[0].lastName;
      this.student.id=data[0].id;

    })
  }
}
