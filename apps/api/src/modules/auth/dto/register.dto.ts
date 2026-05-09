import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Alisher' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ enum: Role, required: false, default: Role.USER })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
