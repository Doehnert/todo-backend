import { v2 } from '@google-cloud/translate';
import { DetectResult } from '@google-cloud/translate/build/src/v2';
import { Injectable } from '@nestjs/common';
import { HistoryService } from 'src/app/history/history.service';
import { TodoService } from 'src/app/todo/todo.service';
import { CONFIG } from './config';
import { TranslationResponseDto } from './dto/translation-response.dto';

@Injectable()
export class GcpTranslateService {
  constructor(
    private readonly todoService: TodoService,
    private readonly historyService: HistoryService,
  ) {}

  async translate(
    todoId: string,
    text: string,
    targetLanguage: string,
  ): Promise<TranslationResponseDto> {
    if (todoId) {
      const todo = await this.todoService.findOne(todoId);
      this.historyService.create(
        {
          isDone: todo.isDone,
          isTranslated: true,
          task: todo.task,
        },
        todo,
      );
    }

    const translateClient = new v2.Translate({
      projectId: CONFIG.googleCloud.projectId,
      keyFilename: './gcp-credential.json',
    });

    let translation;
    try {
      [translation] = await translateClient.translate(text, targetLanguage);
    } catch (error) {
      console.log(error.message);
    }
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
