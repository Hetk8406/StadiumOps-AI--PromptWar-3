import { IReportRepository } from '../../repositories/interfaces/reportRepository';
import { Report } from '../../domain/models';
import { ReportType } from '../../domain/enums';

export interface ReportSummary {
  totalGenerated: number;
  completedCount: number;
  processingCount: number;
}

/**
 * Historical Incident & Operations Audit Report Service
 */
export class ReportService {
  constructor(private reportRepo: IReportRepository) {}

  async getAllReports(): Promise<Report[]> {
    return this.reportRepo.getAll();
  }

  async getReportSummary(): Promise<ReportSummary> {
    const list = await this.reportRepo.getAll();
    const completedCount = list.filter((r) => r.status === 'Completed').length;
    const processingCount = list.filter((r) => r.status === 'Processing').length;

    return {
      totalGenerated: list.length,
      completedCount,
      processingCount,
    };
  }

  async getReportsByType(type: ReportType): Promise<Report[]> {
    return this.reportRepo.getByType(type);
  }
}
