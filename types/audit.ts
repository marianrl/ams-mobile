import { AuditType } from './auditType';
import { Audited } from './audited';

export interface Audit {
  id: number;
  auditDate: string;
  idTipoAuditoria: AuditType;
  idAuditado: Audited;
}
