import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  ApiGetPageResponse,
  ApiGetResponse,
  ApiPostResponse,
} from 'src/common/decorator/doc-res.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import { CreateTicketReqDto, FindTicketReqDto } from './dto/req.dto';
import { CreateTicketResDto, FindTicketResDto } from './dto/res.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('Ticket')
@ApiExtraModels(FindTicketReqDto, PageReqDto, FindTicketResDto, PageResDto)
export class TicketController {
  constructor(private readonly ticketSerivce: TicketService) {}

  @ApiPostResponse(CreateTicketResDto, 'Ticket is created successfully')
  @Post()
  create(@Body() { title, desc }: CreateTicketReqDto): CreateTicketResDto {
    return this.ticketSerivce.create(title, desc);
  }

  @ApiGetPageResponse(FindTicketResDto, 'Find all tickets')
  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.ticketSerivce.findAll(page, size);
  }

  @ApiGetResponse(FindTicketResDto, 'Ticket found successfully')
  @Get(':id')
  findOne(@Param() { id }: FindTicketReqDto): Promise<FindTicketResDto> {
    return this.ticketSerivce.findOne(id);
  }
}
