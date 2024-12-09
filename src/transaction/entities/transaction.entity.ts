import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TransactionStatus } from "../dto/transaction.dto";

@Entity('transaction')
export class Transaction {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'price', type: 'int4' })
    price: number;

    @Column({ name: 'status', type: 'enum', enum: TransactionStatus })
    status: TransactionStatus;

    @Column({ name: 'payment_id', type: 'int8' })
    paymentId: number;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: Date;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: Date;

    @Column({ name: 'user_id', type: 'int4' })
    userId: number;

    @Column({ name: 'transaction_item', type: 'jsonb' })
    transactionItem: object;
}
