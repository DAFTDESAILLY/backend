import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Group } from '../../groups/entities/group.entity';
import { EvaluationItem } from '../../../assessments/evaluations/entities/evaluation-item.entity';
import { Attendance } from '../../../assessments/attendance/entities/attendance.entity';

@Entity('subjects')
export class Subject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'group_id' })
    groupId: number;

    @ManyToOne(() => Group, (group) => group.subjects)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column()
    name: string;

    @Column({ name: 'is_general', default: true })
    isGeneral: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => EvaluationItem, (item) => item.subject)
    evaluationItems: EvaluationItem[];

    @OneToMany(() => Attendance, (attendance) => attendance.subject)
    attendances: Attendance[];

    @Column({ type: 'json', nullable: true, name: 'grading_scale' })
    gradingScale: Record<string, number>;
}
