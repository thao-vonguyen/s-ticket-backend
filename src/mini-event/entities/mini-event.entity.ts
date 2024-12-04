import { TicketRank } from "src/ticket-rank/entities/ticket-rank.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('mini_event')
export class MiniEvent {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'event_id', type: 'int4' })
    eventId: number;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
    createdTime: Date;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: Date;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime: Date;

    @Column({ name: 'image', type: 'text', nullable: true })
    image: string;
}

export class MiniEventWithTicketRank extends MiniEvent {
    ticketRanks: TicketRank[]
}
