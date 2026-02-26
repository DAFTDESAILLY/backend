import { IsOptional, IsDateString, IsNumber, IsString } from 'class-validator';

export class PlanningFilterDto {
    @IsOptional()
    @IsDateString()
    fecha_inicio?: string;

    @IsOptional()
    @IsDateString()
    fecha_fin?: string;

    @IsOptional()
    @IsNumber()
    materia_id?: number;

    @IsOptional()
    @IsString()
    search?: string;
}
