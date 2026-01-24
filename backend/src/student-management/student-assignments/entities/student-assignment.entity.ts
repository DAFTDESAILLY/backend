import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Group } from '../../../academic/groups/entities/group.entity';
import { StudentAssignmentHistory } from './student-assignment-history.entity';
import { Attendance } from '../../../assessments/attendance/entities/attendance.entity';
import { Grade } from '../../../assessments/grades/entities/grade.entity';

@Entity('student_assignments')
export class StudentAssignment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_id' })
    studentId: number;

    @ManyToOne(() => Student, (student) => student.assignments)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'group_id' })
    groupId: number;

    @ManyToOne(() => Group, (group) => group.studentAssignments)
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column({
        type: 'enum',
        enum: ['active', 'inactive'],
        default: 'active',
    })
    status: 'active' | 'inactive';

    @Column({ name: 'assigned_at', default: () => 'CURRENT_TIMESTAMP' })
    assignedAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => StudentAssignmentHistory, (history) => history.studentAssignment)
    history: StudentAssignmentHistory[];

    @OneToMany(() => Attendance, (attendance) => attendance.studentAssignment)
    attendances: Attendance[];

    @OneToMany(() => Grade, (grade) => grade.studentAssignment)
    grades: Grade[];
}
