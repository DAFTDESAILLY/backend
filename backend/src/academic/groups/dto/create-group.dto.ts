import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
    @IsNotEmpty()
    @IsNumber()
    academicPeriodId: number;

    @IsNotEmpty()
    @IsString()
    name: string;
}
