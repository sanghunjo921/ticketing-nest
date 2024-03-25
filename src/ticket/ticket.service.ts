import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTicketReqDto } from './dto/req.dto';
import { FindTicketResDto } from './dto/res.dto';
import { Ticket } from './entity/ticket.entity';
import { Status } from './type/ticket.enum';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
  ) {}
  async findAll(page: number, size: number) {
    const skip = (page - 1) * size;
    return this.ticketRepository.find({ skip: skip, take: size });
  }

  async findOne(id: number): Promise<FindTicketResDto> {
    return this.ticketRepository.findOneBy({ id });
  }

  async create(
    title: string,
    price: number,
    remaining_number: number,
    description?: string,
    status?: Status,
  ) {
    const ticket = this.ticketRepository.create({
      title,
      price,
      remaining_number,
      description,
      status,
    });

    return this.ticketRepository.save(ticket);
  }

  async createBulkTickets() {
    const dummyTickets = [];
    const totalCount = 3000;

    for (let i = 1; i <= totalCount; i++) {
      dummyTickets.push(
        this.ticketRepository.create({
          title: `Ticket ${i + 100}`,
          description: `Description for Ticket ${i}`,
          price: Math.floor(Math.random() * 100) + 50,
          remaining_number: Math.floor(Math.random() * 100) + 1,
        }),
      );
    }

    await this.ticketRepository.save(dummyTickets);
  }

  async update(id: number, updateData: UpdateTicketReqDto) {
    const target = await this.ticketRepository.findOneBy({ id });
    const { affected } = await this.ticketRepository.update(id, updateData);

    if (affected === 0) {
      throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);
    }
    return { ...target, ...updateData };
  }

  async delete(id: number) {
    const { affected } = await this.ticketRepository.delete(id);
    if (affected === 0) {
      throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);
    }
    return 'deleted';
  }
}
