import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateStudentRecordDto {
    @IsNotEmpty()
    @IsNumber()
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    contextId: number;

    @IsNotEmpty()
    @IsString()
    type: 'conducta' | 'tutoría' | 'médico' | 'cognitivo';

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdateStudentRecordDto extends PartialType(CreateStudentRecordDto) { }
