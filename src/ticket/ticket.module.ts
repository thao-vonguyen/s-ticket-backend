import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { MiniEvent, MiniEventWithTicketRank } from 'src/mini-event/entities/mini-event.entity';
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { EventService } from 'src/event/event.service';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, MiniEvent, TicketRank, Event, MiniEventWithTicketRank])],
  controllers: [TicketController],
  providers: [TicketService, MiniEventService, EventService, TicketRankService],
})
export class TicketModule { }
