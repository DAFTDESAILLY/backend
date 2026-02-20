import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { EvaluationItem } from '../../evaluations/entities/evaluation-item.entity';
import { StudentAssignment } from '../../../student-management/student-assignments/entities/student-assignment.entity';

@Entity('grades')
@Unique(['evaluationItemId', 'studentAssignmentId'])
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'evaluation_item_id' })
    evaluationItemId: number;

    @ManyToOne(() => EvaluationItem, (item) => item.grades)
    @JoinColumn({ name: 'evaluation_item_id' })
    evaluationItem: EvaluationItem;

    @Column({ name: 'student_assignment_id' })
    studentAssignmentId: number;

    @ManyToOne(() => StudentAssignment, (assignment) => assignment.grades)
    @JoinColumn({ name: 'student_assignment_id' })
    studentAssignment: StudentAssignment;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    score: number;

    @Column({ type: 'text', nullable: true })
    feedback: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
