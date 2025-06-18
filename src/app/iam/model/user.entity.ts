export class UserEntity {
  id?: number;
  email: string;
  password: string;

  constructor() {
    this.email = '';
    this.password = '';
  }
}
