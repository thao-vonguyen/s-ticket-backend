import { Module } from '@nestjs/common';
import { TicketRankService } from './ticket-rank.service';
import { TicketRankController } from './ticket-rank.controller';
import { TicketRank } from './entities/ticket-rank.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TicketRank])],
  controllers: [TicketRankController],
  providers: [TicketRankService],
})
export class TicketRankModule {}
