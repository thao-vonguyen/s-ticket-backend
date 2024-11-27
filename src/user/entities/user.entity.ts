import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Gender } from '../dto/user.dto';

@Entity('user')
export class User {
  @Column({ name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar' })
  email: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'created_time', type: 'timestamp' })
  createdTime: string;

  @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
  modifiedTime: string;

  @Column({ name: 'event_description', type: 'text', nullable: true })
  description: string;
}