import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAttendanceDto {
    @IsOptional()
    @IsNumber()
    studentAssignmentId?: number;

    @IsOptional()
    @IsNumber()
    studentId?: number;

    @IsOptional()
    @IsNumber()
    groupId?: number;

    @IsOptional()
    @IsNumber()
    subjectId?: number;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    status: 'present' | 'absent' | 'late';

    @IsOptional()
    @IsString()
    notes?: string;
}
