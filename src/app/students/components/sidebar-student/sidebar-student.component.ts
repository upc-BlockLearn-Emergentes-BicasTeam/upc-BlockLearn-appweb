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
    this.student.id = this.route.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.authService.findStudentById(this.student.id).subscribe((data:any) => {
      console.log(data);
      this.student.name = data.name;
      this.student.lastName = data.lastName;
      this.student.id=data.id;

    })
  }
}
