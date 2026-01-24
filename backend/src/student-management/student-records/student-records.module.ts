import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentRecordsService } from './student-records.service';
import { StudentRecordsController } from './student-records.controller';
import { StudentRecord } from './entities/student-record.entity';
import { StudentRecordReply } from './entities/student-record-reply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentRecord, StudentRecordReply])],
  controllers: [StudentRecordsController],
  providers: [StudentRecordsService],
})
export class StudentRecordsModule { }
