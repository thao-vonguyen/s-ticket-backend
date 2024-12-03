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
    createdTime: string;

    @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
    modifiedTime: string;

    @Column({ name: 'start_time', type: 'timestamp' })
    startTime: string;

    @Column({ name: 'end_time', type: 'timestamp', nullable: true })
    endTime: string;

    @Column({ name: 'image', type: 'text', nullable: true })
    image: string;
}
