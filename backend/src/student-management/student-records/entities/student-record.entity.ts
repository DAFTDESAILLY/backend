import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Context } from '../../../academic/contexts/entities/context.entity';
import { AcademicPeriod } from '../../../academic/academic-periods/entities/academic-period.entity';
import { StudentRecordReply } from './student-record-reply.entity';

@Entity('student_records')
export class StudentRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_id' })
    studentId: number;

    @ManyToOne(() => Student, (student) => student.records)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'context_id' })
    contextId: number;

    @ManyToOne(() => Context, (context) => context.studentRecords, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'context_id' })
    context: Context;

    @Column({ name: 'academic_period_id', nullable: true })
    academicPeriodId: number;

    @ManyToOne(() => AcademicPeriod)
    @JoinColumn({ name: 'academic_period_id' })
    academicPeriod: AcademicPeriod;

    @Column({
        type: 'enum',
        enum: ['conducta', 'tutoría', 'médico', 'cognitivo', 'familiar', 'académico'],
    })
    type: string;

    @Column({ name: 'date', type: 'date', nullable: true })
    date: Date;

    @Column({ length: 255, nullable: true })
    title: string;

    @Column({ type: 'text' })
    description: string;

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

    @OneToMany(() => StudentRecordReply, (reply) => reply.studentRecord)
    replies: StudentRecordReply[];
}
