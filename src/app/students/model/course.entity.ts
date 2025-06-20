export class CourseEntity {
  id?: number;
  idTeacher: number ;
  name: string;
  section:string;
  passingGrade: number;
  constructor() {
    this.idTeacher = 0;
    this.name = '';
    this.id = 0;
    this.section = '';
    this.passingGrade = 0;
  }
}
