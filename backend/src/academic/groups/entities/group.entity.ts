import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Unique } from 'typeorm';
import { AcademicPeriod } from '../../academic-periods/entities/academic-period.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { StudentAssignment } from '../../../student-management/student-assignments/entities/student-assignment.entity';

@Entity('groups')
@Unique(['academicPeriodId', 'name'])
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'academic_period_id' })
    academicPeriodId: number;

    @ManyToOne(() => AcademicPeriod, (period) => period.groups)
    @JoinColumn({ name: 'academic_period_id' })
    academicPeriod: AcademicPeriod;

    @Column()
    name: string;

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

    @OneToMany(() => Subject, (subject) => subject.group)
    subjects: Subject[];

    @OneToMany(() => StudentAssignment, (assignment) => assignment.group)
    studentAssignments: StudentAssignment[];
}
