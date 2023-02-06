import {
  DetectResult,
  LanguageResult,
} from '@google-cloud/translate/build/src/v2';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { DetectDto } from './dto/detect.dto';
import { LanguagesDto } from './dto/languages.dto';
import { TranslateDto } from './dto/translate.dto';
import { TranslationResponseDto } from './dto/translation-response.dto';
import { GcpTranslateService } from './gcp-translate.service';

@Controller('gcp-translate')
export class GcpTranslateController {
  constructor(private readonly gcpTranslateService: GcpTranslateService) {}

  @Post('translate')
  async translate(
    @Body() translateDto: TranslateDto,
  ): Promise<TranslationResponseDto> {
    return this.gcpTranslateService.translate(
      translateDto.text,
      translateDto.to,
    );
  }

  @Post('detect')
  async detectLanguage(@Body() detectDto: DetectDto): Promise<DetectResult> {
    return this.gcpTranslateService.detect(detectDto.text);
  }
}
