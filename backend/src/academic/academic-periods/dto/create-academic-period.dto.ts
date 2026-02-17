import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAcademicPeriodDto {
  @IsNotEmpty()
  @IsNumber()
  contextId: number;

  // ✅ AGREGAR ESTE CAMPO
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsNotEmpty()
  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  gracePeriodDays?: number;

  @IsOptional()
  @IsString()
  status?: 'active' | 'archived';
}
