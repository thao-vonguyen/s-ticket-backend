import { Controller, Post, Body } from '@nestjs/common';
import { TicketRankService } from './ticket-rank.service';
import { TicketRank } from './entities/ticket-rank.entity';
import { CreateTicketRankDto } from './dto/create-ticketrank.dto';

@Controller('ticket-rank')
export class TicketRankController {
  constructor(private readonly ticketRankService: TicketRankService) {}
  @Post()
  async create(@Body() createTicketRankDto: CreateTicketRankDto): Promise<TicketRank> {
    return this.ticketRankService.create(createTicketRankDto);
  }
}
