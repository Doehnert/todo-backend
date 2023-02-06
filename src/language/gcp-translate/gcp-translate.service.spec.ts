import { Test, TestingModule } from '@nestjs/testing';
import { GcpTranslateService } from './gcp-translate.service';

describe('GcpTranslateService', () => {
  let service: GcpTranslateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GcpTranslateService],
    }).compile();

    service = module.get<GcpTranslateService>(GcpTranslateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
