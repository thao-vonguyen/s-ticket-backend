import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('event')
export class Event {
  @PrimaryGeneratedColumn({ name: 'event_id' })
  id: number;

  @Column({ name: 'event_name', type: 'text' })
  name: string;

  @Column({ name: 'organization_id', type: 'int4' })
  organizationId: number;

  @Column({ name: 'created_time', type: 'timestamp' })
  createdTime: string;

  @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
  modifiedTime: string;

  @Column({ name: 'event_description', type: 'text', nullable: true })
  description: string;
}