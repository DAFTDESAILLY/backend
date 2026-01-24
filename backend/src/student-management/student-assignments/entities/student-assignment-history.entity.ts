
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { StudentAssignment } from './student-assignment.entity';
import { User } from '../../../users/entities/user.entity';

@Entity('student_assignment_history')
export class StudentAssignmentHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_assignment_id' })
    studentAssignmentId: number;

    @ManyToOne(() => StudentAssignment)
    @JoinColumn({ name: 'student_assignment_id' })
    studentAssignment: StudentAssignment;

    @Column({
        type: 'enum',
        enum: ['assigned', 'unassigned', 'reactivated'],
    })
    action: 'assigned' | 'unassigned' | 'reactivated';

    @Column({ name: 'performed_by' })
    performedById: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'performed_by' })
    performedBy: User;

    @CreateDateColumn({ name: 'performed_at' })
    performedAt: Date;
}
