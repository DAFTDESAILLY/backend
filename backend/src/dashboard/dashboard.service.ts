import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../student-management/students/entities/student.entity';
import { Group } from '../academic/groups/entities/group.entity';
import { Attendance } from '../assessments/attendance/entities/attendance.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Student)
        private studentRepository: Repository<Student>,
        @InjectRepository(Group)
        private groupRepository: Repository<Group>,
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
    ) { }

    async getSummary() {
        const studentsCount = await this.studentRepository.count({ where: { status: 'active' } });
        const groupsCount = await this.groupRepository.count({ where: { status: 'active' } });

        const totalAttendance = await this.attendanceRepository.count();
        const presentAttendance = await this.attendanceRepository.count({ where: { status: 'present' } });

        const attendanceRate = totalAttendance > 0
            ? Math.round((presentAttendance / totalAttendance) * 100)
            : 0;

        return {
            studentsCount,
            groupsCount,
            attendanceRate,
        };
    }

    async getRecentActivity() {
        // Combinar creación de estudiantes y grupos recientes
        const recentStudents = await this.studentRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const recentGroups = await this.groupRepository.find({
            order: { createdAt: 'DESC' },
            take: 5,
        });

        const activities = [
            ...recentStudents.map(s => ({
                action: `Student Registered: ${s.fullName}`,
                date: s.createdAt
            })),
            ...recentGroups.map(g => ({
                action: `Group Created: ${g.name}`,
                date: g.createdAt
            }))
        ];

        // Ordenar por fecha descendente y tomar los últimos 5-10
        return activities.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 10);
    }

    getAlerts() {
        return [
            { type: 'info', message: 'System running normally' },
        ];
    }
}
