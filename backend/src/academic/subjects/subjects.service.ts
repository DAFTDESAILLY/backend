import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';

@Injectable()
export class SubjectsService {
    constructor(
        @InjectRepository(Subject)
        private subjectsRepository: Repository<Subject>,
    ) { }

    create(createSubjectDto: CreateSubjectDto) {
        return this.subjectsRepository.save(createSubjectDto);
    }

    findAll(userId: number) {
        return this.subjectsRepository.find({
            where: {
                group: {
                    academicPeriod: {
                        context: {
                            userId
                        }
                    }
                }
            },
            relations: ['group', 'group.academicPeriod', 'group.academicPeriod.context']
        });
    }

    findOne(id: number) {
        return this.subjectsRepository.findOne({ where: { id } });
    }

    async update(id: number, rawData: any) {
        console.log(`[SubjectsService] Actualizando materia ${id} con payload:`, rawData);

        // Si incluye gradingScale, asegurarnos de forzar su guardado saltándonos los bugs de TypeORM
        if (rawData.gradingScale) {
            console.log(`[SubjectsService] Forzando escritura de gradingScale en DB:`, rawData.gradingScale);
            await this.subjectsRepository.query(
                `UPDATE subjects SET grading_scale = ? WHERE id = ?`,
                [JSON.stringify(rawData.gradingScale), id]
            );
        }

        const subject = await this.subjectsRepository.findOne({ where: { id } });
        if (subject) {
            // Asignar el resto de las propiedades si existen
            const { gradingScale, ...rest } = rawData;
            if (Object.keys(rest).length > 0) {
                Object.assign(subject, rest);
                await this.subjectsRepository.save(subject);
            }
            return this.subjectsRepository.findOne({ where: { id } }); // Devolver el registro completo actualizado
        }
        return this.subjectsRepository.update(id, rawData);
    }

    remove(id: number) {
        return this.subjectsRepository.delete(id);
    }
}
