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
                    contextId: createAcademicPeriodDto.contextId, // Asegurarnos de usar contextId
                    status: 'active',
                },
            });
            if (activePeriod) {
                // throw new BadRequestException('Ya existe un periodo activo para este contexto');
                // Opcional: Desactivar el anterior automáticamente
                // await this.periodsRepository.update(activePeriod.id, { status: 'archived' });
            }
        }

        const newPeriod = this.periodsRepository.create({
            ...createAcademicPeriodDto,
            startDate: new Date(createAcademicPeriodDto.startDate),
            endDate: new Date(createAcademicPeriodDto.endDate),
        });

        return this.periodsRepository.save(newPeriod);
    }

    findAll(userId: number) {
        return this.periodsRepository.find({
            where: {
                context: { userId }
            },
            relations: ['context']
        });
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
