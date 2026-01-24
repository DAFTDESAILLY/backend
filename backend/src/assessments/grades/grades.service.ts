import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { Grade } from './entities/grade.entity';

@Injectable()
export class GradesService {
    constructor(
        @InjectRepository(Grade)
        private gradesRepository: Repository<Grade>,
    ) { }

    create(createDto: CreateGradeDto) {
        return this.gradesRepository.save(createDto);
    }

    findAll() {
        return this.gradesRepository.find();
    }

    findOne(id: number) {
        return this.gradesRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateGradeDto) {
        return this.gradesRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.gradesRepository.delete(id);
    }
}
