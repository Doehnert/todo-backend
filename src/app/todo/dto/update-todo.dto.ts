import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTodoDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  @IsOptional()
  task: string;

  @IsNotEmpty()
  @IsIn([0, 1])
  @ApiProperty()
  @IsOptional()
  isDone: number;
}
