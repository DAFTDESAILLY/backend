import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { Student } from './entities/student.entity';
import { StudentAssignment } from '../student-assignments/entities/student-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, StudentAssignment])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule { }
