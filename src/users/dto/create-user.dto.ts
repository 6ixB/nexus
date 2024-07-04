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
  @ApiProperty({ type: String })
  email: string;

  @Type(() => String)
  @IsStrongPassword()
  @ApiProperty({ type: String })
  password: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  firstName: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String })
  lastName: string;
}
