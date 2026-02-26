import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Planning } from './entities/planning.entity';
import { CreatePlanningDto } from './dto/create-planning.dto';
import { UpdatePlanningDto } from './dto/update-planning.dto';
import { PlanningFilterDto } from './dto/planning-filter.dto';

@Injectable()
export class PlanningsService {
    constructor(
        @InjectRepository(Planning)
        private planningRepository: Repository<Planning>,
    ) { }

    async create(userId: number, createDto: CreatePlanningDto): Promise<Planning> {
        const planning = this.planningRepository.create({
            ...createDto,
            docente: { id: userId } as any,
            materia: createDto.materia_id ? { id: createDto.materia_id } as any : null,
            grupo: createDto.grupo_id ? { id: createDto.grupo_id } as any : null,
        });

        return await this.planningRepository.save(planning);
    }

    async findAll(userId: number, filters?: PlanningFilterDto): Promise<Planning[]> {
        const query = this.planningRepository
            .createQueryBuilder('planning')
            .leftJoinAndSelect('planning.docente', 'docente')
            .leftJoinAndSelect('planning.materia', 'materia')
            .leftJoinAndSelect('planning.grupo', 'grupo')
            .where('planning.docente_id = :userId', { userId });

        if (filters?.fecha_inicio) {
            query.andWhere('planning.fecha_inicio >= :fechaInicio', {
                fechaInicio: filters.fecha_inicio,
            });
        }

        if (filters?.fecha_fin) {
            query.andWhere('planning.fecha_fin <= :fechaFin', {
                fechaFin: filters.fecha_fin,
            });
        }

        if (filters?.materia_id) {
            query.andWhere('planning.materia_id = :materiaId', {
                materiaId: filters.materia_id,
            });
        }

        if (filters?.search) {
            query.andWhere('planning.titulo LIKE :search', {
                search: `%${filters.search}%`,
            });
        }

        query.orderBy('planning.created_at', 'DESC');

        return await query.getMany();
    }

    async findOne(id: number, userId: number): Promise<Planning> {
        const planning = await this.planningRepository.findOne({
            where: { id },
            relations: ['docente', 'materia', 'grupo'],
        });

        if (!planning) {
            throw new NotFoundException('Planeación no encontrada');
        }

        if (planning.docente.id !== userId) {
            throw new ForbiddenException('No tienes permiso para ver esta planeación');
        }

        return planning;
    }

    async update(
        id: number,
        userId: number,
        updateDto: UpdatePlanningDto,
    ): Promise<Planning> {
        const planning = await this.findOne(id, userId);

        Object.assign(planning, updateDto);

        if (updateDto.materia_id) {
            planning.materia = { id: updateDto.materia_id } as any;
        }

        if (updateDto.grupo_id) {
            planning.grupo = { id: updateDto.grupo_id } as any;
        }

        return await this.planningRepository.save(planning);
    }

    async remove(id: number, userId: number): Promise<void> {
        const planning = await this.findOne(id, userId);
        await this.planningRepository.remove(planning);
    }
}
