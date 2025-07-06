export class UserEntity {
  id?: number;
  email: string;
  password: string;
  role: string; // "institution", "teacher", "student"

  constructor() {
    this.email = '';
    this.password = '';
    this.role = '';
  }
}
