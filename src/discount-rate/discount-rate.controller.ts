import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/dto/req.dto';
import { DiscountRateService } from './discount-rate.service';

@Controller('discount-rate')
@ApiTags('Discount Rate')
export class DiscountRateController {
  constructor(private readonly discountService: DiscountRateService) {}

  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @Post()
  insert() {
    return this.discountService.insertInitialData();
  }
}
