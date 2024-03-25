import { Test, TestingModule } from '@nestjs/testing';
import { DiscountRateService } from './discount-rate.service';

describe('DiscountRateService', () => {
  let service: DiscountRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountRateService],
    }).compile();

    service = module.get<DiscountRateService>(DiscountRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
