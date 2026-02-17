import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGradeDto {
    @IsNotEmpty()
    @IsNumber()
    evaluationItemId: number;

    @IsNotEmpty()
    @IsNumber()
    studentAssignmentId: number;

    @IsNotEmpty()
    @IsNumber()
    score: number;

    @IsOptional()
    @IsString()
    feedback?: string;
}
