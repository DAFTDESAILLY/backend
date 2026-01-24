import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAssignmentsService } from './student-assignments.service';
import { StudentAssignmentsController } from './student-assignments.controller';
import { StudentAssignment } from './entities/student-assignment.entity';
import { StudentAssignmentHistory } from './entities/student-assignment-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAssignment, StudentAssignmentHistory])],
  controllers: [StudentAssignmentsController],
  providers: [StudentAssignmentsService],
})
export class StudentAssignmentsModule { }
