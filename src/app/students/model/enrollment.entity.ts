export class EnrollmentEntity {
  id?: number;
  idCourse: number ;
  idStudent: number;
  state:string;
  average: number;
  constructor() {
    this.idCourse = 0;
    this.idStudent = 0;
    this.id = 0;
    this.state = '';
    this.average = 0;
  }
}
