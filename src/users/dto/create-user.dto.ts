import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @Type(() => String)
  @IsEmail()
  @ApiProperty()
  email: string;

  @Type(() => String)
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;
}
