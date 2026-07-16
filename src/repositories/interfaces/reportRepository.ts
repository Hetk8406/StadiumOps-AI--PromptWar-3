import { Report } from '../../domain/models';
import { ReportType } from '../../domain/enums';

export interface IReportRepository {
  getAll(): Promise<Report[]>;
  getById(id: string): Promise<Report | null>;
  getByType(type: ReportType): Promise<Report[]>;
}
