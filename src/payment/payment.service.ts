import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentStatus } from './dto/payment.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>
  ) { }

  async updatePaymentStatus(paymentId: number, paymentStatus: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }

    if (!(paymentStatus in PaymentStatus)) {
      throw new BadRequestException('Invalid payment status');
    }

    // Cập nhật trạng thái payment với giá trị enum
    payment.status = PaymentStatus[paymentStatus as keyof typeof PaymentStatus];

    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find();
  }

  // Phương thức lấy một payment theo ID
  async findOne(id: number): Promise<Payment> {
    return this.paymentRepository.findOne({ where: { id } });
  }

  // Phương thức xóa payment theo ID
  async remove(id: number): Promise<void> {
    const payment = await this.paymentRepository.findOne({ where: { id } });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    await this.paymentRepository.remove(payment);
  }

}
