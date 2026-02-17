import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { StudentAssignment } from '../../student-management/student-assignments/entities/student-assignment.entity';
import { Subject } from '../../academic/subjects/entities/subject.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(StudentAssignment)
    private studentAssignmentRepository: Repository<StudentAssignment>,
    @InjectRepository(Subject)
    private subjectRepository: Repository<Subject>,
  ) {}

  async create(createDto: CreateAttendanceDto) {
    await this.resolveStudentAssignment(createDto);
    return this.attendanceRepository.save(createDto);
  }

  async createBatch(createDtos: CreateAttendanceDto[]) {
    // Resolver assignment IDs for all items
    for (const dto of createDtos) {
      await this.resolveStudentAssignment(dto);
    }
    return this.attendanceRepository.save(createDtos);
  }

  private async resolveStudentAssignment(dto: CreateAttendanceDto) {
    if (!dto.studentAssignmentId) {
      let groupId = dto.groupId;

      // If subjectId is provided, get groupId from subject
      if (dto.subjectId) {
        const subject = await this.subjectRepository.findOne({
          where: { id: dto.subjectId },
        });
        if (!subject)
          throw new NotFoundException(
            `Subject with ID ${dto.subjectId} not found`,
          );
        groupId = subject.groupId;
      }

      if (!groupId) {
        throw new BadRequestException(
          'Either subjectId or groupId must be provided to record attendance',
        );
      }

      // Find assignment by studentId and groupId
      const assignment = await this.studentAssignmentRepository.findOne({
        where: {
          studentId: dto.studentId,
          groupId: groupId,
          status: 'active',
        },
      });

      if (!assignment) {
        throw new BadRequestException(
          `Student ${dto.studentId} is not assigned to group ${groupId}`,
        );
      }

      dto.studentAssignmentId = assignment.id;
    }
  }

  findAll() {
    return this.attendanceRepository.find();
  }

  findOne(id: number) {
    return this.attendanceRepository.findOne({ where: { id } });
  }

  update(id: number, updateDto: UpdateAttendanceDto) {
    return this.attendanceRepository.update(id, updateDto);
  }

  remove(id: number) {
    return this.attendanceRepository.delete(id);
  }
}
