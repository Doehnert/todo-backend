import { IsString } from 'class-validator';

export class TranslationResponseDto {
  @IsString()
  readonly translation?: string;
}
