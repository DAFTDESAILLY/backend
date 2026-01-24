import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
    getSummary() {
        return {
            studentsCount: 100, // Mock
            groupsCount: 5,
            attendanceRate: 95,
        };
    }

    getRecentActivity() {
        return [
            { action: 'Period Created', date: new Date() },
            { action: 'Student Assigned', date: new Date() },
        ];
    }

    getAlerts() {
        return [
            { type: 'warning', message: 'Period ending soon' },
        ];
    }
}
