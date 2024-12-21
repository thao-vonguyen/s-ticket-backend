import { TicketRank } from "src/ticket-rank/entities/ticket-rank.entity";
import { Event } from "src/event/entities/event.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

    @ManyToOne(() => Event, (event) => event.miniEvents)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @OneToMany(() => TicketRank, (ticketRank) => ticketRank.miniEvent)
    ticketRanks: TicketRank[];
}

export class MiniEventWithTicketRank extends MiniEvent {
    ticketRanks: TicketRank[]
}
