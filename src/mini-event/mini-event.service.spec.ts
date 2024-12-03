import { Test, TestingModule } from '@nestjs/testing';
import { MiniEventService } from './mini-event.service';

describe('MiniEventService', () => {
  let service: MiniEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MiniEventService],
    }).compile();

    service = module.get<MiniEventService>(MiniEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
