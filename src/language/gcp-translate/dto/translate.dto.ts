import { IsOptional, IsString } from 'class-validator';

export class TranslateDto {
  @IsOptional()
  @IsString()
  readonly todoId?: string;

  @IsString()
  readonly text: string;

  @IsString()
  readonly to: string;

  // @IsString()
  // readonly from?: string;
}
