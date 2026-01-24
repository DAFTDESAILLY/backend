import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAcademicPeriodDto } from './dto/create-academic-period.dto';
import { UpdateAcademicPeriodDto } from './dto/update-academic-period.dto';
import { AcademicPeriod } from './entities/academic-period.entity';

@Injectable()
export class AcademicPeriodsService {
    constructor(
        @InjectRepository(AcademicPeriod)
        private periodsRepository: Repository<AcademicPeriod>,
    ) { }

    async create(createAcademicPeriodDto: CreateAcademicPeriodDto) {
        // Regla: Un solo periodo activo por contexto
        const status = createAcademicPeriodDto.status || 'active';
        if (status === 'active') {
            const activePeriod = await this.periodsRepository.findOne({
                where: {
                    contextId: createAcademicPeriodDto.contextId,
                    status: 'active',
                },
            });
            if (activePeriod) {
                throw new BadRequestException('Ya existe un periodo activo para este contexto');
            }
        }

        return this.periodsRepository.save(createAcademicPeriodDto);
    }

    findAll() {
        return this.periodsRepository.find();
    }

    findOne(id: number) {
        return this.periodsRepository.findOne({ where: { id } });
    }

    update(id: number, updateAcademicPeriodDto: UpdateAcademicPeriodDto) {
        return this.periodsRepository.update(id, updateAcademicPeriodDto);
    }

    remove(id: number) {
        return this.periodsRepository.delete(id);
    }
}
