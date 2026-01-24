import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentAssignmentDto {
    @IsNotEmpty()
    @IsNumber()
    studentId: number;

    @IsNotEmpty()
    @IsNumber()
    groupId: number;

    @IsOptional()
    @IsString()
    status?: 'active' | 'inactive';
}
