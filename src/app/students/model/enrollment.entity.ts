export class EnrollmentEntity {
  id?: number;
  idCourse: number ;
  idStudent: number;
  constructor() {
    this.idCourse = 0;
    this.idStudent = 0;
    this.id = 0;
  }
}
