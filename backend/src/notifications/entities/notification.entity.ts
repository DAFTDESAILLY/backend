import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({ type: 'enum', enum: ['info', 'success', 'warning', 'error', 'agenda'], default: 'info' })
    type: string;

    @Column({ name: 'is_read', default: false })
    isRead: boolean;

    @Column({ name: 'action_url', nullable: true })
    actionUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
