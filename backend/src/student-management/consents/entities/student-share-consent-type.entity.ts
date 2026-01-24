
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { StudentShareConsent } from './student-share-consent.entity';

@Entity('student_share_consent_types')
export class StudentShareConsentType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'consent_id' })
    consentId: number;

    @ManyToOne(() => StudentShareConsent)
    @JoinColumn({ name: 'consent_id' })
    consent: StudentShareConsent;

    @Column({
        name: 'record_type',
        type: 'enum',
        enum: ['conducta', 'tutoría', 'médico', 'cognitivo'],
    })
    recordType: 'conducta' | 'tutoría' | 'médico' | 'cognitivo';
}
