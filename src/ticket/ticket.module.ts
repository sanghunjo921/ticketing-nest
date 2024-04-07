import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entity/ticket.entity';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), RedisModule, WinstonModule],
  providers: [TicketService],
  controllers: [TicketController],
  exports: [TicketService],
})
export class TicketModule {}
