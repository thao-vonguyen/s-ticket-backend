import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EventCategory, EventStatus } from '../dto/event.dto';
import { MiniEventWithTicketRank } from 'src/mini-event/entities/mini-event.entity';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn({ name: 'event_id' })
  id: number;

  @Column({ name: 'event_name', type: 'text' })
  name: string;

  @Column({ name: 'organization_id', type: 'int4' })
  organizationId: number;

  @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
  modifiedTime: Date;

  @Column({ name: 'event_description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image', type: 'text', nullable: true })
  image: string;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string;

  @Column({ name: 'category', type: 'enum', enum: EventCategory })
  category: EventCategory;

  @Column({ name: 'organizer_name', type: 'text', nullable: true })
  organizerName: string;
  
  @Column({ name: 'organizer_description', type: 'text', nullable: true })
  organizerDescription: string;

  @Column({ name: 'organizer_logo', type: 'text', nullable: true })
  organizerImage: string;

  @Column({ name: 'bank_account_name', type: 'text', nullable: true })
  bankAccountName: string;

  @Column({ name: 'bank_account_number', type: 'varchar', nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_name', type: 'text', nullable: true })
  bankName: string;

  @Column({ name: 'bank_branch', type: 'text', nullable: true })
  bankBranch: string;

  @Column({ name: 'status', type: 'enum', enum: EventStatus })
  status: EventStatus;

  @Column({ name: 'is_on_ad', type: 'bool' })
  isOnAd: boolean;

  @Column({ name: 'start_time', type: 'timestamp', nullable: true  })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true  })
  endTime: Date;
}

export class EventWithPrice extends Event {
  price: number;
}

export class EventWithMiniEventsAndTicketRanks extends EventWithPrice {
  miniEvents: MiniEventWithTicketRank[];
}