import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { EvaluationItem } from './entities/evaluation-item.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';
import { Grade } from '../grades/entities/grade.entity';

@Injectable()
export class EvaluationsService {
    constructor(
        @InjectRepository(EvaluationItem)
        private itemsRepository: Repository<EvaluationItem>,
        @InjectRepository(Subject)
        private subjectRepository: Repository<Subject>,
        @InjectRepository(Grade)
        private gradesRepository: Repository<Grade>,
    ) { }

    async create(createDto: CreateEvaluationDto) {
        if (!createDto.academicPeriodId) {
            const subject = await this.subjectRepository.findOne({
                where: { id: createDto.subjectId },
                relations: ['group']
            });

            if (!subject) {
                throw new NotFoundException(`Subject with ID ${createDto.subjectId} not found`);
            }

            if (!subject.group) {
                throw new BadRequestException(`Subject ${createDto.subjectId} does not belong to a group`);
            }

            createDto.academicPeriodId = subject.group.academicPeriodId;
        }

        const evaluationData: any = {
            subjectId: createDto.subjectId,
            academicPeriodId: createDto.academicPeriodId,
            name: createDto.name,
            weight: createDto.weight,
            type: createDto.type || null,
            maxScore: createDto.maxScore || null,
            description: createDto.description || null,
            dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null
        };

        const evaluation = this.itemsRepository.create(evaluationData);
        return this.itemsRepository.save(evaluation);
    }

    findAll(userId: number) {
        return this.itemsRepository.find({
            where: {
                academicPeriod: {
                    context: { userId }
                }
            },
            relations: ['academicPeriod', 'academicPeriod.context']
        });
    }

    findBySubject(subjectId: number) {
        return this.itemsRepository.find({
            where: { subjectId },
        });
    }

    findOne(id: number) {
        return this.itemsRepository.findOne({ where: { id } });
    }

    async update(id: number, updateDto: UpdateEvaluationDto) {
        // Verificar que la evaluación existe
        const existing = await this.itemsRepository.findOne({ where: { id } });
        if (!existing) {
            throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
        }

        // Preparar datos de actualización, manejando dueDate si viene
        const updateData: any = { ...updateDto };
        if (updateDto.dueDate) {
            updateData.dueDate = new Date(updateDto.dueDate);
        }

        // Si maxScore viene como null o undefined, no lo incluyas en la actualización
        // Esto preserva el valor existente en la BD
        if (updateData.maxScore === null || updateData.maxScore === undefined) {
            delete updateData.maxScore;
        }

        await this.itemsRepository.update(id, updateData);
        return this.itemsRepository.findOne({ where: { id } });
    }

    async remove(id: number) {
        // Verificar si existen calificaciones asociadas
        const gradesCount = await this.gradesRepository.count({
            where: { evaluationItemId: id }
        });

        if (gradesCount > 0) {
            throw new ConflictException(
                `No se puede eliminar esta evaluación porque tiene ${gradesCount} calificación(es) asociada(s). Elimina las calificaciones primero.`
            );
        }

        return this.itemsRepository.delete(id);
    }
}
