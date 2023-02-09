import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  password?: string;

  @IsOptional()
  roles?: Role;
}
