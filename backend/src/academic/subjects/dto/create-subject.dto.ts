import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsObject } from 'class-validator';

export class CreateSubjectDto {
    @IsNotEmpty()
    @IsNumber()
    groupId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isGeneral?: boolean;

    @IsOptional()
    @IsObject()
    gradingScale?: Record<string, number>;
}
