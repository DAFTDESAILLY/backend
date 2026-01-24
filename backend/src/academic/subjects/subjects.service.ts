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

    findAll() {
        return this.subjectsRepository.find();
    }

    findOne(id: number) {
        return this.subjectsRepository.findOne({ where: { id } });
    }

    update(id: number, updateSubjectDto: UpdateSubjectDto) {
        return this.subjectsRepository.update(id, updateSubjectDto);
    }

    remove(id: number) {
        return this.subjectsRepository.delete(id);
    }
}
