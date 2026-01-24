import { IsNotEmpty, IsNumber } from 'class-validator';

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
}
