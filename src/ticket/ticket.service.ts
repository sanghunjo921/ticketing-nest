import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateTicketReqDto } from './dto/req.dto';
import { FindTicketResDto } from './dto/res.dto';
import { Ticket } from './entity/ticket.entity';
import { Status } from './type/ticket.enum';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import path from 'path';
import fs from 'fs';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRedis()
    private readonly redisService: Redis,
  ) {}
  async findAll(page: number, size: number) {
    try {
      const skip = (page - 1) * size;
      const ticketKey = `tickets_page_${page}`;

      this.logger.log('Access to Redis to retrieve ticket data');
      let tickets = JSON.parse(await this.redisService.get(ticketKey));
      this.logger.log('Finished retrieving ticket data from redis');

      if (!tickets) {
        this.logger.log('No cache for ticket data. Fetching from db');
        tickets = await this.ticketRepository.find({ skip: skip, take: size });
        this.logger.log('Finished retrieving ticket from db');

        if (tickets && tickets.length !== 0) {
          this.logger.log('Trying to cache tickets in cache');
          await this.redisService.set(ticketKey, JSON.stringify(tickets));
          this.logger.log('Finished caching tickets');
        }
      }

      return tickets;
    } catch (error) {
      this.logger.error('An error occurred while fetching tickets:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<FindTicketResDto> {
    return this.ticketRepository.findOneBy({ id });
  }

  async uploadFile(image: Express.Multer.File, id: number) {
    const ticket = await this.ticketRepository.findOneBy({ id });

    console.log(image);

    if (image) {
      const imagePath = path.join('src/images', image.filename);

      await fs.promises.copyFile(image.path, imagePath);
      ticket.imagePath = imagePath;

      await this.ticketRepository.save(ticket);
    }
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
