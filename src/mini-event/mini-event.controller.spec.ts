import { Test, TestingModule } from '@nestjs/testing';
import { MiniEventController } from './mini-event.controller';
import { MiniEventService } from './mini-event.service';

describe('MiniEventController', () => {
  let controller: MiniEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MiniEventController],
      providers: [MiniEventService],
    }).compile();

    controller = module.get<MiniEventController>(MiniEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
