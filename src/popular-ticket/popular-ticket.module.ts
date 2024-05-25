import { Module } from '@nestjs/common';
import { TicketModule } from 'src/ticket/ticket.module';
import { TicketService } from 'src/ticket/ticket.service';
import { PopularTicketResolver } from './popular-ticket.resolver';
import { PopularTicketService } from './popular-ticket.service';

@Module({
  imports: [TicketModule],
  providers: [PopularTicketService, PopularTicketResolver],
})
export class PopularTicketModule {}
