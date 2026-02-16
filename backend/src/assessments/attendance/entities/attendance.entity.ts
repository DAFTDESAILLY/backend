import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { StudentAssignment } from '../../../student-management/student-assignments/entities/student-assignment.entity';
import { Subject } from '../../../academic/subjects/entities/subject.entity';

@Entity('attendance')
@Index(['studentAssignmentId', 'date'])
export class Attendance {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_assignment_id' })
    studentAssignmentId: number;

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
        enum: ['present', 'absent', 'late'],
    })
    status: 'present' | 'absent' | 'late'; // 'present', 'absent', etc.

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
