import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
    ) { }

    create(createStudentDto: CreateStudentDto) {
        return this.studentsRepository.save(createStudentDto);
    }

    findAll() {
        return this.studentsRepository.find();
    }

    findOne(id: number) {
        return this.studentsRepository.findOne({ where: { id } });
    }

    update(id: number, updateStudentDto: UpdateStudentDto) {
        return this.studentsRepository.update(id, updateStudentDto);
    }

    remove(id: number) {
        return this.studentsRepository.delete(id);
    }
}
