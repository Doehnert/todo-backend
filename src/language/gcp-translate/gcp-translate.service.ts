import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';
import { CONFIG } from './config';
import {
  DetectResult,
  LanguageResult,
} from '@google-cloud/translate/build/src/v2';
import { TranslationResponseDto } from './dto/translation-response.dto';

@Injectable()
export class GcpTranslateService {
  async translate(
    text: string,
    targetLanguage: string,
  ): Promise<TranslationResponseDto> {
    const translateClient = new v2.Translate({
      projectId: CONFIG.googleCloud.projectId,
      keyFilename: './gcp-credential.json',
    });

    const [translation] = await translateClient.translate(text, targetLanguage);

    return { translation };
  }

  async detect(text: string): Promise<DetectResult> {
    const translateClient = new v2.Translate({
      projectId: CONFIG.googleCloud.projectId,
      keyFilename: './gcp-credential.json',
    });
    const [detections] = await translateClient.detect(text);

    return detections;
  }
}
