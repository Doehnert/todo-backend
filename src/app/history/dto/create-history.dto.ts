import { IsOptional } from 'class-validator';

export class CreateHistoryDto {
  @IsOptional()
  isDone?: number;

  @IsOptional()
  isTranslated?: boolean;

  task: string;
}
