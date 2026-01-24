import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../../users/entities/user.entity';
import { StudentShareConsentType } from './student-share-consent-type.entity';

@Entity('student_share_consents')
export class StudentShareConsent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'student_id' })
    studentId: number;

    @ManyToOne(() => Student, (student) => student.consents)
    @JoinColumn({ name: 'student_id' })
    student: Student;

    @Column({ name: 'from_user_id' })
    fromUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'from_user_id' })
    fromUser: User;

    @Column({ name: 'to_user_id' })
    toUserId: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'to_user_id' })
    toUser: User;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'expires_at', type: 'datetime' })
    expiresAt: Date;

    @Column({ name: 'revoked_at', type: 'datetime', nullable: true })
    revokedAt: Date;

    @OneToMany(() => StudentShareConsentType, (type) => type.consent)
    types: StudentShareConsentType[];
}
