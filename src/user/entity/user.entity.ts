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
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { InternalServerErrorException } from '@nestjs/common';
import { Comment } from 'src/comment/entities/comment.entity';

registerEnumType(Role, { name: 'Role' });

@InputType({
  isAbstract: true,
})
@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({
    unique: true,
  })
  @Field(() => String)
  email: string;

  @Column({ nullable: true })
  @IsOptional()
  @Field(() => String, { nullable: true })
  password: string;

  @Column({ default: 'none' })
  @Field(() => String)
  provider: string;

  @Column({ type: 'enum', enum: Role })
  @Field(() => Role)
  role: Role = Role.CONSUMER;

  @Column({ type: 'enum', enum: Membership })
  @Field(() => Membership)
  membership: Membership = Membership.BRONZE;

  @Column({ default: false })
  @Field(() => Boolean)
  verified: boolean;

  // @BeforeInsert()
  // async hashPassword(): Promise<void> {
  //   try {

  //     this.password = await bcrypt.hash(this.password)

  //   } catch(error) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async isMatchedPassword(password: string): Promise<boolean> {
  // try {
  //   const isMatch = await bcrypt.compare(password, this.password);
  //   return isMatch
  // } catch (error) {
  //   throw new InternalServerErrorException()
  // }
  // }

  @CreateDateColumn({ name: 'created_at' })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field(() => Date)
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

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
