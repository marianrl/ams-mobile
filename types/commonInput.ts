export interface CommonInput {
  id: number;
  lastName: string;
  name: string;
  cuil: number;
  file: number;
  allocation: string;
  client: { client: string };
  uoc: string;
  branch: { branch: string };
  admissionDate: string;
  features: {
    id: number;
    auditType: { id: number; auditType: string };
    answer: { id: number; answer: string };
  };
  audit: {
    id: number;
    auditNumber: number;
    auditDate: string;
    idTipoAuditoria: { id: number; auditType: string };
    idAuditado: { id: number; audited: string };
  };
}
