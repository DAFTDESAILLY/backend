import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsService } from './jobs.service';
import { AcademicPeriod } from '../academic/academic-periods/entities/academic-period.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicPeriod])],
  providers: [JobsService],
})
export class JobsModule {}
