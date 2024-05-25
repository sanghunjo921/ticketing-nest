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
  UploadedFiles,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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
  FilteredTicketReqDto,
  FindTicketReqDto,
  UpdateTicketReqDto,
} from './dto/req.dto';
import {
  CreateTicketResDto,
  FindTicketResDto,
  GetImageResDto,
  UpdateTicketResDto,
} from './dto/res.dto';
import { TicketService } from './ticket.service';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from 'src/config/multerOptions';
import cookieParser from 'cookie-parser';

@Controller('ticket')
@ApiTags('Ticket')
@ApiExtraModels(FindTicketReqDto, PageReqDto, FindTicketResDto, PageResDto)
export class TicketController {
  constructor(private readonly ticketSerivce: TicketService) {}

  // @ApiBearerAuth()
  @Test()
  @ApiPostResponse(CreateTicketResDto, 'Ticket is created successfully')
  @Post()
  create(
    @Body()
    {
      title,
      desc,
      price,
      remaining_number,
      status,
      category,
    }: CreateTicketReqDto,
  ): CreateTicketResDto | string {
    return this.ticketSerivce.create(
      title,
      price,
      remaining_number,
      desc,
      status,
      category,
    );
  }

  @Test()
  @Post('upload/:id')
  // @UseInterceptors(
  //   FilesInterceptor('files', 5, {
  //     storage: diskStorage({
  //       destination: './images',
  //       filename: editFileName,
  //     }),
  //     fileFilter: imageFileFilter,
  //   }),
  // )
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() image: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.ticketSerivce.uploadFile(image, id);
  }

  @Test()
  @Get(':id/images')
  getImage(@Param('id', ParseIntPipe) id: number): Promise<GetImageResDto> {
    return this.ticketSerivce.getImage(id);
  }

  @Public()
  @Post('dummyTikcets')
  createBulk() {
    return this.ticketSerivce.createBulkTickets();
  }

  @ApiGetPageResponse(FindTicketResDto, 'Find all ticket s')
  @Public()
  @Get()
  findAll(@Query() { page, size }: PageReqDto, @Req() req: Request) {
    // console.log({ cookie: req.headers });
    return this.ticketSerivce.findAll(page, size);
  }

  @ApiGetResponse(FindTicketResDto, 'Ticket found successfully')
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<FindTicketResDto> {
    return this.ticketSerivce.findOne(id);
  }

  @Public()
  @Get('search/filtered')
  getFilteredTickets(
    @Query() { page, size }: PageReqDto,
    @Query() { searchTerm }: FilteredTicketReqDto,
  ) {
    return this.ticketSerivce.getFilteredTickets(page, size, searchTerm);
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
