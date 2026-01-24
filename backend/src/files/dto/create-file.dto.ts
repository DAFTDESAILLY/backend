import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFileDto {
    @IsNotEmpty()
    @IsString()
    fileName: string;

    @IsNotEmpty()
    @IsString()
    storageKey: string;

    @IsNotEmpty()
    @IsString()
    fileType: string;

    @IsNotEmpty()
    @IsString()
    fileCategory: 'evidence' | 'material' | 'planning';
}
