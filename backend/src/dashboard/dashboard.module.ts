import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Student } from '../student-management/students/entities/student.entity';
import { Group } from '../academic/groups/entities/group.entity';
import { Attendance } from '../assessments/attendance/entities/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Group, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
