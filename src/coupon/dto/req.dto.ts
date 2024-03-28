import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Coupon } from '../entity/coupon.entity';

export class FindCouponReqDto {
  @ApiProperty({
    required: true,
  })
  @IsNumber()
  id: number;
}

export class CreateCouponReqDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(10)
  code: string;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  @Min(0)
  @ValidateIf((coupon: CreateCouponReqDto) => coupon.isPercentage)
  @Max(100)
  @ValidateIf((coupon: CreateCouponReqDto) => !coupon.isPercentage)
  @Max(100000)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPercentage: boolean;

  @ApiProperty({
    required: true,
  })
  @IsNumber()
  expiryDate: number;
}

export class UpdateCouponReqDto {
  @ApiPropertyOptional()
  @IsOptional()
  @MinLength(5)
  @MaxLength(10)
  code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional()
  @IsOptional()
  expiryDate?: number;
}
