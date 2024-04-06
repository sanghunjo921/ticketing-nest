import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteResponse,
  ApiGetResponse,
  ApiPostResponse,
  ApiUpdateResponse,
} from 'src/common/decorator/doc-res.decorator';
import { Public, Test } from 'src/common/decorator/public.decorator';
import { Roles } from 'src/common/decorator/role.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import {
  CreateUserReqDto,
  DeleteUserReqDto,
  FindUserReqDto,
  IssueCouponReqDto,
  PurchaseTicketReqDto,
  ReserveTicketReqDto,
  UpdateUserReqDto,
} from './dto/req.dto';
import {
  CreateUserResDto,
  DeleteUserResDto,
  UpdateUserResDto,
  UserResDto,
  UsersResDto,
} from './dto/res.dto';
import { Role } from './type/user.enum';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiExtraModels(UsersResDto, UserResDto, FindUserReqDto, UpdateUserReqDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiGetResponse(UserResDto, 'All users found successfully')
  @Get()
  findAll(@Query() { page, size }: PageReqDto) {
    return this.userService.findAll(page, size);
  }

  @ApiGetResponse(UserResDto, 'User found successfully')
  @Get(':id')
  findOne(@Param() { id }: FindUserReqDto): Promise<UserResDto> {
    return this.userService.findOne(id);
  }

  @ApiPostResponse(CreateUserResDto, 'User is created successfully')
  @Post()
  create(
    @Body() { email, password }: CreateUserReqDto,
  ): Promise<CreateUserResDto> {
    return this.userService.create(email, password);
  }

  @ApiUpdateResponse(UpdateUserResDto, 'User is updated successfully')
  @Put(':id')
  update(@Param() { id }: FindUserReqDto, @Body() data: UpdateUserReqDto) {
    console.log({ id });
    return this.userService.update(id, data);
  }

  @ApiDeleteResponse(DeleteUserResDto, 'User is updated successfully')
  @Delete(':id')
  delete(@Param() { id }: FindUserReqDto) {
    return this.userService.delete(id);
  }

  @Test()
  @Post(':id/reserve')
  reserveTicket(
    @Param() { id }: FindUserReqDto,
    @Body() { ticketId, quantity }: ReserveTicketReqDto,
  ) {
    return this.userService.reserveTicket(id, ticketId, quantity);
  }

  @Post(':id/coupon')
  issueCoupon(
    @Param() { id }: FindUserReqDto,
    @Body() { couponId }: IssueCouponReqDto,
  ) {
    return this.userService.issueCoupon(id, couponId);
  }

  @Test()
  @Post(':id/ticket/:ticketId/purchase')
  purchase(
    @Param() { id }: FindUserReqDto,
    @Param('ticketId', ParseIntPipe) ticketId: number,
    @Body() { couponId }: PurchaseTicketReqDto,
  ) {
    return this.userService.purchase(id, ticketId, couponId);
  }

  @Get(':id/purchaseHistory')
  getPurchaseHistory(
    @Param() { id }: FindUserReqDto,
    @Query() { page, size }: PageReqDto,
  ) {
    return this.userService.getPurchaseHistory(id, page, size);
  }
}
