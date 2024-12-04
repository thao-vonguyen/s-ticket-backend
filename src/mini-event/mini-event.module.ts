import { Module } from '@nestjs/common';
import { MiniEventService } from './mini-event.service';
import { MiniEventController } from './mini-event.controller';
import { MiniEvent } from './entities/mini-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MiniEvent, TicketRank])],
  controllers: [MiniEventController],
  providers: [MiniEventService, TicketRankService],
})
export class MiniEventModule {}
