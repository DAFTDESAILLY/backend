import { PartialType } from '@nestjs/mapped-types'; // Note: nestjs/mapped-types might need to be installed or use generic
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) { }
