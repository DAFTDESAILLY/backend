import { Controller, Get, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('summary')
    getSummary(@Req() req: any) {
        const userId = req.user['sub'];
        return this.dashboardService.getSummary(userId);
    }

    @Get('recent-activity')
    getRecentActivity(@Req() req: any) {
        const userId = req.user['sub'];
        return this.dashboardService.getRecentActivity(userId);
    }

    @Get('alerts')
    getAlerts() {
        return this.dashboardService.getAlerts();
    }

    // Aliases for frontend compatibility
    @Get('stats')
    getStats(@Req() req: any) {
        const userId = req.user['sub'];
        return this.dashboardService.getSummary(userId);
    }

    @Get('activity')
    getActivity(@Req() req: any) {
        const userId = req.user['sub'];
        return this.dashboardService.getRecentActivity(userId);
    }

    // Debug endpoint
    @Get('debug')
    async getDebug(@Req() req: any) {
        const userId = req.user['sub'];
        return {
            userId,
            userFromToken: req.user,
            summary: await this.dashboardService.getSummary(userId)
        };
    }
}
