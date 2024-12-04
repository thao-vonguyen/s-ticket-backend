import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Gender, UserRole } from '../dto/user.dto';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'address', type: 'text' })
  address: string;

  @Column({ name: 'phone_number', type: 'varchar' })
  phoneNumber: string;

  @Column({ name: 'email', type: 'text', unique: true })
  email: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @CreateDateColumn({ name: 'created_time', type: 'timestamp' })
  createdTime: Date;

  @UpdateDateColumn({ name: 'modified_time', type: 'timestamp' })
  modifiedTime: Date;

  @Column({ name: 'role', type: 'enum', enum: UserRole })
  role: UserRole;
}