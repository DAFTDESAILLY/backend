import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
    ) { }

    async create(createDto: CreateAttendanceDto, userId: number) {
        await this.resolveStudentAssignment(createDto);
        // Ensure date is in YYYY-MM-DD format to avoid MySQL errors
        if (createDto.date && typeof createDto.date === 'string' && createDto.date.includes('T')) {
            createDto.date = createDto.date.split('T')[0];
        }
        createDto.userId = userId;
        return this.attendanceRepository.save(createDto);
    }

    async createBatch(createDtos: CreateAttendanceDto[], userId: number) {
        // Resolver assignment IDs for all items
        for (const dto of createDtos) {
            await this.resolveStudentAssignment(dto);
            // Ensure date is in YYYY-MM-DD format to avoid MySQL errors
            if (dto.date && typeof dto.date === 'string' && dto.date.includes('T')) {
                dto.date = dto.date.split('T')[0];
            }
            dto.userId = userId;
        }
        return this.attendanceRepository.save(createDtos);
    }

    private async resolveStudentAssignment(dto: CreateAttendanceDto) {
        if (!dto.studentAssignmentId) {
            let groupId = dto.groupId;

            // If subjectId is provided, get groupId from subject
            if (dto.subjectId) {
                const subject = await this.subjectRepository.findOne({ where: { id: dto.subjectId } });
                if (!subject) throw new NotFoundException(`Subject with ID ${dto.subjectId} not found`);
                groupId = subject.groupId;
            }

            if (!groupId) {
                throw new BadRequestException('Either subjectId or groupId must be provided to record attendance');
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
                throw new BadRequestException(`Student ${dto.studentId} is not assigned to group ${groupId}`);
            }

            dto.studentAssignmentId = assignment.id;
        }
    }

    async findAll(userId: number, filters?: any) {
        const whereConditions: any = {
            userId: userId
        };

        // Apply additional filters if provided
        if (filters) {
            if (filters.subjectId) {
                whereConditions.subjectId = filters.subjectId;
            }
            if (filters.date) {
                whereConditions.date = filters.date;
            }
        }

        // Get attendances with related data
        const queryBuilder = this.attendanceRepository
            .createQueryBuilder('attendance')
            .leftJoinAndSelect('attendance.studentAssignment', 'studentAssignment')
            .leftJoinAndSelect('studentAssignment.student', 'student')
            .leftJoinAndSelect('studentAssignment.group', 'group')
            .leftJoinAndSelect('attendance.subject', 'subject')
            .leftJoinAndSelect('attendance.user', 'user')
            .where('attendance.userId = :userId', { userId });

        // Apply additional filters
        if (filters?.subjectId) {
            queryBuilder.andWhere('attendance.subjectId = :subjectId', { subjectId: filters.subjectId });
        }
        if (filters?.date) {
            queryBuilder.andWhere('attendance.date = :date', { date: filters.date });
        }
        if (filters?.groupId) {
            queryBuilder.andWhere('group.id = :groupId', { groupId: filters.groupId });
        }
        if (filters?.studentId) {
            queryBuilder.andWhere('student.id = :studentId', { studentId: filters.studentId });
        }

        queryBuilder.orderBy('attendance.date', 'DESC');

        const attendances = await queryBuilder.getMany();

        return attendances;
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
