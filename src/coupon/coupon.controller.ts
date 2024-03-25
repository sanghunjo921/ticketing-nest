import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiGetPageResponse,
  ApiGetResponse,
  ApiPostResponse,
} from 'src/common/decorator/doc-res.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import { CouponService } from './coupon.service';
import { CreateCouponReqDto } from './dto/req.dto';
import { CreateCouponResDto, FindCouponResDto } from './dto/res.dto';

@Controller('coupon')
@ApiTags('Coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiGetPageResponse(FindCouponResDto, 'All coupons found successfully')
  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.couponService.findAll(page, size);
  }

  @ApiPostResponse(CreateCouponResDto, 'Coupon created')
  @Post()
  create(
    @Body() { code, amount, expiryDate, isPercentage }: CreateCouponReqDto,
  ): CreateCouponResDto {
    return this.couponService.create(code, amount, expiryDate, isPercentage);
  }

  @Delete(':id')
  delete(@Param() id: number) {
    return this.couponService.delete(id);
  }
}
