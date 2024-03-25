import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entity/ticket.entity';

@Injectable()
export class DummyService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  async createDummyTickets(): Promise<void> {
    try {
      const dummyTickets = [];
      for (let i = 1; i <= 1000; i++) {
        dummyTickets.push({
          title: `Ticket ${i}`,
          description: `Description for Ticket ${i}`,
          price: Math.floor(Math.random() * 100) + 50,
          remaining_number: Math.floor(Math.random() * 100) + 1,
        });
      }

      await this.ticketRepository.save(dummyTickets); // Bulk insert

      const tickets = await this.ticketRepository.find(); // Retrieve all tickets
    } catch (error) {}
  }
}
