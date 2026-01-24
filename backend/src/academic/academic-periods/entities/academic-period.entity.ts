import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Context } from '../../contexts/entities/context.entity';
import { Group } from '../../groups/entities/group.entity';
import { EvaluationItem } from '../../../assessments/evaluations/entities/evaluation-item.entity';
import { FileEntity } from '../../../files/entities/file.entity'; // Forward ref might be needed
import { StudentRecord } from '../../../student-management/student-records/entities/student-record.entity';

@Entity('academic_periods')
export class AcademicPeriod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'context_id' })
    contextId: number;

    @ManyToOne(() => Context, (context) => context.academicPeriods)
    @JoinColumn({ name: 'context_id' })
    context: Context;

    @Column()
    type: string;

    @Column({ name: 'start_date', type: 'date' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'date' })
    endDate: Date;

    @Column({ name: 'grace_period_days', default: 0 })
    gracePeriodDays: number;

    @Column({
        type: 'enum',
        enum: ['active', 'archived'],
        default: 'active',
    })
    status: 'active' | 'archived';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => Group, (group) => group.academicPeriod)
    groups: Group[];

    @OneToMany(() => EvaluationItem, (item) => item.academicPeriod)
    evaluationItems: EvaluationItem[];
}
