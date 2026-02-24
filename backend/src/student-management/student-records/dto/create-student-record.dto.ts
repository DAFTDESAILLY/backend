import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
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
    type: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    date?: Date;

    @IsNotEmpty()
    @IsString()
    description: string;
}

export class UpdateStudentRecordDto extends PartialType(CreateStudentRecordDto) { }
