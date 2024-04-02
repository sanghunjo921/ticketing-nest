import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticketId: number;

  @Column({ nullable: true })
  couponId: number;

  @Column()
  totalPrice: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'bigint' })
  startTime: number;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
