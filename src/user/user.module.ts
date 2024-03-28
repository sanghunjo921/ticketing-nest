import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Transaction } from './entity/transaction.entity';
import { Coupon } from 'src/coupon/entity/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ticket, DiscountRate, Transaction, Coupon]),
    RedisModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
