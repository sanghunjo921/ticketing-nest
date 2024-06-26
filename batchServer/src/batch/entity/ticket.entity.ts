import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category, Status } from '../type/ticket.enum';
import { User } from './user.entity';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  title: string;

  @Column()
  description: string = 'No description yet';

  @Column({ type: 'enum', enum: Status })
  status: Status = Status.AVAILABLE;

  @Column()
  price: number;

  @Column()
  remaining_number: number;

  @Column({ nullable: true })
  imagePath: string;

  @Column({ type: 'enum', enum: Category, nullable: true })
  category?: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.tickets)
  @JoinTable()
  users: User[];
}
