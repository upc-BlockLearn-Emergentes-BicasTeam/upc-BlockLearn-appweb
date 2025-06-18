export class InstitutionEntity {
  id?: number;
  name: string;
  idUser: number | null;

  constructor() {
    this.name = '';
    this.idUser = null;
  }
}
