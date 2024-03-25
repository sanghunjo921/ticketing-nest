import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteResponse,
  ApiGetPageResponse,
  ApiGetResponse,
  ApiPostResponse,
  ApiUpdateResponse,
} from 'src/common/decorator/doc-res.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import { PageResDto } from 'src/common/dto/res.dto';
import {
  CreateTicketReqDto,
  DeleteTicketReqDto,
  FindTicketReqDto,
  UpdateTicketReqDto,
} from './dto/req.dto';
import {
  CreateTicketResDto,
  FindTicketResDto,
  UpdateTicketResDto,
} from './dto/res.dto';
import { TicketService } from './ticket.service';

@Controller('ticket')
@ApiTags('Ticket')
@ApiExtraModels(FindTicketReqDto, PageReqDto, FindTicketResDto, PageResDto)
export class TicketController {
  constructor(private readonly ticketSerivce: TicketService) {}

  @ApiPostResponse(CreateTicketResDto, 'Ticket is created successfully')
  @Post()
  create(
    @Body()
    { title, desc, price, remaining_number, status }: CreateTicketReqDto,
  ): CreateTicketResDto {
    return this.ticketSerivce.create(
      title,
      price,
      remaining_number,
      desc,
      status,
    );
  }

  @Post('dummyTikcets')
  createBulk() {
    return this.ticketSerivce.createBulkTickets();
  }

  @ApiGetPageResponse(FindTicketResDto, 'Find all tickets')
  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.ticketSerivce.findAll(page, size);
  }

  @ApiGetResponse(FindTicketResDto, 'Ticket found successfully')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FindTicketResDto> {
    return this.ticketSerivce.findOne(id);
  }

  @ApiUpdateResponse(UpdateTicketResDto, 'Ticket updated successfully')
  @Patch(':id')
  update(
    @Param() id: number,
    @Body(new ValidationPipe()) data: UpdateTicketReqDto,
  ): Promise<UpdateTicketResDto> {
    return this.ticketSerivce.update(id, data);
  }

  @ApiDeleteResponse(DeleteTicketReqDto, 'Ticket deleted')
  @Delete(':id')
  delete(@Param() id: number) {
    return this.ticketSerivce.delete(id);
  }
}
