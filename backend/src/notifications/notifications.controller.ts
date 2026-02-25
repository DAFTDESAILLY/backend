import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    create(@Body() createNotificationDto: CreateNotificationDto, @Req() req: any) {
        // Only internal logic or Admins should ideally use this externally.
        // Overriding userId with the requester just in case for basic security.
        createNotificationDto.userId = req.user['sub'];
        return this.notificationsService.create(createNotificationDto);
    }

    @Get()
    findAll(@Req() req: any) {
        const userId = req.user['sub'];
        return this.notificationsService.findAllForUser(userId);
    }

    @Get('unread/count')
    async getUnreadCount(@Req() req: any) {
        const userId = req.user['sub'];
        const count = await this.notificationsService.getUnreadCount(userId);
        return { count };
    }

    @Patch('read-all')
    markAllAsRead(@Req() req: any) {
        const userId = req.user['sub'];
        return this.notificationsService.markAllAsRead(userId);
    }

    @Patch(':id/read')
    markAsRead(@Param('id') id: string, @Req() req: any) {
        const userId = req.user['sub'];
        return this.notificationsService.markAsRead(+id, userId);
    }
}
