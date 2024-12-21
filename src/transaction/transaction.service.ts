import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { Ticket } from 'src/ticket/entities/ticket.entity';
import { DataSource, Repository } from 'typeorm';
import { TransactionStatus } from './dto/transaction.dto';
import { MiniEvent } from 'src/mini-event/entities/mini-event.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { PaymentStatus } from 'src/payment/dto/payment.dto';
import { PaymentService } from 'src/payment/payment.service';
import { TicketStatus } from 'src/ticket/dto/ticket.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TicketRank) private readonly ticketRankRepository: Repository<TicketRank>,
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    private readonly dataSource: DataSource,
    private readonly paymentService: PaymentService
  ) { }

  async createTransaction(formData: any): Promise<Transaction> {
    const { user_id, show_id, tickets, payment_method } = formData;
    const miniEvent = await this.miniEventRepository.findOne({ where: { id: show_id } });
    if (!miniEvent) {
      throw new Error('MiniEvent not found');
    }

    const price = tickets.reduce((total: number, rank: any) => total + rank.buy_amount * rank.price, 0);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = this.paymentRepository.create({
        paymentMethod: payment_method,
        pricePayment: price,
        status: PaymentStatus.IN_PROGRESS,
      });

      const createdPayment = await this.paymentRepository.save(payment);

      const transaction = this.transactionRepository.create({
        userId: user_id,
        eventId: show_id,
        status: TransactionStatus.IN_PROGRESS,
        transactionItem: tickets,
        price,
        paymentId: createdPayment.id
      });

      const createdTrans = await this.transactionRepository.save(transaction);

      for (const rank of tickets) {
        const ticketRank = await queryRunner.manager.findOne(TicketRank, { where: { id: rank.ticket_id }, lock: { mode: 'pessimistic_write' } });
        if (ticketRank) {
          if (ticketRank.soldNumber + rank.buy_amount > ticketRank.numberLimit) {
            throw new BadRequestException(`Not enough tickets available for rank: ${rank.ticket_id}`);
          }
          ticketRank.soldNumber += rank.buy_amount;
          ticketRank.modifiedTime = new Date();
          await queryRunner.manager.save(ticketRank);
        }
      }
      await queryRunner.commitTransaction();

      setTimeout(async () => {
        const trans = await this.transactionRepository.findOne({ where: { id: createdTrans.id } });
        if (trans && trans.status === TransactionStatus.IN_PROGRESS) {
          await this.updatePaymentStatus(createdTrans.id, PaymentStatus.USER_CANCELLED);
        }
      }, 1 * 60 * 1000);
      return createdTrans;


    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updatePaymentStatus(transactionId: number, paymentStatus: string): Promise<Transaction> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.transactionRepository.findOne({ where: { id: transactionId } });
      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }

      const updatedPayment = await this.paymentService.updatePaymentStatus(transaction.paymentId, paymentStatus);
      if (!updatedPayment) {
        throw new BadRequestException('Failed to update payment status');
      }

      if (paymentStatus === PaymentStatus.SUCCESSFUL) {
        const ticketsToSave = [];
        for (const rank of transaction.transactionItem) {
          for (let i = 0; i < rank.buy_amount; i++) {
            const ticket = this.ticketRepository.create({
              transactionId: transaction.id,
              ticketRankId: rank.ticket_id,
              userId: transaction.userId,
              status: TicketStatus.UNUSED,
            });
            ticketsToSave.push(ticket);
          }
        }

        await queryRunner.manager.save(ticketsToSave);

        transaction.status = TransactionStatus.SUCCESSFUL;
      } else {
        for (const rank of transaction.transactionItem) {
          const ticketRank = await queryRunner.manager.findOne(TicketRank, { where: { id: rank.ticket_id }, lock: { mode: 'pessimistic_write' } });

          ticketRank.soldNumber -= rank.buy_amount;
          await queryRunner.manager.save(ticketRank);
        }

        transaction.status = TransactionStatus.CANCELLED;
      }

      await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();
      return transaction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
