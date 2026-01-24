import { IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateStudentDto {
    @IsNotEmpty()
    @IsString()
    fullName: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) { }
