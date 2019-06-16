import { Severity } from '../enums/severity.enum';

export interface INotification {
  id: number;
  message: string;
  severity: Severity;
}
