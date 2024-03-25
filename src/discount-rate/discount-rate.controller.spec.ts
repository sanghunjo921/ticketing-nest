import { Test, TestingModule } from '@nestjs/testing';
import { DiscountRateController } from './discount-rate.controller';

describe('DiscountRateController', () => {
  let controller: DiscountRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscountRateController],
    }).compile();

    controller = module.get<DiscountRateController>(DiscountRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
