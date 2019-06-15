import { Severity } from '../enums/severity.enum';

export interface INotification {
  message: string;
  severity: Severity;
}
