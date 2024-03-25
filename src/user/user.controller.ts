import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  ApiDeleteResponse,
  ApiGetResponse,
  ApiPostResponse,
  ApiUpdateResponse,
} from 'src/common/decorator/doc-res.decorator';
import { PageReqDto } from 'src/common/dto/req.dto';
import {
  CreateUserReqDto,
  DeleteUserReqDto,
  FindUserReqDto,
  UpdateUserReqDto,
} from './dto/req.dto';
import {
  CreateUserResDto,
  DeleteUserResDto,
  UpdateUserResDto,
  UserResDto,
  UsersResDto,
} from './dto/res.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiExtraModels(UsersResDto, UserResDto, FindUserReqDto)
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  update(
    @Param() { id }: FindUserReqDto,
    @Body(new ValidationPipe()) data: UpdateUserReqDto,
  ) {
    return this.userService.update(id, data);
  }

  @ApiDeleteResponse(DeleteUserResDto, 'User is updated successfully')
  @Delete(':id')
  delete(@Param() { id }: FindUserReqDto) {
    return this.userService.delete(id);
  }
}
