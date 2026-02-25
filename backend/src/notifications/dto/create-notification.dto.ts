import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateNotificationDto {
    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsEnum(['info', 'success', 'warning', 'error', 'agenda'])
    @IsOptional()
    type?: 'info' | 'success' | 'warning' | 'error' | 'agenda';

    @IsString()
    @IsOptional()
    actionUrl?: string;

    @IsBoolean()
    @IsOptional()
    isRead?: boolean;
}
