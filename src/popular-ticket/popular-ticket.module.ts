import { Module } from '@nestjs/common';
import { TicketModule } from 'src/ticket/ticket.module';
import { TicketService } from 'src/ticket/ticket.service';

@Module({
  imports: [TicketModule],
  providers: [],
})
export class PopularTicketModule {}
