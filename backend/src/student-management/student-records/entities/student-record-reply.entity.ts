
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StudentRecord } from './student-record.entity';

@Entity('student_record_replies')
export class StudentRecordReply {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_record_id' })
    studentRecordId: number;

    @ManyToOne(() => StudentRecord)
    @JoinColumn({ name: 'student_record_id' })
    studentRecord: StudentRecord;

    @Column({ name: 'reply_text', type: 'text' })
    replyText: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
