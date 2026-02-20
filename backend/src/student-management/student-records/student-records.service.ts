import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentRecordDto } from './dto/create-student-record.dto';
import { UpdateStudentRecordDto } from './dto/update-student-record.dto';
import { StudentRecord } from './entities/student-record.entity';
import { Context } from '../../academic/contexts/entities/context.entity';
import { Student } from '../students/entities/student.entity';

@Injectable()
export class StudentRecordsService {
    constructor(
        @InjectRepository(StudentRecord)
        private recordsRepository: Repository<StudentRecord>,
        @InjectRepository(Context)
        private contextRepository: Repository<Context>,
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
    ) { }

    async create(createDto: CreateStudentRecordDto) {
        // Validate existence
        const context = await this.contextRepository.findOne({ where: { id: createDto.contextId } });
        if (!context) {
            throw new NotFoundException(`Context with ID ${createDto.contextId} not found`);
        }

        const student = await this.studentRepository.findOne({ where: { id: createDto.studentId } });
        if (!student) {
            throw new NotFoundException(`Student with ID ${createDto.studentId} not found`);
        }

        const record = this.recordsRepository.create(createDto);
        return await this.recordsRepository.save(record);
    }

    findAll(userId: number) {
        return this.recordsRepository.find({
            where: {
                context: {
                    userId
                }
            },
            relations: ['context']
        });
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
