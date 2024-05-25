import { Test, TestingModule } from '@nestjs/testing';
import { PopularTicketService } from './popular-ticket.service';

describe('PopularTicketService', () => {
  let service: PopularTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PopularTicketService],
    }).compile();

    service = module.get<PopularTicketService>(PopularTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
