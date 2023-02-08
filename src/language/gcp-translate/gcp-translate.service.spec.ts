import { Test, TestingModule } from '@nestjs/testing';
import { HistoryEntity } from 'src/app/history/entities/history.entity';
import { HistoryService } from 'src/app/history/history.service';
import { TodoEntity } from 'src/app/todo/entity/todo.entity';
import { TodoService } from 'src/app/todo/todo.service';
import { GcpTranslateService } from './gcp-translate.service';

const todo: Partial<TodoEntity> = {
  id: 'todo-id',
  isDone: 1,
  task: 'valid-task',
};

const hist: Partial<HistoryEntity> = {
  id: 'hist-id',
  isDone: 1,
  task: 'valid-task',
  isTranslated: true,
};

describe('GcpTranslateService', () => {
  let gcpTranslateService: GcpTranslateService;
  let todoService: TodoService;
  let historyService: HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GcpTranslateService,
        {
          provide: TodoService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(todo),
          },
        },
        {
          provide: HistoryService,
          useValue: {
            create: jest.fn().mockReturnValue(hist),
          },
        },
      ],
    }).compile();

    gcpTranslateService = module.get<GcpTranslateService>(GcpTranslateService);
    todoService = module.get<TodoService>(TodoService);
    historyService = module.get<HistoryService>(HistoryService);
  });

  it('should be defined', () => {
    expect(gcpTranslateService).toBeDefined();
    expect(todoService).toBeDefined();
    expect(historyService).toBeDefined();
  });
});
