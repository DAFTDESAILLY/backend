import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationsService } from './evaluations.service';
import { EvaluationsController } from './evaluations.controller';
import { EvaluationItem } from './entities/evaluation-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EvaluationItem])],
  controllers: [EvaluationsController],
  providers: [EvaluationsService],
})
export class EvaluationsModule { }
