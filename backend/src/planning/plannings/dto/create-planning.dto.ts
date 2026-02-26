import { IsString, IsDateString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreatePlanningDto {
    @IsString()
    titulo: string;

    @IsDateString()
    fecha_inicio: string;

    @IsDateString()
    fecha_fin: string;

    @IsOptional()
    @IsString()
    metodologia?: string;

    @IsOptional()
    @IsString()
    propositos?: string;

    @IsOptional()
    @IsString()
    problematica?: string;

    @IsOptional()
    @IsString()
    proyecto?: string;

    @IsOptional()
    @IsNumber()
    materia_id?: number;

    @IsOptional()
    @IsNumber()
    grupo_id?: number;

    @IsObject()
    contenido: {
        bloques: any[];
        [key: string]: any;
    };
}
