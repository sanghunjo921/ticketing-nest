import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateCouponReqDto } from './dto/req.dto';
import { Coupon } from './entity/coupon.entity';

@Injectable()
export class CouponService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponRepository: Repository<Coupon>,
  ) {}
  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    return this.couponRepository.find({ skip: skip, take: size });
  }

  async create(
    code: string,
    amount: number,
    expiryDate: number,
    isPercentage?: boolean,
  ) {
    const coupon = this.couponRepository.create({
      code,
      amount,
      expiryDate,
      isPercentage,
    });

    return this.couponRepository.save(coupon);
  }

  async update(id: number, updateData: UpdateCouponReqDto) {
    const target = await this.couponRepository.findOneBy({ id });
    const { affected } = await this.couponRepository.update(id, updateData);

    if (affected === 0) {
      throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);
    }
    return { ...target, ...updateData };
  }

  async delete(id: number) {
    const { affected } = await this.couponRepository.delete(id);
    if (affected === 0) {
      throw new HttpException('Coupon not found', HttpStatus.BAD_REQUEST);
    }
    return 'deleted';
  }
}
