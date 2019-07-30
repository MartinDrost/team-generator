import { Severity } from '../enums/severity.enum';

export interface INotification {
  id?: number;
  imagePath?: string;
  message: string;
  severity: Severity;
  action?: React.ReactElement;
  duration?: number;
}
