import { Injectable } from '@nestjs/common';
import { Ticket } from 'src/ticket/entity/ticket.entity';
import { TicketService } from 'src/ticket/ticket.service';
import { Category } from 'src/ticket/type/ticket.enum';
import {
  CreatePopularTicketInput,
  CreatePopularTicketOutput,
  GetPopularTicketOutput,
} from './dto/create-popular-ticket.dto';

@Injectable()
export class PopularTicketService {
  constructor(private readonly ticketService: TicketService) {}

  async getPopularTickets(): Promise<Ticket[]> {
    return this.ticketService.findAll(1, 10);
  }

  async getPopularTicketsByCategory(category: Category): Promise<Ticket[]> {
    return this.ticketService.findByCategory(category);
  }

  async getPopularTicketsByCategories(
    categories: Category[],
  ): Promise<GetPopularTicketOutput> {
    const ticket = [];

    categories.forEach((category) => {
      ticket.push(
        new Promise(async (resolve) => {
          resolve(await this.getPopularTicketsByCategory(category));
        }),
      );
    });

    const result = await Promise.all(ticket);

    const r = {};

    categories.forEach((category, i) => (r[category] = result[i]));

    return {
      ok: true,
      moviesTicket: r[Category.MOVIES],
      concertsTicket: r[Category.CONCERTS],
      sportsTicket: r[Category.SPORTS],
    };
  }

  async createTicket(
    ticket: CreatePopularTicketInput,
  ): Promise<CreatePopularTicketOutput> {
    try {
      const { title, price, remaining_number, description, status, category } =
        ticket;
      const currentTicket = await this.ticketService.findOneByTitle(title);

      if (currentTicket) {
        throw new Error('Ticket already exists');
      }

      const newTicket = await this.ticketService.create(
        title,
        price,
        remaining_number,
        description,
        status,
        category,
      );

      console.log({ newTicket });

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: error.message,
      };
    }
  }
}
