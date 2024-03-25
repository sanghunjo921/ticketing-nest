import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  DiscountRate,
  discountRateInstances,
} from './entity/discountRate.entity';

@Injectable()
export class DiscountRateService {
  constructor(
    @InjectRepository(DiscountRate)
    private readonly discountRepository: Repository<DiscountRate>,
  ) {}
  async findAll() {
    return await this.discountRepository.find();
  }

  async insertInitialData() {
    await this.discountRepository.save(discountRateInstances);
  }
}
