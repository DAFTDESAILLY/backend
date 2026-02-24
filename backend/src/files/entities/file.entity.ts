import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'folder_id', nullable: true })
    folderId: number;

    @Column({ name: 'student_id', nullable: true })
    studentId: number;

    @Column({ name: 'academic_period_id', nullable: true })
    academicPeriodId: number;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'storage_key' })
    storageKey: string;

    @Column({ name: 'file_type' })
    fileType: string;

    @Column({ name: 'file_size', nullable: true })
    fileSize: number;

    @Column({
        name: 'file_category',
        type: 'enum',
        enum: ['evidence', 'material', 'planning'],
        default: 'material'
    })
    fileCategory: 'evidence' | 'material' | 'planning';

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
