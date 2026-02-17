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
  ) {}

  create(createStudentDto: CreateStudentDto) {
    const student = this.studentsRepository.create({
      fullName: `${createStudentDto.firstName} ${createStudentDto.lastName}`,
      email: createStudentDto.email,
      address: createStudentDto.address,
      enrollmentId: createStudentDto.studentId,
      parentPhone: createStudentDto.phone,
      birthDate: createStudentDto.dateOfBirth
        ? new Date(createStudentDto.dateOfBirth)
        : undefined,
      notes: createStudentDto.notes,
      status: createStudentDto.status || 'active',
    });
    return this.studentsRepository.save(student);
  }

  findAll() {
    return this.studentsRepository.find();
  }

  findOne(id: number) {
    return this.studentsRepository.findOne({ where: { id } });
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    const dataToUpdate: any = {};

    if (updateStudentDto.firstName && updateStudentDto.lastName) {
      dataToUpdate.fullName = `${updateStudentDto.firstName} ${updateStudentDto.lastName}`;
    }

    if (updateStudentDto.email) dataToUpdate.email = updateStudentDto.email;
    if (updateStudentDto.address)
      dataToUpdate.address = updateStudentDto.address;
    if (updateStudentDto.studentId)
      dataToUpdate.enrollmentId = updateStudentDto.studentId;
    if (updateStudentDto.phone)
      dataToUpdate.parentPhone = updateStudentDto.phone;
    if (updateStudentDto.dateOfBirth)
      dataToUpdate.birthDate = new Date(updateStudentDto.dateOfBirth);
    if (updateStudentDto.notes) dataToUpdate.notes = updateStudentDto.notes;
    if (updateStudentDto.status) dataToUpdate.status = updateStudentDto.status;

    return this.studentsRepository.update(id, dataToUpdate);
  }

  remove(id: number) {
    return this.studentsRepository.delete(id);
  }
}
