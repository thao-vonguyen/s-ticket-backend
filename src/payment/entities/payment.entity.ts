import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PaymentStatus } from "../dto/payment.dto";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'price_payment', type: 'int4' })
    pricePayment: number;

    @Column({ name: 'payment_method', type: 'varchar' })
    paymentMethod: string;

    @Column({ name: 'status', type: 'enum', enum: PaymentStatus })
    status: PaymentStatus;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: Date;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: Date;
}
