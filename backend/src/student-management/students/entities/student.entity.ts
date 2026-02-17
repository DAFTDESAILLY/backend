import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StudentAssignment } from '../../student-assignments/entities/student-assignment.entity';
import { StudentRecord } from '../../student-records/entities/student-record.entity';
import { StudentShareConsent } from '../../consents/entities/student-share-consent.entity';
import { FileEntity } from '../../../files/entities/file.entity';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name' })
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ name: 'enrollment_id', nullable: true })
  enrollmentId: string;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'parent_phone', nullable: true })
  parentPhone: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

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

  @OneToMany(() => StudentAssignment, (assignment) => assignment.student)
  assignments: StudentAssignment[];

  @OneToMany(() => StudentRecord, (record) => record.student)
  records: StudentRecord[];

  @OneToMany(() => StudentShareConsent, (consent) => consent.student)
  consents: StudentShareConsent[];
}
