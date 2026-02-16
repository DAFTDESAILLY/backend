import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateEvaluationDto { // Matching 'evaluations' module
    @IsNotEmpty()
    @IsNumber()
    subjectId: number;

    @IsOptional()
    @IsNumber()
    academicPeriodId?: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    maxScore?: number;

    @IsOptional()
    @IsString()
    dueDate?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
