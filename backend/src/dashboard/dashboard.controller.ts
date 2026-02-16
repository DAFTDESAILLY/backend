import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary() {
        return this.dashboardService.getSummary();
    }

    @Get('recent-activity')
    getRecentActivity() {
        return this.dashboardService.getRecentActivity();
    }

    @Get('alerts')
    getAlerts() {
        return this.dashboardService.getAlerts();
    }

    // Aliases for frontend compatibility
    @Get('stats')
    getStats() {
        return this.dashboardService.getSummary();
    }

    @Get('activity')
    getActivity() {
        return this.dashboardService.getRecentActivity();
    }
}
