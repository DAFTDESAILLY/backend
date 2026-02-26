import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planning } from './plannings/entities/planning.entity';
import { PlanningsController } from './plannings/plannings.controller';
import { PlanningsService } from './plannings/plannings.service';
import { ExportsModule } from '../exports/exports.module';

@Module({
    imports: [TypeOrmModule.forFeature([Planning]), ExportsModule],
    controllers: [PlanningsController],
    providers: [PlanningsService],
})
export class PlanningModule { }
