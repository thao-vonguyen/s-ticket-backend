import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TicketStatus } from "../dto/ticket.dto";


@Entity('ticket')
export class Ticket {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: Date;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: Date;

    @Column({ name: 'status', type: 'enum', enum: TicketStatus })
    status: TicketStatus;

    @Column({ name: 'ticket_rank_id', type: 'int4' })
    ticketRankId: number;

    @Column({ name: 'user_id', type: 'int4' })
    userId: number;

    @Column({ name: 'transaction_id', type: 'int4' })
    transaction_id: number;

}
