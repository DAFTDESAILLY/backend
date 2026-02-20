import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

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
    @Min(0)
    weight: number;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsNumber()
    @Min(1)
    maxScore?: number;

    @IsOptional()
    @IsString()
    dueDate?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
