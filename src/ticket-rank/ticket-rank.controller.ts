import { Controller } from '@nestjs/common';
import { TicketRankService } from './ticket-rank.service';

@Controller('ticket-rank')
export class TicketRankController {
  constructor(private readonly ticketRankService: TicketRankService) {}
}
