import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { PageReqDto } from 'src/common/dto/req.dto';
import { FindTicketReqDto } from './dto/req.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('Ticket')
@ApiExtraModels(FindTicketReqDto, PageReqDto)
export class TicketController {
  constructor(private readonly ticketSerivce: TicketService) {}

  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.ticketSerivce.findAll(page, size);
  }

  @Get(':id')
  findOne(@Param() { id }: FindTicketReqDto) {
    return this.ticketSerivce.findOne(id);
  }
}
