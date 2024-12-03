import { Test, TestingModule } from '@nestjs/testing';
import { TicketRankController } from './ticket-rank.controller';
import { TicketRankService } from './ticket-rank.service';

describe('TicketRankController', () => {
  let controller: TicketRankController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketRankController],
      providers: [TicketRankService],
    }).compile();

    controller = module.get<TicketRankController>(TicketRankController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
