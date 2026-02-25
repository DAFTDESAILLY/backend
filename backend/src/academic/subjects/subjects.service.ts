import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { Subject } from './entities/subject.entity';
import * as fs from 'fs';

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
        let debugLog = `[SubjectsService] Update id ${id}\n`;
        debugLog += `Original updateSubjectDto: ${JSON.stringify(updateSubjectDto)}\n`;

        // Preload para parsear correctamente las columnas JSON antes de hacer el query a MySQL
        const preloaded = await this.subjectsRepository.preload({
            id,
            ...updateSubjectDto
        });

        debugLog += `Preloaded object: ${JSON.stringify(preloaded)}\n`;

        if (preloaded) {
            const saved = await this.subjectsRepository.save(preloaded);
            debugLog += `Saved object: ${JSON.stringify(saved)}\n`;
        }

        const fresh = await this.subjectsRepository.findOne({
            where: { id },
            relations: ['group', 'group.academicPeriod', 'group.academicPeriod.context']
        });

        debugLog += `Fresh findOne object: ${JSON.stringify(fresh)}\n-------------------\n`;
        fs.appendFileSync('subjects-debug.log', debugLog);

        return fresh;
    }

    remove(id: number) {
        return this.subjectsRepository.delete(id);
    }
}
