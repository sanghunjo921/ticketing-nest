import { Module, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { DiscountRate } from 'src/discount-rate/entity/discountRate.entity';
import { Transaction } from './entity/transaction.entity';
import { Coupon } from 'src/coupon/entity/coupon.entity';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';
import { UserResolver } from './user.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ticket, DiscountRate, Transaction, Coupon]), //forFeature: dynamic module: uses register to create a function like forRoot
    RedisModule, //static module
    RabbitMqModule,
  ],
  providers: [UserService, Logger, UserResolver],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
