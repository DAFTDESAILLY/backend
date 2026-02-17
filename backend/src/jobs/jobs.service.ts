import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { AcademicPeriod } from '../academic/academic-periods/entities/academic-period.entity';
import { Repository, LessThan } from 'typeorm';

@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);

  constructor(
    @InjectRepository(AcademicPeriod)
    private periodsRepository: Repository<AcademicPeriod>,
  ) {}

  // Archivado automático (cron diario)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleAutomaticArchiving() {
    this.logger.debug('Running automatic archiving of academic periods...');
    const today = new Date();

    // Find active periods that ended
    const expiredPeriods = await this.periodsRepository.find({
      where: {
        status: 'active',
        endDate: LessThan(today),
      },
    });

    for (const period of expiredPeriods) {
      period.status = 'archived';
      await this.periodsRepository.save(period);
      this.logger.log(`Archived period ${period.id} - ${period.type}`);
    }
  }

  // Limpieza de refresh tokens (cron semanal)
  @Cron(CronExpression.EVERY_WEEK)
  async handleTokenCleanup() {
    this.logger.debug('Running cleanup of refresh tokens...');
    // Implementation would depend on storage strategy.
    // Since we store in User column, we might just log or check last login if tracked.
    // Placeholder as per current User entity structure.
  }
}
