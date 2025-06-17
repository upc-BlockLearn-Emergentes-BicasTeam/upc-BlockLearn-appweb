export interface Institution {
  id?: number;
  na: string;
  email: string;
  password: string;
  role: 'institucion';
  created_at?: string;
}
