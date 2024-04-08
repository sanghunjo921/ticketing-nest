import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entity/ticket.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from 'src/config/logger.config';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), RedisModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
