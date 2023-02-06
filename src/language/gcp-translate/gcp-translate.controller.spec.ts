import { Test, TestingModule } from '@nestjs/testing';
import { GcpTranslateController } from './gcp-translate.controller';
import { GcpTranslateService } from './gcp-translate.service';

const translatedResponse = {
  translation: 'translated text',
};

const detectResponse = {
  confidence: 1,
  language: 'en',
  input: 'English input text',
};

describe('GcpTranslateController', () => {
  let gcpTranslateController: GcpTranslateController;
  let gcpTranslateService: GcpTranslateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GcpTranslateController],
      providers: [
        {
          provide: GcpTranslateService,
          useValue: {
            translate: jest.fn().mockResolvedValue(translatedResponse),
            detect: jest.fn().mockResolvedValue(detectResponse),
          },
        },
      ],
    }).compile();

    gcpTranslateController = module.get<GcpTranslateController>(
      GcpTranslateController,
    );
    gcpTranslateService = module.get<GcpTranslateService>(GcpTranslateService);
  });

  it('should be defined', () => {
    expect(gcpTranslateController).toBeDefined();
    expect(gcpTranslateService).toBeDefined();
  });

  describe('translate', () => {
    it('should return a translated text to the specified language successfully', async () => {
      // Arrange
      const inputToTranslate = {
        text: 'input to be translated',
        to: 'en',
      };

      // Act
      const result = await gcpTranslateController.translate(inputToTranslate);

      // Assert
      expect(result).toEqual(translatedResponse);
    });

    it('should throw if gcpTranslateService throws', () => {
      // Arrange
      const inputToTranslate = {
        text: 'input to be translated',
        to: 'en',
      };
      jest
        .spyOn(gcpTranslateService, 'translate')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(
        gcpTranslateController.translate(inputToTranslate),
      ).rejects.toThrowError();
    });
  });

  describe('detectLanguage', () => {
    it('should return the detected language of the provided text', async () => {
      // Arrange
      const textInput = {
        text: 'text to be detected',
      };

      // Act
      const result = await gcpTranslateController.detectLanguage(textInput);

      // Assert
      expect(result).toEqual(detectResponse);
    });

    it('should throw if gcpTranslateService throws', () => {
      // Arrange
      const textInput = {
        text: 'text to be detected',
      };
      jest
        .spyOn(gcpTranslateService, 'detect')
        .mockRejectedValueOnce(new Error());

      // Assert
      expect(
        gcpTranslateController.detectLanguage(textInput),
      ).rejects.toThrowError();
    });
  });
});
