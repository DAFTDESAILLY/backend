import { IsDateString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateConsentDto {
  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  fromUserId: number;

  @IsNotEmpty()
  @IsNumber()
  toUserId: number;

  @IsNotEmpty()
  @IsDateString()
  expiresAt: string;
}
