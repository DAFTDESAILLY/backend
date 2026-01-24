import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { AcademicPeriod } from '../../academic-periods/entities/academic-period.entity';
import { StudentRecord } from '../../../student-management/student-records/entities/student-record.entity';

@Entity('contexts')
export class Context {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User, (user) => user.contexts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    name: string;

    @Column()
    level: string;

    @Column({ nullable: true })
    institution: string;

    @Column({
        type: 'enum',
        enum: ['active', 'archived', 'inactive'],
        default: 'active',
    })
    status: 'active' | 'archived' | 'inactive';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => AcademicPeriod, (period) => period.context)
    academicPeriods: AcademicPeriod[];

    @OneToMany(() => StudentRecord, (record) => record.context)
    studentRecords: StudentRecord[];
}
