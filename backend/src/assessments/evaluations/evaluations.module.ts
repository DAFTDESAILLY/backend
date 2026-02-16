import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationItem } from './entities/evaluation-item.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationItem, Subject])],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
})
export class EvaluationsModule { }
