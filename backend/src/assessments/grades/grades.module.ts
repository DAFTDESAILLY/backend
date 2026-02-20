import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { Grade } from './entities/grade.entity';
import { StudentAssignment } from '../../student-management/student-assignments/entities/student-assignment.entity';
import { EvaluationItem } from '../evaluations/entities/evaluation-item.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';
import { Group } from '../../academic/groups/entities/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grade, StudentAssignment, EvaluationItem, Subject, Group])],
  controllers: [GradesController],
  providers: [GradesService],
})
export class GradesModule { }
