import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './entities/transaction.entity';
import { PaymentStatus } from 'src/payment/dto/payment.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post('create')
  async create(@Body() body: { formData: any }): Promise<Transaction> {
    const { formData } = body;
    return this.transactionService.createTransaction(formData)
  }

  @Patch('payment-status')
  async updatePaymentStatus(
    @Body() body: { transactionId: number, paymentStatus: string }  // Truyền thông tin trong body
  ) {
    const { transactionId, paymentStatus } = body;
    return await this.transactionService.updatePaymentStatus(transactionId, paymentStatus);
  }
  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id);
  }
}
