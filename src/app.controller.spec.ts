import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogHttpInterceptor } from './config/log/log-http.interceptor';
import { LogUtil } from './config/log/log.util';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: LogUtil,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            debug: jest.fn(),
            HttpInfo: jest.fn(),
            HttpSuccess: jest.fn(),
            HttpError: jest.fn(),
          },
        },
        {
          provide: LogHttpInterceptor,
          useValue: {
            intercept: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
