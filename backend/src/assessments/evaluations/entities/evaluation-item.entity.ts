import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Check,
  OneToMany,
} from 'typeorm';
import { Subject } from '../../../academic/subjects/entities/subject.entity';
import { AcademicPeriod } from '../../../academic/academic-periods/entities/academic-period.entity';
import { Grade } from '../../grades/entities/grade.entity';

@Entity('evaluation_items')
@Check(`"weight" >= 0 AND "weight" <= 100`)
// @Check is not directly a decorator provided by typeorm in all versions but Check constraint can be passed in Entity options if needed, or raw SQL.
// TypeORM supports check constraint via decorator since recent versions or via extra options.
// For now, adhering to schema.
export class EvaluationItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'subject_id' })
  subjectId: number;

  @ManyToOne(() => Subject, (subject) => subject.evaluationItems)
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;

  @Column({ name: 'academic_period_id' })
  academicPeriodId: number;

  @ManyToOne(() => AcademicPeriod, (period) => period.evaluationItems)
  @JoinColumn({ name: 'academic_period_id' })
  academicPeriod: AcademicPeriod;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ nullable: true })
  type: string;

  @Column({
    name: 'max_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  maxScore: number;

  @Column({ name: 'due_date', type: 'datetime', nullable: true })
  dueDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Grade, (grade) => grade.evaluationItem)
  grades: Grade[];
}
