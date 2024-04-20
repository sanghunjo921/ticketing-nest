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
  UseInterceptors,
  ValidationPipe,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteResponse,
  ApiGetPageResponse,
  ApiGetResponse,
  ApiPostResponse,
  ApiUpdateResponse,
} from 'src/common/decorator/doc-res.decorator';
import { Public, Test } from 'src/common/decorator/public.decorator';
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
import { Express } from 'express';

@Controller('ticket')
@ApiTags('Ticket')
@ApiExtraModels(FindTicketReqDto, PageReqDto, FindTicketResDto, PageResDto)
export class TicketController {
  constructor(private readonly ticketSerivce: TicketService) {}

  @ApiBearerAuth()
  @ApiPostResponse(CreateTicketResDto, 'Ticket is created successfully')
  @Post()
  create(
    @Body()
    { title, desc, price, remaining_number, status }: CreateTicketReqDto,
  ): CreateTicketResDto | string {
    return this.ticketSerivce.create(
      title,
      price,
      remaining_number,
      desc,
      status,
    );
  }

  @Test()
  @Patch('upload/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketSerivce.uploadFile(image, id);
  }

  @Public()
  @Post('dummyTikcets')
  createBulk() {
    return this.ticketSerivce.createBulkTickets();
  }

  @ApiGetPageResponse(FindTicketResDto, 'Find all ticket s')
  @Public()
  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.ticketSerivce.findAll(page, size);
  }

  @ApiGetResponse(FindTicketResDto, 'Ticket found successfully')
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FindTicketResDto> {
    return this.ticketSerivce.findOne(id);
  }

  @ApiUpdateResponse(UpdateTicketResDto, 'Ticket updated successfully')
  @Public()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateTicketReqDto,
  ): Promise<UpdateTicketResDto> {
    return this.ticketSerivce.update(id, data);
  }

  @ApiDeleteResponse(DeleteTicketReqDto, 'Ticket deleted')
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param() id: number) {
    return this.ticketSerivce.delete(id);
  }
}
