import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketService {
  async findAll(page: number, size: number) {
    console.log({
      page: typeof page,
      size: typeof size,
    });
    return {
      message: 'All tickets',
    };
  }

  async findOne(id: any) {
    return { id: '111', title: 'ddd' };
  }

  async create(title: string, desc?: string) {
    console.log({ title, desc });
    throw new Error('ddd');
  }
}
