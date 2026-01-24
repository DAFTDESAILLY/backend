import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';
import { UpdateStudentRecordDto } from './dto/update-student-record.dto';
import { StudentRecord } from './entities/student-record.entity';

@Injectable()
export class StudentRecordsService {
    constructor(
        @InjectRepository(StudentRecord)
        private recordsRepository: Repository<StudentRecord>,
    ) { }

    create(createDto: CreateStudentRecordDto) {
        return this.recordsRepository.save(createDto);
    }

    findAll() {
        return this.recordsRepository.find();
    }

    findOne(id: number) {
        return this.recordsRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateStudentRecordDto) {
        return this.recordsRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.recordsRepository.delete(id);
    }
}
