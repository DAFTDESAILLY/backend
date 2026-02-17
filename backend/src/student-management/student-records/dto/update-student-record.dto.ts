import { PartialType } from '@nestjs/mapped-types';
import { CreateStudentRecordDto } from './create-student-record.dto';

export class UpdateStudentRecordDto extends PartialType(
  CreateStudentRecordDto,
) {}
