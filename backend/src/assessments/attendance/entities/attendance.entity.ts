import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { StudentAssignment } from '../../../student-management/student-assignments/entities/student-assignment.entity';
import { Subject } from '../../../academic/subjects/entities/subject.entity';
import { User } from '../../../users/entities/user.entity';

@Entity('attendance')
@Index(['studentAssignmentId', 'date'])
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_assignment_id' })
    studentAssignmentId: number;

    @Column({ name: 'user_id' })
    userId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => StudentAssignment, (assignment) => assignment.attendances)
    @JoinColumn({ name: 'student_assignment_id' })
    studentAssignment: StudentAssignment;

    @Column({ name: 'subject_id', nullable: true })
    subjectId: number;

    @ManyToOne(() => Subject, (subject) => subject.attendances, { nullable: true })
    @JoinColumn({ name: 'subject_id' })
    subject: Subject;

    @Column({ type: 'date' })
    date: Date;

    @Column({
        type: 'enum',
        enum: ['present', 'absent', 'late', 'excused'],
    })
    status: 'present' | 'absent' | 'late' | 'excused';

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
