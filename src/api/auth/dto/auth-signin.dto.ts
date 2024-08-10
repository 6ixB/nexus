import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSignInDto {
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  email: string;

  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: String, required: true })
  password: string;
}
