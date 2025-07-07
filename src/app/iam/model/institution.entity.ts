export class InstitutionEntity {
  id?: number;
  name: string;
  userId: number; // Cambiamos 'idUser' a 'userId' para que coincida con la API
  logoUrl?: string;
  address?: string;
  email?: string;
  phone?: string;

  constructor() {
    this.name = '';
    this.userId = 0;
  }
}
