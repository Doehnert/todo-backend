import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryEntity } from './entities/history.entity';
import { HistoryService } from './history.service';

const historyEntity: HistoryEntity = {
  id: 'hist-id',
  isDone: 1,
  task: 'valid-task',
  isTranslated: true,
  createdAt: null,
  todo: null,
};

describe('HistoryService', () => {
  let historyService: HistoryService;
  let historyRepository: Repository<HistoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: getRepositoryToken(HistoryEntity),
          useValue: {
            create: jest.fn().mockReturnValue(historyEntity),
            save: jest.fn().mockResolvedValue(historyEntity),
          },
        },
      ],
    }).compile();

    historyService = module.get<HistoryService>(HistoryService);
    historyRepository = module.get<Repository<HistoryEntity>>(
      getRepositoryToken(HistoryEntity),
    );
  });

  it('should be defined', () => {
    expect(historyService).toBeDefined();
    expect(historyRepository).toBeDefined();
  });
});
