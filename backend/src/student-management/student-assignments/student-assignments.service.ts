import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentAssignmentDto } from './dto/create-student-assignment.dto';
import { UpdateStudentAssignmentDto } from './dto/update-student-assignment.dto';
import { StudentAssignment } from './entities/student-assignment.entity';
import { StudentAssignmentHistory } from './entities/student-assignment-history.entity';

@Injectable()
export class StudentAssignmentsService {
    constructor(
        @InjectRepository(StudentAssignment)
        private assignmentsRepository: Repository<StudentAssignment>,
        @InjectRepository(StudentAssignmentHistory)
        private historyRepository: Repository<StudentAssignmentHistory>,
    ) { }

    async create(createDto: CreateStudentAssignmentDto) {
        // Regla: Alumno activo solo una vez por grupo (validación backend)
        const activeAssignment = await this.assignmentsRepository.findOne({
            where: {
                studentId: createDto.studentId,
                groupId: createDto.groupId,
                status: 'active', // Assuming 'active' is the status for active assignment
            },
        });

        if (activeAssignment) {
            throw new BadRequestException('El estudiante ya tiene una asignación activa en este grupo');
        }

        const assignment = await this.assignmentsRepository.save(createDto);

        // Record history (initial assignment)
        // Need logged in user ID for 'performedBy' - usually passed from controller or context.
        // For now skipping or using system default if not passed.
        // Ideally create method should accept userId.

        return assignment;
    }

    findAll() {
        return this.assignmentsRepository.find();
    }

    findOne(id: number) {
        return this.assignmentsRepository.findOne({ where: { id } });
    }

    update(id: number, updateDto: UpdateStudentAssignmentDto) {
        return this.assignmentsRepository.update(id, updateDto);
    }

    remove(id: number) {
        return this.assignmentsRepository.delete(id);
    }
}
