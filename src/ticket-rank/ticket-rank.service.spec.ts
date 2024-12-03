import { Test, TestingModule } from '@nestjs/testing';
import { TicketRankService } from './ticket-rank.service';

describe('TicketRankService', () => {
  let service: TicketRankService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketRankService],
    }).compile();

    service = module.get<TicketRankService>(TicketRankService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
