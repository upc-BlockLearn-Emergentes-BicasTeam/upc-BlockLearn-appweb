export class CourseEntity {
  id?: number;
  idTeacher: number ;
  name: string;
  constructor() {
    this.idTeacher = 0;
    this.name = '';
    this.id = 0;
  }
}
