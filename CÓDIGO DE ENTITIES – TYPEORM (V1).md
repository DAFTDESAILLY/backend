🧱 CÓDIGO DE ENTITIES – TYPEORM (V1)

Este documento contiene EL CÓDIGO REAL de las entities definido en el modelo v1.3. Todo el contenido está en formato Markdown (.md) y listo para copiar/pegar.

\---

1\. UserEntity

// src/users/user.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  OneToMany,  
  CreateDateColumn,  
  UpdateDateColumn,  
} from 'typeorm';  
import { RefreshToken } from '../auth/refresh-token.entity';  
import { Context } from '../academic/contexts/context.entity';

@Entity('users')  
export class User {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column({ unique: true })  
  email: string;

  @Column()  
  password: string;

  @Column()  
  name: string;

  @Column({  
    type: 'enum',  
    enum: \['active', 'inactive'\],  
    default: 'active',  
  })  
  status: 'active' | 'inactive';

  @OneToMany(() \=\> RefreshToken, token \=\> token.user)  
  refreshTokens: RefreshToken\[\];

  @OneToMany(() \=\> Context, context \=\> context.user)  
  contexts: Context\[\];

  @CreateDateColumn()  
  created\_at: Date;

  @UpdateDateColumn()  
  updated\_at: Date;  
}

\---

2\. RefreshTokenEntity

// src/auth/refresh-token.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  ManyToOne,  
  CreateDateColumn,  
} from 'typeorm';  
import { User } from '../users/user.entity';

@Entity('refresh\_tokens')  
export class RefreshToken {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column()  
  token\_hash: string;

  @Column()  
  expires\_at: Date;

  @ManyToOne(() \=\> User, user \=\> user.refreshTokens, {  
    onDelete: 'CASCADE',  
  })  
  user: User;

  @CreateDateColumn()  
  created\_at: Date;  
}

\---

3\. ContextEntity

// src/academic/contexts/context.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  ManyToOne,  
  CreateDateColumn,  
  UpdateDateColumn,  
} from 'typeorm';  
import { User } from '../../users/user.entity';

@Entity('contexts')  
export class Context {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column()  
  name: string;

  @Column()  
  level: string;

  @Column({ nullable: true })  
  institution?: string;

  @Column({  
    type: 'enum',  
    enum: \['active', 'archived', 'inactive'\],  
    default: 'active',  
  })  
  status: 'active' | 'archived' | 'inactive';

  @ManyToOne(() \=\> User, user \=\> user.contexts, {  
    onDelete: 'RESTRICT',  
  })  
  user: User;

  @CreateDateColumn()  
  created\_at: Date;

  @UpdateDateColumn()  
  updated\_at: Date;  
}

\---

4\. AcademicPeriodEntity

// src/academic/academic-periods/academic-period.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  ManyToOne,  
  OneToMany,  
  CreateDateColumn,  
  UpdateDateColumn,  
} from 'typeorm';  
import { Context } from '../contexts/context.entity';  
import { Group } from '../groups/group.entity';

@Entity('academic\_periods')  
export class AcademicPeriod {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column()  
  type: string;

  @Column({ type: 'date' })  
  start\_date: Date;

  @Column({ type: 'date' })  
  end\_date: Date;

  @Column({ default: 0 })  
  grace\_period\_days: number;

  @Column({  
    type: 'enum',  
    enum: \['active', 'archived'\],  
    default: 'active',  
  })  
  status: 'active' | 'archived';

  @ManyToOne(() \=\> Context, context \=\> context.id, { onDelete: 'RESTRICT' })  
  context: Context;

  @OneToMany(() \=\> Group, group \=\> group.academicPeriod)  
  groups: Group\[\];

  @CreateDateColumn()  
  created\_at: Date;

  @UpdateDateColumn()  
  updated\_at: Date;  
}

\---

5\. GroupEntity

// src/academic/groups/group.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  ManyToOne,  
  OneToMany,  
  CreateDateColumn,  
  UpdateDateColumn,  
} from 'typeorm';  
import { AcademicPeriod } from '../academic-periods/academic-period.entity';  
import { Subject } from '../subjects/subject.entity';

@Entity('groups')  
export class Group {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column()  
  name: string;

  @Column({  
    type: 'enum',  
    enum: \['active', 'archived'\],  
    default: 'active',  
  })  
  status: 'active' | 'archived';

  @ManyToOne(() \=\> AcademicPeriod, period \=\> period.groups, {  
    onDelete: 'RESTRICT',  
  })  
  academicPeriod: AcademicPeriod;

  @OneToMany(() \=\> Subject, subject \=\> subject.group)  
  subjects: Subject\[\];

  @CreateDateColumn()  
  created\_at: Date;

  @UpdateDateColumn()  
  updated\_at: Date;  
}

\---

6\. SubjectEntity

// src/academic/subjects/subject.entity.ts  
import {  
  Entity,  
  PrimaryGeneratedColumn,  
  Column,  
  ManyToOne,  
  CreateDateColumn,  
  UpdateDateColumn,  
} from 'typeorm';  
import { Group } from '../groups/group.entity';

@Entity('subjects')  
export class Subject {  
  @PrimaryGeneratedColumn()  
  id: number;

  @Column()  
  name: string;

  @Column({ default: true })  
  is\_general: boolean;

  @ManyToOne(() \=\> Group, group \=\> group.subjects, {  
    onDelete: 'CASCADE',  
  })  
  group: Group;

  @CreateDateColumn()  
  created\_at: Date;

  @UpdateDateColumn()  
  updated\_at: Date;  
}

\---

✅ ESTADO

Entities CORE y académicas completas

Listas para generar migración inicial

Compatibles con BD v1.3

\---

⏭️ SIGUIENTE BLOQUE

Students \+ Assignments

Evaluations \+ Grades

Files \+ Consents

