import { Client } from './client';
import { Branch } from './branch';
import { Features } from './features';
import { Audit } from './audit';

export interface AfipInput {
  id: number;
  lastName: string;
  name: string;
  cuil: string;
  file: string;
  allocation: string;
  client: Client;
  uoc: string;
  branch: Branch;
  admissionDate: string;
  features: Features;
  audit: Audit;
}
