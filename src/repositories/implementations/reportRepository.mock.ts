import { IReportRepository } from '../interfaces/reportRepository';
import { Report } from '../../domain/models';
import { ReportType } from '../../domain/enums';
import { reports } from '../../mocks/reports/reports';

/**
 * Mock Report Repository
 * Consumer: Reports page.
 */
export class MockReportRepository implements IReportRepository {
  async getAll(): Promise<Report[]> {
    return reports;
  }

  async getById(id: string): Promise<Report | null> {
    const item = reports.find((rep) => rep.id === id);
    return item || null;
  }

  async getByType(type: ReportType): Promise<Report[]> {
    return reports.filter((rep) => rep.type === type);
  }
}
