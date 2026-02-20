import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from './entities/student.entity';
import { StudentAssignment } from '../student-assignments/entities/student-assignment.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        @InjectRepository(StudentAssignment)
        private studentAssignmentRepository: Repository<StudentAssignment>,
    ) { }

    async getStudentsByGroup(groupId: number) {
        const assignments = await this.studentAssignmentRepository.find({
            where: { group: { id: groupId } },
            relations: ['student'],
        });

        if (!assignments || assignments.length === 0) {
            throw new NotFoundException(`No students found for group ${groupId}`);
        }

        return assignments.map(assignment => {
            const student = assignment.student;
            const nameParts = student.fullName ? student.fullName.split(' ') : ['', ''];

            return {
                assignmentId: assignment.id,           // ✅ ID de la relación estudiante-grupo
                id: student.id,
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' ') || nameParts[1] || '',
                fullName: student.fullName,
                email: student.email,
                enrollmentId: student.enrollmentId,
                address: student.address,
                birthDate: student.birthDate,
                parentPhone: student.parentPhone,
                notes: student.notes,
                status: student.status,
                createdAt: student.createdAt,
                updatedAt: student.updatedAt
            };
        });
    }

    create(createStudentDto: CreateStudentDto, userId?: number) {
        // Construct fullName from fullName OR firstName and lastName
        const fullName = createStudentDto.fullName || `${createStudentDto.firstName} ${createStudentDto.lastName}`;

        const student = this.studentsRepository.create({
            fullName,
            createdBy: userId,
            email: createStudentDto.email,
            address: createStudentDto.address,
            enrollmentId: createStudentDto.studentId,
            parentPhone: createStudentDto.phone,
            birthDate: createStudentDto.dateOfBirth ? new Date(createStudentDto.dateOfBirth) : undefined,
            notes: createStudentDto.notes,
            status: createStudentDto.status || 'active',
        });
        return this.studentsRepository.save(student);
    }

    async findAll(userId: number) {
        // Opción 1: Estudiantes creados por el usuario
        const createdByQuery = this.studentsRepository.createQueryBuilder('student')
            .where('student.createdBy = :userId', { userId })
            .getMany();

        // Opción 2: Estudiantes asignados a grupos del usuario
        const assignedQuery = this.studentsRepository.createQueryBuilder('student')
            .innerJoin('student.assignments', 'assignment')
            .innerJoin('assignment.group', 'group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .getMany();

        const [created, assigned] = await Promise.all([createdByQuery, assignedQuery]);

        // Unir y eliminar duplicados
        const allStudents = [...created, ...assigned];
        const uniqueStudents = Array.from(new Map(allStudents.map(s => [s.id, s])).values());

        return uniqueStudents;
    }

    findOne(id: number) {
        return this.studentsRepository.findOne({ where: { id } });
    }

    update(id: number, updateStudentDto: UpdateStudentDto) {
        const dataToUpdate: any = {};

        if (updateStudentDto.fullName) {
            dataToUpdate.fullName = updateStudentDto.fullName;
        } else if (updateStudentDto.firstName && updateStudentDto.lastName) {
            dataToUpdate.fullName = `${updateStudentDto.firstName} ${updateStudentDto.lastName}`;
        }

        if (updateStudentDto.email) dataToUpdate.email = updateStudentDto.email;
        if (updateStudentDto.address) dataToUpdate.address = updateStudentDto.address;
        if (updateStudentDto.studentId) dataToUpdate.enrollmentId = updateStudentDto.studentId;
        if (updateStudentDto.phone) dataToUpdate.parentPhone = updateStudentDto.phone;
        if (updateStudentDto.dateOfBirth) dataToUpdate.birthDate = new Date(updateStudentDto.dateOfBirth);
        if (updateStudentDto.notes) dataToUpdate.notes = updateStudentDto.notes;
        // if (updateStudentDto.status) dataToUpdate.status = updateStudentDto.status; // Commented out as status might not be in entity yet.

        return this.studentsRepository.update(id, dataToUpdate);
    }

    remove(id: number) {
        return this.studentsRepository.delete(id);
    }
}
