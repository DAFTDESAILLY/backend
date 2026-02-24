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

    async update(id: number, updateSubjectDto: UpdateSubjectDto) {
        console.log(`[SubjectsService] Actualizando materia ${id} con payload:`, updateSubjectDto);

        // Preload para parsear correctamente las columnas JSON antes de hacer el query a MySQL
        const preloaded = await this.subjectsRepository.preload({
            id,
            ...updateSubjectDto
        });

        if (preloaded) {
            await this.subjectsRepository.save(preloaded);
        }

        return this.subjectsRepository.findOne({
            where: { id },
            relations: ['group', 'group.academicPeriod', 'group.academicPeriod.context']
        });
    }

    remove(id: number) {
        return this.subjectsRepository.delete(id);
    }
}
