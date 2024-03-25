import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountRateController } from './discount-rate.controller';
import { DiscountRateService } from './discount-rate.service';
import { DiscountRate } from './entity/discountRate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountRate])],
  controllers: [DiscountRateController],
  providers: [DiscountRateService],
  exports: [DiscountRateService],
})
export class DiscountRateModule {}
