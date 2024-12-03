import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('ticket-rank')
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

    @Column({ name: 'event_id', type: 'int4' })
    eventId: number;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: string;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: string;

    @Column({ name: 'sold_number', type: 'int2' })
    soldNumber: number;
}
