import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAttendanceDto {
    @IsNotEmpty()
    @IsNumber()
    studentAssignmentId: number;

    @IsNotEmpty()
    @IsNumber()
    subjectId: number;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsNotEmpty()
    @IsString()
    status: 'present' | 'absent' | 'late';
}
