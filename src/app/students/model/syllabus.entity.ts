export class SyllabusEntity {
  id?: number;
  idCourse: number ;
  hash: string;


  constructor() {
    this.idCourse = 0;
    this.hash = '';
    this.id = 0;
  }
}
