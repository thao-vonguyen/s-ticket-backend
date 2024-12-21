import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { MiniEvent, MiniEventWithTicketRank } from 'src/mini-event/entities/mini-event.entity';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { TicketService } from 'src/ticket/ticket.service';
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentService } from 'src/payment/payment.service';
import { Event } from 'src/event/entities/event.entity';
import { EventService } from 'src/event/event.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TicketRank, Ticket, MiniEvent, Payment, Event, MiniEventWithTicketRank])],
  controllers: [TransactionController],
  providers: [TransactionService, TicketRankService, TicketService, MiniEventService, PaymentService, EventService],
})
export class TransactionModule { }
