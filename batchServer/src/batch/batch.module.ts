import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Ticket } from './entity/ticket.entity';
import { Transaction } from './entity/transaction.entity';
import { User } from './entity/user.entity';
import { Coupon } from './entity/coupon.entity';
import { DiscountRate } from './entity/discountRate.entity';
import { RefreshToken } from './entity/refreshToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ticket,
      Transaction,
      User,
      Coupon,
      DiscountRate,
      RefreshToken,
    ]),
    RedisModule,
  ],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
