import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { StudentAssignment } from '../../student-management/student-assignments/entities/student-assignment.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';
import { NotificationsModule } from '../../notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, StudentAssignment, Subject]), NotificationsModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule { }
