import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRecordsService } from './student-records.service';
import { StudentRecordsController } from './student-records.controller';
import { StudentRecord } from './entities/student-record.entity';
import { StudentRecordReply } from './entities/student-record-reply.entity';
import { Context } from '../../academic/contexts/entities/context.entity';
import { Student } from '../students/entities/student.entity';
import { FilesModule } from '../../files/files.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentRecord, StudentRecordReply, Context, Student]),
    FilesModule
  ],
  controllers: [StudentRecordsController],
  providers: [StudentRecordsService],
})
export class StudentRecordsModule { }
