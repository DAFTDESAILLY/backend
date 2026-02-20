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
        // Count active groups for the user
        const groupsCount = await this.groupRepository.createQueryBuilder('group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .andWhere('group.status = :status', { status: 'active' })
            .getCount();

        // Count distinct active students for the user
        const result = await this.studentAssignmentRepository.createQueryBuilder('assignment')
            .innerJoin('assignment.group', 'group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .andWhere('assignment.status = :status', { status: 'active' })
            .select('COUNT(DISTINCT assignment.student_id)', 'count')
            .getRawOne();
        
        const studentsCount = parseInt(result?.count || '0', 10);

        // Attendance stats for user's groups
        const totalAttendance = await this.attendanceRepository.createQueryBuilder('attendance')
            .innerJoin('attendance.studentAssignment', 'assignment')
            .innerJoin('assignment.group', 'group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .getCount();

        const presentAttendance = await this.attendanceRepository.createQueryBuilder('attendance')
            .innerJoin('attendance.studentAssignment', 'assignment')
            .innerJoin('assignment.group', 'group')
            .innerJoin('group.academicPeriod', 'period')
            .innerJoin('period.context', 'context')
            .where('context.userId = :userId', { userId })
            .andWhere('attendance.status = :status', { status: 'present' })
            .getCount();

        const attendanceRate = totalAttendance > 0
            ? Math.round((presentAttendance / totalAttendance) * 100)
            : 0;

        return {
            studentsCount,
            groupsCount,
            attendanceRate,
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
