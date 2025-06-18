import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {StudentService} from '../../services/student.service';

@Component({
  selector: 'app-profile-student',
  imports: [
    FormsModule
  ],
  templateUrl: './profile-student.component.html',
  styleUrl: './profile-student.component.css'
})
export class ProfileStudentComponent implements OnInit {
  student: any = {};
  studentId!: number;

  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    const param = this.route.snapshot.parent?.paramMap.get('id') || '';
    this.studentId = parseInt(param.split('-')[0], 10);

    this.studentService.getStudentById(this.studentId).subscribe((data) => {
      this.student = data;
    });
  }

  saveChanges() {
    // Para actualizar, si deseas:
    // this.studentService.updateStudent(this.studentId, this.student).subscribe(...)
    alert('Datos actualizados localmente');
  }
}
