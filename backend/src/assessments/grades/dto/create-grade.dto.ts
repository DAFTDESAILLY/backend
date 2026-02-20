import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsNotEmpty()
  @IsNumber()
  studentAssignmentId: number;  // ✅ Campo obligatorio

  @IsNotEmpty()
  @IsNumber()
  evaluationItemId: number;

  @IsNotEmpty()
  @IsNumber()
  score: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
