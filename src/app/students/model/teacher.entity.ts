export class TeacherEntity {
  id?: number;
  idUser: number ;
  idInstitution: number;
  name: string;
  lastName: string;
  telephone: string;


  constructor() {
    this.name = '';
    this.lastName = '';
    this.telephone = '';
    this.idUser = 0;
    this.idInstitution = 0;
    this.id = 0;
  }
}
