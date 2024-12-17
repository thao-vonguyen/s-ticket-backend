import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity'
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { MiniEvent, MiniEventWithTicketRank } from 'src/mini-event/entities/mini-event.entity';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, MiniEvent, TicketRank, MiniEventWithTicketRank])],
  controllers: [EventController],
  providers: [EventService, MiniEventService, TicketRankService],
})
export class EventModule {}
