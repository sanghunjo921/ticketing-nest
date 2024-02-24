import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketService {
  findAll(page: number, size: number) {
    console.log({
      page: typeof page,
      size: typeof size,
    });
    return {
      message: 'All tickets',
    };
  }

  findOne(id: any) {
    return {
      message: 'Ticket',
    };
  }
}
