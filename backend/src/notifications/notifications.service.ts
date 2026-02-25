import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
    ) { }

    async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
        const notification = this.notificationsRepository.create(createNotificationDto);
        return this.notificationsRepository.save(notification);
    }

    async findAllForUser(userId: number): Promise<Notification[]> {
        return this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50, // max array items to return for UI brevity
        });
    }

    async getUnreadCount(userId: number): Promise<number> {
        return this.notificationsRepository.count({
            where: { userId, isRead: false },
        });
    }

    async markAsRead(id: number, userId: number): Promise<Notification> {
        const notification = await this.notificationsRepository.findOne({
            where: { id, userId },
        });

        if (!notification) {
            throw new NotFoundException(`Notification with ID ${id} not found`);
        }

        notification.isRead = true;
        return this.notificationsRepository.save(notification);
    }

    async markAllAsRead(userId: number): Promise<void> {
        await this.notificationsRepository.update(
            { userId, isRead: false },
            { isRead: true },
        );
    }
}
