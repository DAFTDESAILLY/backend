import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';

export class CreateStudentDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    fullName?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    email?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    studentId?: string; // Frontend sends 'studentId' (enrollment code)

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    phone?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    address?: string;

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    status?: 'active' | 'archived' | 'inactive';

    @IsOptional()
    @Transform(({ value }) => value === "" ? undefined : value)
    @IsString()
    notes?: string;
}

export class UpdateStudentDto extends PartialType(CreateStudentDto) { }
