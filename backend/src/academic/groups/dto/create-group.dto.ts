import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsNumber()
    academicPeriodId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    status?: 'active' | 'archived';
}
