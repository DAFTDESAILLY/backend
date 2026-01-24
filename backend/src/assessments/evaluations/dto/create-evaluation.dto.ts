import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEvaluationDto { // Matching 'evaluations' module
    @IsNotEmpty()
    @IsNumber()
    subjectId: number;

    @IsNotEmpty()
    @IsNumber()
    academicPeriodId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    weight: number;
}
