import { Role } from './role';

export interface User {
  id: number;
  name: string;
  lastName: string;
  mail: string;
  password: string;
  role: Role;
}
