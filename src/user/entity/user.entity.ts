import { RefreshToken } from 'src/auth/entity/refreshToken.entity';
import { Coupon } from 'src/coupon/entity/coupon.entity';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Membership, Role } from '../type/user.enum';
import { Transaction } from './transaction.entity';
import { IsOptional } from 'class-validator';
import { ProviderType } from 'src/auth/type/auth.type';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  password: string;

  @Column({ default: 'none' })
  provider: string;

  @Column({ type: 'enum', enum: Role })
  role: Role = Role.CONSUMER;

  @Column({ type: 'enum', enum: Membership })
  membership: Membership = Membership.BRONZE;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => DiscountRate, (discountRate) => discountRate.users)
  @JoinTable()
  discountRate: DiscountRate;

  @ManyToMany(() => Ticket, (ticket) => ticket.users)
  tickets: Ticket[];

  @ManyToMany(() => Coupon, (coupon) => coupon.users)
  @JoinTable()
  coupons: Coupon[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @JoinColumn()
  transactions: Transaction[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshToken: RefreshToken;
}
