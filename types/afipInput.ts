import { Audit } from './audit';
import { Branch } from './branch';
import { Client } from './client';
import { Features } from './features';

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
  admissionDate: string; // Will be in "dd-MM-yyyy" format
  features: Features;
  audit: Audit;
}
