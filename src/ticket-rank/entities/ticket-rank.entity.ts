import { MiniEvent } from "src/mini-event/entities/mini-event.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ticket_rank')
export class TicketRank {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'rank_name', type: 'varchar' })
    rankName: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'number_limit', type: 'int2' })
    numberLimit: number;

    @Column({ name: 'price', type: 'int4' })
    price: number;

    @Column({ name: 'mini_event_id', type: 'int4' })
    miniEventId: number;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: Date;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: Date;

    @Column({ name: 'sold_number', type: 'int2' })
    soldNumber: number;

    @ManyToOne(() => MiniEvent, (event) => event.ticketRanks)
    @JoinColumn({ name: 'mini_event_id' })
    miniEvent: MiniEvent;
}
