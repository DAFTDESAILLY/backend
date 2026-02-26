import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../../users/entities/user.entity';
import { Subject } from '../../../academic/subjects/entities/subject.entity';
import { Group } from '../../../academic/groups/entities/group.entity';

@Entity('plannings')
export class Planning {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    titulo: string;

    @Column({ type: 'date' })
    fecha_inicio: string;

    @Column({ type: 'date' })
    fecha_fin: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    metodologia: string;

    @Column({ type: 'text', nullable: true })
    propositos: string;

    @Column({ type: 'text', nullable: true })
    problematica: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    proyecto: string;

    @Column({ type: 'json' })
    contenido: Record<string, any>;

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'docente_id' })
    docente: User;

    @ManyToOne(() => Subject, { eager: true, nullable: true })
    @JoinColumn({ name: 'materia_id' })
    materia?: Subject;

    @ManyToOne(() => Group, { eager: true, nullable: true })
    @JoinColumn({ name: 'grupo_id' })
    grupo?: Group;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
