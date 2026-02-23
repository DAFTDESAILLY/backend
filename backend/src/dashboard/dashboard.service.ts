import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student-management/students/entities/student.entity';
import { Group } from '../academic/groups/entities/group.entity';
import { Attendance } from '../assessments/attendance/entities/attendance.entity';
import { StudentAssignment } from '../student-management/student-assignments/entities/student-assignment.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(StudentAssignment)
        private studentAssignmentRepository: Repository<StudentAssignment>,
    ) { }

    async getSummary(userId: number) {
        // As of now, role is not implemented on users table. 
        // We will default isAdmin to false, or add a proper check if roles are implemented later.
        const isAdmin = false; // TODO: Implement proper admin check if needed

        let totalStudents = 0;
        let totalGroups = 0;
        let totalSubjects = 0;
        let activePeriods = 0;

        // Por practicidad actual: los periodos activos son globales
        const periodsCountResult = await this.studentRepository.manager.query(`
            SELECT COUNT(*) as count FROM academic_periods WHERE status = 'active'
        `);
        activePeriods = parseInt(periodsCountResult[0].count);

        if (isAdmin) {
            // Admin ve todo
            const sCount = await this.studentRepository.manager.query(`SELECT COUNT(*) as count FROM students`);
            totalStudents = parseInt(sCount[0].count);

            const gCount = await this.groupRepository.manager.query(`SELECT COUNT(*) as count FROM groups`);
            totalGroups = parseInt(gCount[0].count);

            const subCount = await this.studentRepository.manager.query(`SELECT COUNT(*) as count FROM subjects`);
            totalSubjects = parseInt(subCount[0].count);
        } else {
            // El profesor solo ve lo que tiene asignado
            // 1. Grupos asignados (a través de subjects o directamente dependiendo del esquema, usamos materias como base)
            const subjectsParams = await this.studentRepository.manager.query(`
                SELECT id, group_id FROM subjects WHERE teacher_id = ?
            `, [userId]);

            totalSubjects = subjectsParams.length;

            if (totalSubjects > 0) {
                const groupIds = [...new Set(subjectsParams.map((s: any) => s.group_id))].filter(id => id);
                totalGroups = groupIds.length;

                if (totalGroups > 0) {
                    const placeholders = groupIds.map(() => '?').join(',');
                    const studentsParams = await this.studentRepository.manager.query(`
                        SELECT COUNT(DISTINCT student_id) as count FROM student_assignments 
                        WHERE group_id IN (${placeholders}) AND status = 'active'
                     `, groupIds);
                    totalStudents = parseInt(studentsParams[0].count);
                }
            }
        }

        return {
            totalStudents,
            totalGroups,
            totalSubjects,
            activePeriods,
            isAdmin
        };
    }

    async getRecentActivity(userId: number) {
        // Recent students assigned to user's groups
        const recentAssignments = await this.studentAssignmentRepository.createQueryBuilder('assignment')
            .innerJoinAndSelect('assignment.student', 'student')
            .innerJoinAndSelect('assignment.group', 'group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .orderBy('assignment.createdAt', 'DESC')
            .take(5)
            .getMany();

        // Recent groups created by user
        const recentGroups = await this.groupRepository.createQueryBuilder('group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .orderBy('group.createdAt', 'DESC')
            .take(5)
            .getMany();

        const activities = [
            ...recentAssignments.map(a => ({
                action: `Student Assigned: ${a.student.fullName} to ${a.group.name}`,
                date: a.createdAt
            })),
            ...recentGroups.map(g => ({
                action: `Group Created: ${g.name}`,
                date: g.createdAt
            }))
        ];

        // Sort by date descending and take top 10
        return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
    }

    getAlerts() {
        return [
            { type: 'info', message: 'System running normally' },
        ];
    }
}
