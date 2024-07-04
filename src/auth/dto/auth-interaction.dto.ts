import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';

class LoginDto {
  @IsString()
  @ApiProperty({ type: String })
  accountId: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  acr?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ type: [String], required: false })
  amr?: string[];

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ type: Boolean, required: false })
  remember?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ type: Number, required: false })
  ts?: number;
}

class ConsentDto {
  @Type(() => String)
  @IsString()
  @ApiProperty({ type: String, required: false })
  grantId?: string;
}

export class AuthInteractionDto {
  @Type(() => LoginDto)
  @ValidateNested()
  @IsOptional()
  @ApiProperty({ type: LoginDto, required: false })
  login?: LoginDto;

  @Type(() => ConsentDto)
  @ValidateNested()
  @IsOptional()
  @ApiProperty({ type: ConsentDto, required: false })
  consent?: ConsentDto;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  error?: string;

  @Type(() => String)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: String, required: false })
  error_description?: string;
}
