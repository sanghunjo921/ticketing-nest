import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UpdateTicketReqDto } from './dto/req.dto';
import { FindTicketResDto, GetImageResDto } from './dto/res.dto';
import { Ticket } from './entity/ticket.entity';
import { Category, Status } from './type/ticket.enum';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import fs from 'fs';
import { AwsService } from 'src/aws/aws.service';

@Injectable()
export class TicketService {
  private readonly logger = new Logger(TicketService.name);
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRedis()
    private readonly redisService: Redis,
    @Inject(AwsService) private readonly awsService: AwsService,
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
    const ticket = await this.ticketRepository.findOneBy({ id });

    return ticket;
  }

  async findOneByTitle(title: string): Promise<Ticket> {
    return this.ticketRepository.findOne({
      where: {
        title,
      },
    });
  }

  async findByCategory(category: Category): Promise<Ticket[]> {
    const tickets = this.ticketRepository.find({
      where: {
        category,
      },
    });
    return tickets;
  }

  async getFilteredTickets(page: number, size: number, searchTerm: string) {
    try {
      console.log({ page });
      const skip = (page - 1) * size;

      const tickets = await this.ticketRepository.find({
        where: {
          title: Like(`%${searchTerm}%`),
        },
        skip: skip,
        take: size,
      });

      return tickets;
    } catch (error) {
      this.logger.error('An error occurred while fetching tickets:', error);
      throw error;
    }
  }

  async getImage(id: number): Promise<GetImageResDto> {
    const ticket = await this.ticketRepository.findOneBy({ id });

    const image = await this.getImageBase64(ticket.imagePath);

    return { image };
  }

  private async getImageBase64(imagePath: string): Promise<string> {
    try {
      const image = await fs.promises.readFile(imagePath);
      return Buffer.from(image).toString('base64');
    } catch (error) {
      this.logger.error('error when fetching image', error);
      return null;
    }
  }

  async uploadFile(image: Express.Multer.File, id: number) {
    const ticket = await this.ticketRepository.findOneBy({ id });

    const ext = image.originalname.split('.').pop();

    const imageUrl = await this.awsService.imageUploadToS3(
      `${id}.${ext}`,
      image,
      ext,
    );

    ticket.imagePath = imageUrl;

    await this.ticketRepository.save(ticket);

    return { imageUrl };
  }

  async create(
    title: string,
    price: number,
    remaining_number: number,
    description?: string,
    status?: Status,
    category?: Category,
  ) {
    const ticket = this.ticketRepository.create({
      title,
      price,
      remaining_number,
      description,
      status,
      category,
    });

    console.log({ ticket });

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
    try {
      const { affected } = await this.ticketRepository.delete(id);
      if (affected === 0) {
        throw new HttpException('Ticket not found', HttpStatus.BAD_REQUEST);
      }

      this.logger.log('Invalidating cache for all ticket pages');

      const deletedTicketIndex = await this.findIndexById(id);

      const deletedTicketPage = Math.ceil((deletedTicketIndex + 1) / 10);
      const totalTickets = await this.ticketRepository.count();
      const totalPages = Math.ceil(totalTickets / 10);

      for (let page = deletedTicketPage; page <= totalPages; page++) {
        const ticketKey = `tickets_page_${page}`;
        await this.redisService.del(ticketKey);
        this.logger.log(`Cache invalidated for key: ${ticketKey}`);
      }
      return 'deleted';
    } catch (error) {
      this.logger.error('An error occured while deleting the ticket', error);
      throw error;
    }
  }

  async findIndexById(id: number): Promise<number> {
    const tickets = await this.ticketRepository.find({
      select: ['id'],
    });

    const index = tickets.findIndex((ticket) => ticket.id === id);

    return index;
  }
}
